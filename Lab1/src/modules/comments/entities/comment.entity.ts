import { Comment } from "../interfaces";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostEntity } from "../../posts/entities";
import { UserEntity } from "../../users/entities";

@Entity('comments')
export class CommentEntity implements Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => PostEntity, (post) => post.comments)
    @JoinColumn({name: 'post_id', referencedColumnName: 'id'})
    post: PostEntity;

    @ManyToOne(() => UserEntity, (user) => user.comments)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: UserEntity;

    @Column({type: 'text'})
    content: string;

    @CreateDateColumn()
    created: Date;
}
