export interface UserSearchOptions {
    limit?: number;
    page?: number;
    username?: string;
    orderBy?: string;
    direction?: 'ASC' | 'DESC';
  }