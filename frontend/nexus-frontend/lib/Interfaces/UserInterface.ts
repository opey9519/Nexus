export interface UserGetResponseDto {
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    twoFactorEnabled: boolean;
    email: string;
}

export interface UpdateUser {
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    email: string;
}