import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { environment } from "./environments/environment";
import { UserEntity } from "./modules/users/entities";
import { PostsModule } from "./modules/posts/posts.module";
import { PostEntity } from "./modules/posts/entities";
import { CommentEntity } from "./modules/comments/entities";
import { CommentsModule } from "./modules/comments/comments.module";
import { UsersModule } from "./modules/users/users.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
    imports: [
        AuthModule,
        ScheduleModule.forRoot(),
        TypeOrmModule.forRoot({
            type: "postgres",
            logging: 'all',
            synchronize: environment.STAGE === "development",
            database: environment.DATABASE_NAME,
            host: environment.DATABASE_HOST,
            port: environment.DATABASE_PORT,
            username: environment.DATABASE_USERNAME,
            password: environment.DATABASE_PASSWORD,
            entities: [
                UserEntity,
                PostEntity,
                CommentEntity,
            ]
        }),
        UsersModule,
        PostsModule,
        CommentsModule,
    ]
})
export class AppModule {
}
