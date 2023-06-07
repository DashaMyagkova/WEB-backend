import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostEntity } from "./entities";
import { AuthModule } from "../auth/auth.module";
import { PostsController } from "./controllers";
import { PostsService } from "./services";
import { Cron, CronExpression } from "@nestjs/schedule";
import { UsersModule } from "../users/users.module";
import { UsersService } from "../users/services";
import { StreamsModule } from "../streams/streams.module";
import { StreamsService } from "../streams/services";
import { User } from "../users/interfaces";
import { EmailsService } from "../emails/services";
import { EmailsModule } from "../emails/emails.module";
import { EmailTemplate } from "../emails/enums";

@Module({
    imports: [
        AuthModule,
        UsersModule,
        StreamsModule,
        EmailsModule,
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
    constructor(
        private readonly postsService: PostsService,
        private readonly usersService: UsersService,
        private readonly streamsService: StreamsService,
        private readonly emailsService: EmailsService,
    ) {
    }

    @Cron(CronExpression.EVERY_WEEK)
    async sendTopWeekPosts() {
        const posts = await this.postsService.getTopPosts();
        const users$ = await this.usersService.getActiveUsers$();

        await this.streamsService.iterateStream<User>(
            users$,
            async (users) => this.emailsService.send({
                to: users.map((user) => user.email),
                date: new Date(),
                subject: 'Top 10 Week Posts',
                template: EmailTemplate.TOP_10,
                context: {posts: JSON.stringify(posts, null, 4)},
            }),
            {deduplicationKey: 'id', bulkSize: 10},
        )
    }
}
