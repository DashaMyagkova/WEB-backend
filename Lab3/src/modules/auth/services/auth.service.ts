import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { environment } from "../../../environments/environment";
import { User } from "../../users/interfaces";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../users/entities";
import { Repository } from "typeorm";
import { TokenSignPayload } from "../interfaces";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>
    ) {
    }

    public async verifyAccessToken(token: string): Promise<User | undefined> {
        if (!token || this.isTokenExpired(token)) {
            return;
        }

        const {iat, exp, ...user} = await this.jwtService.verifyAsync<User & TokenSignPayload>(token);

        return user;
    }

    private isTokenExpired(token: string): boolean {
        const { exp } = this.jwtService.decode(token) as TokenSignPayload;

        return Date.now() >= exp * 1000;
    }

    public signAccessToken<TPayload extends Object | string>(payload: TPayload): Promise<string> {
        return this.jwtService.signAsync(payload, {
            expiresIn: environment.ACCESS_EXPIRES
        });
    }

    public getByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findOne({
            where: { email }
        });
    }

    public createUser(user: Partial<User>): Promise<User> {
        return this.usersRepository.save(user);
    }
}
