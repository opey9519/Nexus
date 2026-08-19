export interface UserGetResponseDto {
    firstName: string;
    lastName: string;
    phoneNumber: string
    twoFactorEnabled: boolean;
    email: string;
}

export interface UpdateUser {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
}