export class ArrayAnswer<TData> {
    constructor(
        public readonly data: TData[],
        public readonly total = data.length,
        public readonly success = true,
    ) {
    }
}
