import {Injectable, Logger} from '@nestjs/common';
import {Readable} from 'stream';
import {IterateStreamParams} from '../interfaces';

@Injectable()
export class StreamsService {
    private readonly logger = new Logger(StreamsService.name);

    public iterateStream<TEntity extends Record<string, any>>(
        stream: Readable,
        callback: (entities: TEntity[]) => Promise<any> | any,
        {deduplicationKey, bulkSize = 10}: IterateStreamParams<TEntity> = {},
    ): Promise<void> {
        const deduplicationMap = new Map<string, boolean>();
        const buffer: TEntity[] = [];

        return new Promise((resolve, reject) => {
            stream
                .on('open', () => { this.logger.log('Stream opened'); })
                .on('error', reject)
                .on('data', async (entity: TEntity) => {
                    if (!entity || typeof entity !== 'object') {
                        return;
                    }

                    if (deduplicationKey && deduplicationMap.get(entity[deduplicationKey]) === true) {
                        return;
                    }

                    buffer.push(entity);
                    if (buffer.length === bulkSize) {
                        stream.pause();

                        await callback(buffer);

                        stream.resume();
                        buffer.splice(0);
                    }

                    if (deduplicationMap) {
                        deduplicationMap.set(entity[deduplicationKey], true);
                    }
                })
                .on('end', async () => {
                    if (!buffer.length) {
                        resolve();
                        return;
                    }

                    await callback(buffer);

                    resolve();
                });
        });
    }
}
