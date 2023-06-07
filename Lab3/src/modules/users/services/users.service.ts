import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "../entities";
import { User } from "../interfaces";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>
    ) {
    }

    public getActiveUsers$() {
        return this.usersRepository.createQueryBuilder('user')
            .select('user.id', 'id')
            .addSelect('user.email', 'email')
            .addSelect('user.name', 'name')
            .stream();
    }

    public getById(id: string): Promise<User | undefined> {
        return this.usersRepository.findOne({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                created: true,
                birthDate: true,
                sex: true
            }
        });
    }

    public getUserWithPosts(id: string): Promise<User | undefined> {
        return this.usersRepository.findOne({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                created: true,
                birthDate: true,
                sex: true,
            },
            relations: {
                posts: true,
            }
        });
    }
}
