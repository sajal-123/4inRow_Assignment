// src/services/Analytics.ts

export interface AnalyticsEvent {
  type: string;
  data: Record<string, any>;
  timestamp: string;
}

export class Analytics {
  private events: AnalyticsEvent[];

  constructor() {
    this.events = [];
  }

  trackEvent(eventType: string, data: Record<string, any>): void {
    const event: AnalyticsEvent = {
      type: eventType,
      data,
      timestamp: new Date().toISOString()
    };

    this.events.push(event);

    // Simulate sending to a message queue like Kafka
    console.log('Analytics Event:', JSON.stringify(event));

    // Maintain a rolling window of the last 1000 events
    if (this.events.length > 1000) {
      this.events.shift();
    }
  }

  getEvents(): AnalyticsEvent[] {
    return this.events;
  }
}
