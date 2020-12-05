import { Request } from 'express';

export interface IGetUserInfo {
  username: string;
  email: string;
  name: string;
  user_type: string;
}

export interface ICreateUser {
  username: string;
  email: string;
  name: string;
  user_type: string;
  password: string;
}

export interface IGetUserInfoRequest extends Request {
  token: {
    user_type: string;
    username: string;
    name: string;
    exp: number;
  };
  currentUser?: IGetUserInfo;
}
