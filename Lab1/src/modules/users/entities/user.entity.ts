import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {User} from '../interfaces';
import { PostEntity } from "../../posts/entities";
import { CommentEntity } from "../../comments/entities";

@Entity('users')
export class UserEntity implements User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length: 128})
    email: string;

    @Column({type: 'date'})
    birthDate: Date;

    @Column({type: 'text'})
    name: string;

    @Column({type: 'text'})
    sex: string;

    @Column({type: 'text', name: 'password_hash'})
    passwordHash: string;

    @CreateDateColumn()
    created: Date;

    @OneToMany(() => PostEntity, (post) => post.user, {onDelete: 'CASCADE'})
    posts: PostEntity[]

    @OneToMany(() => CommentEntity, (comment) => comment.user, {onDelete: 'CASCADE'})
    comments: CommentEntity[]
}
