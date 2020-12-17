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
