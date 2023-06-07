import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "../entities";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Post } from "../interfaces";

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostEntity) private readonly postsRepository: Repository<PostEntity>,
    ) {
    }

    public getAllPosts(): Promise<Post[]> {
        return this.postsRepository.find();
    }

    public getPostById(id: string): Promise<Post | undefined> {
        return this.postsRepository.findOne({
            select: {
                id: true,
                title: true,
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

    public getTopPosts(): Promise<Post[]> {
        return this.postsRepository.createQueryBuilder('post')
            .select('post.id', 'id')
            .addSelect('post.title', 'title')
            .addSelect('post.content', 'id')
            .addSelect('post.created', 'created')
            .addSelect('user.email', 'email')
            .addSelect('user.name', 'author')
            .addSelect('COUNT(comment.id)', 'total_comments')
            .innerJoin('post.user', 'user')
            .leftJoin('post.comments', 'comment')
            .groupBy('post.id')
            .addGroupBy('user.id')
            .orderBy('total_comments', 'DESC')
            .limit(10)
            .getRawMany();
    }

    public createPost(post: Partial<Post>) {
        return this.postsRepository.save(post);
    }

    public updatePost(id: string, data: Partial<Post>) {
        return this.postsRepository.update(id, data);
    }

    public deletePost(id: string) {
        return this.postsRepository.delete(id);
    }
}
