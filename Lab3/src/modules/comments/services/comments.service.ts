import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentEntity } from "../entities";
import { Repository } from "typeorm";
import { Comment } from "../interfaces";

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentEntity) private readonly commentsRepository: Repository<CommentEntity>,
    ) {
    }

    public getPostComments(postId: string): Promise<Comment[]> {
        return this.commentsRepository.find({where: {post: {id: postId}}});
    }

    public getCommentById(id: string): Promise<Comment | undefined> {
        return this.commentsRepository.findOne({
            select: {
                id: true,
                content: true,
                created: true,
                user: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            where: {id},
            relations: {user: true},
        });
    }

    public createComment(data: Partial<Comment>): Promise<Comment> {
        return this.commentsRepository.save(data);
    }

    public updateComment(id: string, data: Partial<Comment>) {
        return this.commentsRepository.update(id, data);
    }

    public deleteComment(id: string) {
        return this.commentsRepository.delete(id);
    }
}
