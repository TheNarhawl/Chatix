export interface UserSignupRequest {
  username: string;
  password: string;
  dateOfBirth: string;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface UserDeleteRequest {
  username: string;
  password: string;
}

export interface UserUpdateBioRequest {
  username: string;
  bio: string;
}

export interface UserInfoRequest {
  userId: string;
}
