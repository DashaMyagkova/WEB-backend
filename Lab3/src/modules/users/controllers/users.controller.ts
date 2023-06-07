import { Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseUUIDPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "../services";
import { ArrayAnswer, SingleAnswer } from "../../../answers";
import { User } from "../interfaces";
import { Post } from "../../posts/interfaces";

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({description: 'Got user'})
    @ApiNotFoundResponse({description: 'User not found'})
    public async getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<SingleAnswer<User>> {
        const user = await this.usersService.getById(id);

        if (!user) {
            throw new NotFoundException('User not found!');
        }

        return new SingleAnswer(user);
    }

    @Get(':id/posts')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({description: 'Got user posts'})
    @ApiNotFoundResponse({description: 'User not found'})
    public async getUserPosts(@Param('id', ParseUUIDPipe) id: string): Promise<ArrayAnswer<Post>> {
        const user = await this.usersService.getById(id);

        if (!user) {
            throw new NotFoundException('User not found!');
        }

        const {posts} = await this.usersService.getUserWithPosts(user.id);

        return new ArrayAnswer(posts);
    }
}
