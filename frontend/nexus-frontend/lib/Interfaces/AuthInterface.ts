export interface LoginUserDto {
    email: string;
    password: string;
}

export interface CreateUserDto extends LoginUserDto {
    username: string;
    firstName?: string;
    lastName?: string;
}

export interface UserDto {
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
}