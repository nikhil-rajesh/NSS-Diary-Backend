import { Request } from 'express';

export interface IAuth extends Request {
  token: {
    user_type: string;
    username: string;
    name: string;
    email: string;
    exp: number;
  };
}
