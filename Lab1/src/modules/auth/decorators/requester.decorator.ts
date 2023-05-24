import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {AuthorizedRequest} from '../interfaces';

export const Requester = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<AuthorizedRequest>();
        return request.user;
    },
);
