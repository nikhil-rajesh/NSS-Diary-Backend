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

export interface ISignUpUser {
  username: string;
  email: string;
  name: string;
  password: string;
  classroom_code: string;
}
