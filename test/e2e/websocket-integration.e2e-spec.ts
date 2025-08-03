import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { io, Socket } from 'socket.io-client';
import { AppModule } from '../../src/app.module';
import { CMSWebSocketService } from '../../src/modules/cms/cms-websocket.service';
import { CMSEvents } from '../../src/modules/cms/cms.events';

describe('WebSocket Integration (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let cmsWebSocketService: CMSWebSocketService;
  let client: Socket;
  let serverUrl: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    cmsWebSocketService = moduleFixture.get<CMSWebSocketService>(CMSWebSocketService);

    await app.listen(0); // Use random port
    const server = app.getHttpServer();
    const address = server.address();
    const port = typeof address === 'string' ? address : address?.port;
    serverUrl = `http://localhost:${port}`;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    // Create new client for each test
    client = io(serverUrl, {
      autoConnect: false,
      transports: ['websocket'],
    });
  });

  afterEach(() => {
    if (client.connected) {
      client.disconnect();
    }
  });

  describe('Connection and Authentication', () => {
    it('should establish WebSocket connection successfully', (done) => {
      client.on('connect', () => {
        expect(client.connected).toBe(true);
        done();
      });

      client.on('connect_error', (error) => {
        done(error);
      });

      client.connect();
    });

    it('should authenticate with valid JWT token', (done) => {
      const testPayload = { userId: 'test-user-123', email: 'test@example.com' };
      const token = jwtService.sign(testPayload);

      client.on('connect', () => {
        client.emit('authenticate', { token });
      });

      client.on('authenticated', (data) => {
        expect(data.success).toBe(true);
        expect(data.userId).toBe('test-user-123');
        done();
      });

      client.on('authentication_error', (error) => {
        done(new Error(`Authentication failed: ${error.message}`));
      });

      client.connect();
    });

    it('should reject invalid JWT token', (done) => {
      client.on('connect', () => {
        client.emit('authenticate', { token: 'invalid-token' });
      });

      client.on('authentication_error', (error) => {
        expect(error.message).toContain('Invalid token');
        done();
      });

      client.on('authenticated', () => {
        done(new Error('Should not authenticate with invalid token'));
      });

      client.connect();
    });

    it('should handle missing token gracefully', (done) => {
      client.on('connect', () => {
        client.emit('authenticate', {});
      });

      client.on('authentication_error', (error) => {
        expect(error.message).toContain('Token required');
        done();
      });

      client.connect();
    });
  });

  describe('Channel Subscription and Messaging', () => {
    let authToken: string;

    beforeEach(() => {
      const testPayload = { userId: 'test-user-123', email: 'test@example.com' };
      authToken = jwtService.sign(testPayload);
    });

    it('should subscribe to channels after authentication', (done) => {
      let authenticated = false;

      client.on('connect', () => {
        client.emit('authenticate', { token: authToken });
      });

      client.on('authenticated', () => {
        authenticated = true;
        client.emit('subscribe', { channel: 'customers' });
      });

      client.on('subscribed', (data) => {
        expect(authenticated).toBe(true);
        expect(data.channel).toBe('customers');
        expect(data.success).toBe(true);
        done();
      });

      client.on('subscription_error', (error) => {
        done(new Error(`Subscription failed: ${error.message}`));
      });

      client.connect();
    });

    it('should receive broadcasted messages on subscribed channels', (done) => {
      let subscribed = false;

      client.on('connect', () => {
        client.emit('authenticate', { token: authToken });
      });

      client.on('authenticated', () => {
        client.emit('subscribe', { channel: 'customers' });
      });

      client.on('subscribed', (data) => {
        if (data.channel === 'customers') {
          subscribed = true;
          
          // Broadcast a message using the service
          setTimeout(() => {
            cmsWebSocketService.broadcastCustomerCreated({
              customerId: 'KH001',
              customerData: { ten: 'Test Customer' },
              userId: 'test-user-123',
            });
          }, 100);
        }
      });

      client.on(CMSEvents.CUSTOMER_CREATED, (data) => {
        expect(subscribed).toBe(true);
        expect(data.customerId).toBe('KH001');
        expect(data.customerData.ten).toBe('Test Customer');
        done();
      });

      client.connect();
    });

    it('should handle multiple channel subscriptions', (done) => {
      const channels = ['customers', 'inventory', 'orders'];
      const subscribedChannels: string[] = [];

      client.on('connect', () => {
        client.emit('authenticate', { token: authToken });
      });

      client.on('authenticated', () => {
        channels.forEach(channel => {
          client.emit('subscribe', { channel });
        });
      });

      client.on('subscribed', (data) => {
        subscribedChannels.push(data.channel);
        
        if (subscribedChannels.length === channels.length) {
          expect(subscribedChannels).toEqual(expect.arrayContaining(channels));
          done();
        }
      });

      client.connect();
    });

    it('should unsubscribe from channels correctly', (done) => {
      let subscribed = false;

      client.on('connect', () => {
        client.emit('authenticate', { token: authToken });
      });

      client.on('authenticated', () => {
        client.emit('subscribe', { channel: 'customers' });
      });

      client.on('subscribed', (data) => {
        if (data.channel === 'customers') {
          subscribed = true;
          client.emit('unsubscribe', { channel: 'customers' });
        }
      });

      client.on('unsubscribed', (data) => {
        expect(subscribed).toBe(true);
        expect(data.channel).toBe('customers');
        expect(data.success).toBe(true);
        done();
      });

      client.connect();
    });
  });

  describe('CMS Event Broadcasting', () => {
    let authToken: string;

    beforeEach(() => {
      const testPayload = { userId: 'test-user-123', email: 'test@example.com' };
      authToken = jwtService.sign(testPayload);
    });

    it('should broadcast customer events correctly', (done) => {
      client.on('connect', () => {
        client.emit('authenticate', { token: authToken });
      });

      client.on('authenticated', () => {
        client.emit('subscribe', { channel: 'customers' });
      });

      client.on('subscribed', (data) => {
        if (data.channel === 'customers') {
          // Broadcast customer update
          cmsWebSocketService.broadcastCustomerUpdated({
            customerId: 'KH002',
            customerData: { ten: 'Updated Customer' },
            previousData: { ten: 'Old Customer' },
            userId: 'test-user-123',
          });
        }
      });

      client.on(CMSEvents.CUSTOMER_UPDATED, (data) => {
        expect(data.customerId).toBe('KH002');
        expect(data.customerData.ten).toBe('Updated Customer');
        expect(data.previousData.ten).toBe('Old Customer');
        done();
      });

      client.connect();
    });

    it('should broadcast inventory events correctly', (done) => {
      client.on('connect', () => {
        client.emit('authenticate', { token: authToken });
      });

      client.on('authenticated', () => {
        client.emit('subscribe', { channel: 'inventory' });
      });

      client.on('subscribed', (data) => {
        if (data.channel === 'inventory') {
          // Broadcast inventory update
          cmsWebSocketService.broadcastInventoryUpdated({
            itemId: 'VTPT001',
            warehouseId: 1,
            currentStock: 25,
            previousStock: 50,
            itemData: { ten: 'Test Item' },
            userId: 'test-user-123',
          });
        }
      });

      client.on(CMSEvents.INVENTORY_UPDATED, (data) => {
        expect(data.itemId).toBe('VTPT001');
        expect(data.currentStock).toBe(25);
        expect(data.previousStock).toBe(50);
        done();
      });

      client.connect();
    });

    it('should broadcast low stock alerts', (done) => {
      client.on('connect', () => {
        client.emit('authenticate', { token: authToken });
      });

      client.on('authenticated', () => {
        client.emit('subscribe', { channel: 'inventory' });
      });

      client.on('subscribed', (data) => {
        if (data.channel === 'inventory') {
          // Broadcast low stock scenario
          cmsWebSocketService.broadcastInventoryUpdated({
            itemId: 'VTPT002',
            warehouseId: 1,
            currentStock: 3,
            minThreshold: 10,
            itemData: { ten: 'Low Stock Item' },
            userId: 'test-user-123',
          });
        }
      });

      client.on(CMSEvents.INVENTORY_LOW_STOCK, (data) => {
        expect(data.itemId).toBe('VTPT002');
        expect(data.currentStock).toBe(3);
        expect(data.minThreshold).toBe(10);
        done();
      });

      client.connect();
    });

    it('should broadcast order events correctly', (done) => {
      client.on('connect', () => {
        client.emit('authenticate', { token: authToken });
      });

      client.on('authenticated', () => {
        client.emit('subscribe', { channel: 'orders' });
      });

      client.on('subscribed', (data) => {
        if (data.channel === 'orders') {
          // Broadcast order status change
          cmsWebSocketService.broadcastOrderStatusChanged({
            orderId: 'HD001',
            customerId: 'KH001',
            status: 'CONFIRMED' as const,
            previousStatus: 'PENDING' as const,
            totalAmount: 1500000,
            orderData: { ten: 'Test Order' },
            userId: 'test-user-123',
          });
        }
      });

      client.on(CMSEvents.ORDER_STATUS_CHANGED, (data) => {
        expect(data.orderId).toBe('HD001');
        expect(data.status).toBe('CONFIRMED');
        expect(data.previousStatus).toBe('PENDING');
        done();
      });

      client.connect();
    });

    it('should broadcast system notifications', (done) => {
      client.on('connect', () => {
        client.emit('authenticate', { token: authToken });
      });

      client.on('authenticated', () => {
        // System notifications don't require subscription
        cmsWebSocketService.broadcastSystemNotification({
          title: 'System Maintenance',
          message: 'System will be down for maintenance',
          type: 'WARNING' as const,
          userId: 'admin',
        });
      });

      client.on(CMSEvents.SYSTEM_NOTIFICATION, (data) => {
        expect(data.title).toBe('System Maintenance');
        expect(data.type).toBe('WARNING');
        done();
      });

      client.connect();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    let authToken: string;

    beforeEach(() => {
      const testPayload = { userId: 'test-user-123', email: 'test@example.com' };
      authToken = jwtService.sign(testPayload);
    });

    it('should handle subscription to non-existent channels', (done) => {
      client.on('connect', () => {
        client.emit('authenticate', { token: authToken });
      });

      client.on('authenticated', () => {
        client.emit('subscribe', { channel: 'non-existent-channel' });
      });

      client.on('subscription_error', (error) => {
        expect(error.message).toContain('Invalid channel');
        done();
      });

      client.on('subscribed', () => {
        done(new Error('Should not subscribe to non-existent channel'));
      });

      client.connect();
    });

    it('should handle malformed messages gracefully', (done) => {
      client.on('connect', () => {
        client.emit('authenticate', { token: authToken });
      });

      client.on('authenticated', () => {
        // Send malformed subscription request
        client.emit('subscribe', { invalidField: 'test' });
      });

      client.on('subscription_error', (error) => {
        expect(error.message).toContain('Channel required');
        done();
      });

      client.connect();
    });

    it('should handle disconnection gracefully', (done) => {
      client.on('connect', () => {
        client.emit('authenticate', { token: authToken });
      });

      client.on('authenticated', () => {
        client.emit('subscribe', { channel: 'customers' });
      });

      client.on('subscribed', () => {
        // Force disconnection
        client.disconnect();
      });

      client.on('disconnect', (reason) => {
        expect(reason).toBeDefined();
        done();
      });

      client.connect();
    });

    it('should handle concurrent connections from same user', (done) => {
      const client2 = io(serverUrl, {
        autoConnect: false,
        transports: ['websocket'],
      });

      let client1Connected = false;
      let client2Connected = false;

      client.on('connect', () => {
        client.emit('authenticate', { token: authToken });
      });

      client.on('authenticated', () => {
        client1Connected = true;
        client2.connect();
      });

      client2.on('connect', () => {
        client2.emit('authenticate', { token: authToken });
      });

      client2.on('authenticated', () => {
        client2Connected = true;
        
        expect(client1Connected).toBe(true);
        expect(client2Connected).toBe(true);
        
        client2.disconnect();
        done();
      });

      client.connect();
    });
  });

  describe('Performance and Load Testing', () => {
    let authToken: string;

    beforeEach(() => {
      const testPayload = { userId: 'test-user-123', email: 'test@example.com' };
      authToken = jwtService.sign(testPayload);
    });

    it('should handle rapid message broadcasting', (done) => {
      const messageCount = 50;
      const receivedMessages: any[] = [];

      client.on('connect', () => {
        client.emit('authenticate', { token: authToken });
      });

      client.on('authenticated', () => {
        client.emit('subscribe', { channel: 'customers' });
      });

      client.on('subscribed', (data) => {
        if (data.channel === 'customers') {
          // Send rapid messages
          for (let i = 0; i < messageCount; i++) {
            setTimeout(() => {
              cmsWebSocketService.broadcastCustomerCreated({
                customerId: `KH${i.toString().padStart(3, '0')}`,
                customerData: { ten: `Customer ${i}` },
                userId: 'test-user-123',
              });
            }, i * 10); // 10ms intervals
          }
        }
      });

      client.on(CMSEvents.CUSTOMER_CREATED, (data) => {
        receivedMessages.push(data);
        
        if (receivedMessages.length >= messageCount * 0.9) { // Allow for some message loss
          expect(receivedMessages.length).toBeGreaterThan(messageCount * 0.8);
          done();
        }
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        if (receivedMessages.length < messageCount * 0.8) {
          done(new Error(`Only received ${receivedMessages.length} out of ${messageCount} messages`));
        }
      }, 5000);

      client.connect();
    });

    it('should handle multiple concurrent clients', (done) => {
      const clientCount = 5;
      const clients: Socket[] = [];
      const authenticatedClients: number[] = [];

      for (let i = 0; i < clientCount; i++) {
        const testClient = io(serverUrl, {
          autoConnect: false,
          transports: ['websocket'],
        });

        testClient.on('connect', () => {
          testClient.emit('authenticate', { token: authToken });
        });

        testClient.on('authenticated', () => {
          authenticatedClients.push(i);
          
          if (authenticatedClients.length === clientCount) {
            // All clients authenticated
            expect(authenticatedClients.length).toBe(clientCount);
            
            // Clean up
            clients.forEach(c => c.disconnect());
            done();
          }
        });

        clients.push(testClient);
        testClient.connect();
      }
    });

    it('should maintain performance with large message payloads', (done) => {
      const largeData = Array(1000).fill(0).map((_, i) => ({
        id: i,
        name: `Item ${i}`,
        description: `This is a detailed description for item ${i} with lots of text to make the payload larger`,
        metadata: {
          created: new Date().toISOString(),
          category: `category-${i % 10}`,
          tags: [`tag-${i}`, `tag-${i + 1}`, `tag-${i + 2}`],
        },
      }));

      client.on('connect', () => {
        client.emit('authenticate', { token: authToken });
      });

      client.on('authenticated', () => {
        client.emit('subscribe', { channel: 'inventory' });
      });

      client.on('subscribed', (data) => {
        if (data.channel === 'inventory') {
          const startTime = Date.now();
          
          cmsWebSocketService.broadcastInventoryUpdated({
            itemId: 'VTPT001',
            warehouseId: 1,
            currentStock: 100,
            itemData: { ten: 'Large Data Item', details: largeData },
            userId: 'test-user-123',
          });
        }
      });

      client.on(CMSEvents.INVENTORY_UPDATED, (data) => {
        expect(data.itemId).toBe('VTPT001');
        expect(data.itemData.details).toHaveLength(1000);
        done();
      });

      client.connect();
    });
  });
});