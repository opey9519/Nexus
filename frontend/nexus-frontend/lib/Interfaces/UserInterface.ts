export interface UserGetResponseDto {
    username: string;
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    twoFactorEnabled: boolean;
    email: string;
    height?: number | null;
    bodyweightLBS?: number | null;
    activityLevel?: string | null;
    createdAt?: string | null; // ISO 8601
}

export interface UpdateUser {
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    email: string;
}
