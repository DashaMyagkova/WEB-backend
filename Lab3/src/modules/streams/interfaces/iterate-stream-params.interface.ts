export interface IterateStreamParams<TEntity> {
    bulkSize?: number;
    deduplicationKey?: keyof TEntity | string,
}
