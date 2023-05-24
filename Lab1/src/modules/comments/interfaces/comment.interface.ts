import { User } from "../../users/interfaces";
import { Post } from "../../posts/interfaces";

export interface Comment {
    id: string;
    content: string;
    post: Post;
    user: User;
    created: Date;
}
