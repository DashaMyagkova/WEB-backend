import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {CryptoService, AuthService} from './services';
import {AuthGuard} from './guards';
import {AuthController} from './controllers';
import {environment} from '../../environments/environment';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../users/entities";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.register({secret: environment.JWT_SECRET}),
    ],
    controllers: [
        AuthController,
    ],
    providers: [
        CryptoService,
        AuthService,
        AuthGuard.getAppGuardProvider(),
    ],
    exports: [
        AuthService,
        CryptoService,
    ],
})
export class AuthModule {
}
