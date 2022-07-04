declare namespace Express {
  export interface User {
    permissions?: {
      any: boolean;
      own: boolean;
    }
  }
}