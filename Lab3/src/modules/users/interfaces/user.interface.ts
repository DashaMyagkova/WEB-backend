import { Post } from "../../posts/interfaces";
import { Comment } from "../../comments/interfaces";

export interface User {
    id: string;
    email: string;
    name: string;
    sex: string;
    birthDate: Date;
    passwordHash: string;
    created: Date;
    posts: Post[];
    comments: Comment[];
}
