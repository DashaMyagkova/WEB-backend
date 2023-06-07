import {Module} from '@nestjs/common';
import {StreamsService} from './services';

@Module({
    providers: [
        StreamsService,
    ],
    exports: [
        StreamsService,
    ],
})
export class StreamsModule {
}
