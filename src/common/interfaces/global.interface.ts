export interface IRegisterUser {
  phone?: string;
  country_code?: string;

  email?: string;
  password: string;
  name: string;
  username: string;
}

export interface ILoginUser {
  userid: string;
  password: string;
  country_code?: string;
}

export interface IResponse {
  status?: boolean;
  code?: number;
  message?: string;
  data?: any;
}

export interface IJWTPayload {
  userid: string;
}
