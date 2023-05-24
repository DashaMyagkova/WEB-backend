import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostEntity } from "./entities";
import { AuthModule } from "../auth/auth.module";
import { PostsController } from "./controllers";
import { PostsService } from "./services";

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([
            PostEntity,
        ])
    ],
    controllers: [
        PostsController,
    ],
    providers: [
        PostsService,
    ],
    exports: [
        PostsService,
    ]
})
export class PostsModule {
}
