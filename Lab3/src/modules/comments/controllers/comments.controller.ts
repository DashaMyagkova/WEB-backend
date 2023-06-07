import {
    Body,
    Controller, Delete,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Post,
    Put
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags
} from "@nestjs/swagger";
import { CommentsService } from "../services";
import { ArrayAnswer, ErrorAnswer, SingleAnswer } from "../../../answers";
import { Comment } from "../interfaces";
import { PostsService } from "../../posts/services";
import { Requester } from "../../auth/decorators";
import { User } from "../../users/interfaces";
import { CreateCommentDto, UpdateCommentDto } from "../dto";
import { UsersGateway } from "../../users/gateways";
import { EmailsService } from "../../emails/services";
import { WebSocketEvent } from "../../../events";
import { PostEvent } from "../../posts/enums";
import { EmailTemplate } from "../../emails/enums";

@ApiTags('Comments')
@Controller('posts/:postId/comments')
@ApiBearerAuth()
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService,
        private readonly postsService: PostsService,
        private readonly emailsService: EmailsService,
        private readonly usersGateway: UsersGateway,
    ) {
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({description: 'Got post comments'})
    @ApiNotFoundResponse({description: 'Post not found'})
    public async getPostComments(@Param('postId', ParseUUIDPipe) postId: string): Promise<ArrayAnswer<Comment>> {
        const post = await this.postsService.getPostById(postId);

        if (!post) {
            throw new NotFoundException(new ErrorAnswer('Post not found!'));
        }

        const comments = await this.commentsService.getPostComments(postId);

        return new ArrayAnswer(comments);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({description: 'Comment created'})
    @ApiNotFoundResponse({description: 'Post not found'})
    public async createPostComment(
        @Param('postId', ParseUUIDPipe) postId: string,
        @Requester() user: User,
        @Body() data: CreateCommentDto,
    ): Promise<SingleAnswer<Comment>> {
        const post = await this.postsService.getPostById(postId);

        if (!post) {
            throw new NotFoundException(new ErrorAnswer('Post not found!'));
        }

        const comment = await this.commentsService.createComment({
            post,
            user,
            ...data,
        });

        if (user.id === post.user.id) {
            return new SingleAnswer(comment);
        }

        if (this.usersGateway.isUserOnline(post.user.id)) {
            this.usersGateway.send(post.user.id, new WebSocketEvent(PostEvent.COMMENTED, comment));
        }

        if (!this.usersGateway.isUserOnline(post.user.id)) {
            await this.emailsService.send({
                subject: 'New comment!',
                to: post.user.email,
                template: EmailTemplate.COMMENT,
                context: { comment: JSON.stringify(comment, null, 4) },
                date: new Date(),
            });
        }

        return new SingleAnswer(comment);
    }

    @Put(':commentId')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({description: 'Comment updated'})
    @ApiForbiddenResponse({description: 'Not permitted'})
    @ApiNotFoundResponse({description: 'Post not found'})
    public async updatePostComment(
        @Param('postId', ParseUUIDPipe) postId: string,
        @Param('commentId', ParseUUIDPipe) commentId: string,
        @Requester() user: User,
        @Body() data: UpdateCommentDto,
    ): Promise<SingleAnswer<Comment>> {
        const post = await this.postsService.getPostById(postId);

        if (!post) {
            throw new NotFoundException(new ErrorAnswer('Post not found!'));
        }

        const comment = await this.commentsService.getCommentById(commentId);

        if (comment.user.id !== user.id) {
            throw new ForbiddenException(new ErrorAnswer('Not permitted to update this comment!'));
        }

        await this.commentsService.updateComment(commentId, data);

        return new SingleAnswer({...comment, ...data});
    }

    @Delete(':commentId')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({description: 'Comment deleted'})
    @ApiForbiddenResponse({description: 'Not permitted'})
    @ApiNotFoundResponse({description: 'Post not found'})
    public async deletePostComment(
        @Param('postId', ParseUUIDPipe) postId: string,
        @Param('commentId', ParseUUIDPipe) commentId: string,
        @Requester() user: User,
    ): Promise<SingleAnswer<Comment>> {
        const post = await this.postsService.getPostById(postId);

        if (!post) {
            throw new NotFoundException(new ErrorAnswer('Post not found!'));
        }

        const comment = await this.commentsService.getCommentById(commentId);

        if (comment.user.id !== user.id) {
            throw new ForbiddenException(new ErrorAnswer('Not permitted to delete this comment!'));
        }

        await this.commentsService.deleteComment(commentId);

        return new SingleAnswer(comment);
    }
}
