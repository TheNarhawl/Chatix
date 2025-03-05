export interface User {
    id: string;
    username: string;
    password: string;
    dateOfBirth: string;
    createdAt: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}