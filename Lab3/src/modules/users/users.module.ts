import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from './entities';
import {UsersService} from './services';
import { UsersController } from "./controllers";
import { AuthModule } from "../auth/auth.module";
import { UsersGateway } from "./gateways";

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([
            UserEntity,
        ]),
    ],
    controllers: [
        UsersController
    ],
    providers: [
        UsersService,

        UsersGateway,
    ],
    exports: [
        UsersService,

        UsersGateway,
    ]
})
export class UsersModule {
}
