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
import { AuthorizedRequest} from "../interfaces";
import { IS_PUBLIC_KEY } from "../decorators";
import { ErrorAnswer } from "../../../answers";
import { AuthService } from "../services";

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
        private readonly authService: AuthService,
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

        const user = await this.authService.verifyAccessToken(accessToken);

        if (!user) {
            throw new UnauthorizedException(new ErrorAnswer('Invalid access token!'));
        }

        request.user = user;
        return true;
    }

    private extractTokenFromRequest(request: Request): string {
        const bearer = request.headers.authorization;

        return bearer && bearer.split(' ').at(-1);
    }
}
