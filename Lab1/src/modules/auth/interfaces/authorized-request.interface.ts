import {Request} from 'express';
import { User } from "../../users/interfaces";

export interface AuthorizedRequest extends Request {
    user: User;
}
