export interface AuthSuccessResponse {
    accessToken: string, 
    refreshToken: string
}

export interface LoginPayload {
    password: string;
    user: string;
}