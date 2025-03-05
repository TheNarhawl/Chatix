export interface User {
    username: string;
    password: string;
    dateOfBirth: string;
    createdAt: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}