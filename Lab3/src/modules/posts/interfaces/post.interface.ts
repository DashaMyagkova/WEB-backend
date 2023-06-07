import { User } from "../../users/interfaces";
import { Comment } from "../../comments/interfaces";

export interface Post {
    id: string;
    title: string;
    content: string;
    user: User;
    comments: Comment[]
    created: Date;
}
