export type MetricValue = number | string | boolean | { url: string };

export type MetadataValue = string | number | boolean | null | undefined;
export type Metadata = Record<string, MetadataValue>;

export interface IMetricWithMetadata {
  value: MetricValue;
  metadata?: Metadata;
}

export type MetricData = MetricValue | IMetricWithMetadata;

export interface ITelemetryMessage {
  timestamp?: string;
  metadata?: Metadata;
  [key: string]: MetricData | string | Metadata | undefined;
}

export interface IMetric {
  name: string;
  value: MetricValue;
  metadata?: Metadata;
}

export interface ITelemetryPayload {
  device_id: string;
  timestamp?: Date;
  metrics: IMetric[];
}
