import {
    Controller,
    Get,
    Post as PostMethod,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Body, Put, Delete
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags
} from "@nestjs/swagger";
import { ArrayAnswer, ErrorAnswer, SingleAnswer } from "../../../answers";
import { Post } from "../interfaces";
import { PostsService } from "../services";
import { CreatePostDto, UpdatePostDto } from "../dto";
import { Requester } from "../../auth/decorators";
import { User } from "../../users/interfaces";

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
    ) {
    }

    @Get()
    @ApiOkResponse({description: 'Got all posts'})
    @HttpCode(HttpStatus.OK)
    public async getAllPosts(): Promise<ArrayAnswer<Post>> {
        const posts = await this.postsService.getAllPosts();

        return new ArrayAnswer(posts);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({description: 'Got post by id'})
    @ApiNotFoundResponse({description: 'Post not found'})
    public async getPostById(@Param('id', ParseUUIDPipe) id: string): Promise<SingleAnswer<Post>> {
        const post = await this.postsService.getPostById(id);

        if (!post) {
            throw new NotFoundException(new ErrorAnswer('Post not found!'));
        }

        return new SingleAnswer(post);
    }

    @PostMethod()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({description: 'Post created'})
    public async createPost(
        @Requester() user: User,
        @Body() data: CreatePostDto,
    ): Promise<SingleAnswer<Post>> {
        const post = await this.postsService.createPost({
            user,
            ...data,
        })

        return new SingleAnswer(post);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({description: 'Post updated'})
    @ApiNotFoundResponse({description: 'Post not found'})
    @ApiForbiddenResponse({description: 'Permission denied to update post'})
    public async updatePost(
        @Param('id', ParseUUIDPipe) id: string,
        @Requester() user: User,
        @Body() data: UpdatePostDto,
    ): Promise<SingleAnswer<Post>> {
        const post = await this.postsService.getPostById(id);

        if (!post) {
            throw new NotFoundException(new ErrorAnswer('Post not found!'));
        }

        if (post.user.id !== user.id) {
            throw new NotFoundException(new ErrorAnswer('Permission denied!'));
        }

        await this.postsService.updatePost(id, data);

        return new SingleAnswer({...post, ...data});
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({description: 'Post deleted'})
    @ApiNotFoundResponse({description: 'Post not found'})
    @ApiForbiddenResponse({description: 'Permission denied to delete post'})
    public async deletePost(
        @Param('id', ParseUUIDPipe) id: string,
        @Requester() user: User,
    ): Promise<SingleAnswer<Post>> {
        const post = await this.postsService.getPostById(id);

        if (!post) {
            throw new NotFoundException(new ErrorAnswer('Post not found!'));
        }

        if (post.user.id !== user.id) {
            throw new NotFoundException(new ErrorAnswer('Permission denied!'));
        }

        await this.postsService.deletePost(id);

        return new SingleAnswer(post);
    }
}
