export type LoginInput = {
  username: string;
  password: string;
};

export type LoginResult = {
  userEmail: string;
};

export interface AuthRepository {
  login(input: LoginInput): Promise<LoginResult>;
}
