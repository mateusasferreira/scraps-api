export interface CreateUserDto {
  password: string;
  username: string;
  email: string;
}

export interface UserSearchOptions {
  limit?: number;
  page?: number;
  username?: string;
  orderBy?: string;
  direction?: string;
}