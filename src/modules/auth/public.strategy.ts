import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';

// Custom strategy that doesn't require validation
class PublicStrategyBase extends Strategy {
  authenticate(): void {
    this.success({ [Symbol.for('isPublic')]: true });
  }
}

@Injectable()
export class PublicStrategy extends PassportStrategy(PublicStrategyBase, 'public') {
  constructor() {
    super();
  }

  async validate(): Promise<any> {
    return { [Symbol.for('isPublic')]: true };
  }
}
