import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Logger, Provider
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { Request } from "express";
import {
    AuthorizedRequest,
    TokenSignPayload
} from "../interfaces";
import { IS_PUBLIC_KEY } from "../decorators";
import { User } from "../../users/interfaces";
import { ErrorAnswer } from "../../../answers";

@Injectable()
export class AuthGuard implements CanActivate {
    public static getAppGuardProvider(): Provider {
        Logger.log("Set Auth guard as application guard", AuthGuard.name);

        return {
            provide: APP_GUARD,
            useClass: AuthGuard
        };
    }

    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (isPublic) {
            return true;
        }

        const request = context
            .switchToHttp()
            .getRequest<AuthorizedRequest>();
        const accessToken = this.extractTokenFromRequest(request);


        if (!accessToken || this.isTokenExpired(accessToken)) {
            throw new UnauthorizedException(new ErrorAnswer('Invalid access token!'));
        }

        const {iat, exp, ...user} = await this.jwtService.verifyAsync<User & TokenSignPayload>(accessToken);
        request.user = user;

        return true;
    }

    private isTokenExpired(token: string): boolean {
        const { exp } = this.jwtService.decode(token) as TokenSignPayload;

        return Date.now() >= exp * 1000;
    }

    private extractTokenFromRequest(request: Request): string {
        const bearer = request.headers.authorization;

        return bearer && bearer.split(' ').at(-1);
    }
}
