import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { environment } from "../../../environments/environment";
import { User } from "../../users/interfaces";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../users/entities";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>
    ) {
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
