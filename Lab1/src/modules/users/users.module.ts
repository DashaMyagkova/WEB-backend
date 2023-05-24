import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from './entities';
import {UsersService} from './services';
import { UsersController } from "./controllers";
import { PostsModule } from "../posts/posts.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        AuthModule,
        PostsModule,
        TypeOrmModule.forFeature([
            UserEntity,
        ]),
    ],
    controllers: [
        UsersController
    ],
    providers: [
        UsersService,
    ],
})
export class UsersModule {
}
