export class WebSocketEvent<TData> {
    static isWebSocketEvent(value: unknown): value is WebSocketEvent<any> {
        return value && typeof value === 'object' && 'event' in value;
    }

    constructor(
        public readonly event: string,
        public readonly data: TData,
    ) {
    }

    public serialize(): string {
        return JSON.stringify(this);
    }
}
