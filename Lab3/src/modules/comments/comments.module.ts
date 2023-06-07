import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PostsModule } from "../posts/posts.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentEntity } from "./entities";
import { CommentsService } from "./services";
import { CommentsController } from "./controllers";
import { UsersModule } from "../users/users.module";
import { EmailsModule } from "../emails/emails.module";

@Module({
    imports: [
        AuthModule,
        PostsModule,
        UsersModule,
        EmailsModule,
        TypeOrmModule.forFeature([CommentEntity]),
    ],
    controllers: [
        CommentsController,
    ],
    providers: [
        CommentsService,
    ],
    exports: [
        CommentsService,
    ]
})
export class CommentsModule {
}
