import {
    WebSocketGateway,
    OnGatewayDisconnect,
    OnGatewayConnection,
    OnGatewayInit,
} from '@nestjs/websockets';
import { Server, ServerOptions, Socket } from 'socket.io';
import { environment } from "../../../environments/environment";
import { Logger } from "@nestjs/common";
import { AuthService } from "../../auth/services";
import { User } from "../interfaces";
import { WebSocketEvent } from "../../../events";

@WebSocketGateway<ServerOptions>(environment.WS_PORT)
export class UsersGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(UsersGateway.name);
    private readonly onlineUsersMap = new Map<string, Socket>();

    constructor(
        private readonly authService: AuthService,
    ) {
    }

    afterInit(server: Server) {
        this.logger.log(`Websocket available on http://localhost:${environment.WS_PORT}${server.path()}`)
    }

    async handleConnection(socket: Socket) {
        const accessToken = socket.handshake.headers.authorization;

        if (!accessToken) {
            return socket.disconnect(true);
        }

        const user = await this.authService.verifyAccessToken(accessToken);

        if (!user) {
            return socket.disconnect(true);
        }

        socket.data.user = user;
        this.onlineUsersMap.set(user.id, socket);
        this.logger.log(`${user.email} is connected...`)
    }

    public isUserOnline(userId): boolean {
        return this.onlineUsersMap.has(userId);
    }

    public send<TData>(userId: string, event: WebSocketEvent<TData>) {
        const socket = this.onlineUsersMap.get(userId);

        if (!socket) {
            throw new Error('Provided user is offline!');
        }

        socket.send(event);
    }

    async handleDisconnect(socket: Socket) {
        const user: User = socket.data.user;

        if (!user) {
            return;
        }

        this.onlineUsersMap.delete(user.id);
        this.logger.log(`${user.email} is disconnected...`)
    }
}
