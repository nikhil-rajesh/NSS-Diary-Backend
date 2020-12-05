import { Request } from 'express';

export interface User {
  username: string;
  email: string;
  name: string;
  user_type: string;
}

export interface IGetUserInfoRequest extends Request {
  currentUser: User;
}
