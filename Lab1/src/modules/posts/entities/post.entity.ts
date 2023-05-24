import { Post } from "../interfaces";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../users/entities";
import { CommentEntity } from "../../comments/entities";

@Entity('posts')
export class PostEntity implements Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length: 128})
    title: string;

    @Column({type: "text"})
    content: string;

    @ManyToOne(() => UserEntity, (user) => user.posts)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: UserEntity;

    @OneToMany(() => CommentEntity, (comment) => comment.post, {onDelete: 'CASCADE'})
    comments: CommentEntity[]

    @CreateDateColumn()
    created: Date;
}
