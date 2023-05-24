export class SingleAnswer<TData> {
    constructor(
        public readonly data: TData,
        public readonly success = true,
    ) {
    }
}
