import {
    Body,
    Post,
    HttpCode,
    Controller,
    HttpStatus,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import {
    ApiUnauthorizedResponse,
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import {AuthService, CryptoService} from '../services';
import {SignInDto, SignUpDto} from '../dto';
import {Public} from '../decorators';
import { ErrorAnswer, SingleAnswer } from "../../../answers";
import { User } from "../../users/interfaces";

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly cryptoService: CryptoService,
    ) {
    }

    @Public()
    @Post('sign-in')
    @ApiOkResponse({description: 'Signed in'})
    @ApiUnauthorizedResponse({description: 'Invalid credentials'})
    @HttpCode(HttpStatus.OK)
    public async signIn(@Body() {email, password}: SignInDto): Promise<SingleAnswer<Partial<User> & {accessToken: string}>> {
        const user = await this.authService.getByEmail(email);

        if (!user || !(await this.cryptoService.verifyPassword(password, user.passwordHash))) {
            throw new UnauthorizedException(new ErrorAnswer('Invalid credentials!'));
        }

        const { passwordHash, ...signPayload } = user;
        const accessToken = await this.authService.signAccessToken(signPayload);

        return new SingleAnswer({...signPayload, accessToken });
    }

    @Public()
    @Post('sign-up')
    @ApiCreatedResponse({description: 'Signed up'})
    @ApiBadRequestResponse({description: 'This email already exists'})
    @HttpCode(HttpStatus.CREATED)
    public async signUp(@Body() {email, password, ...data}: SignUpDto): Promise<SingleAnswer<Partial<User>>> {
        const user = await this.authService.getByEmail(email);

        if (user) {
            throw new BadRequestException(new ErrorAnswer('This email already exists!'));
        }

        const {passwordHash, ...newUser} = await this.authService.createUser({
            passwordHash: await this.cryptoService.hashPassword(password),
            email,
            ...data,
        });

        return new SingleAnswer(newUser);
    }
}
