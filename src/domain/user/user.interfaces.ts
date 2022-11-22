export interface CreateUserDto {
  password: string;
  username: string;
  email: string;
}

export interface UserSearchOptions {
  limit?: string;
  page?: string;
  username?: string;
  orderBy?: string;
  direction?: 'ASC' | 'DESC';
}