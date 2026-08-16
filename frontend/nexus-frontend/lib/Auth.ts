import type { CreateUserDto, LoginUserDto, UserDto } from "./Interfaces/AuthInterface";

// Contains authentication API's

// Error thrown when the API returns a non-2xx status
export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

// API URL to server
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json"
    };

    const response = await fetch(`${API_BASE}${url}`, {
        method,
        headers,
        credentials: "include",
        body: body !== undefined ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
        throw new ApiError(response.status, `API returned ${response.status}`);
    }

    if (response.status === 204) {
        throw new ApiError(response.status, "No content");
    }

    return (await response.json()) as T;
}

// POST /api/auth/register - Creates a new user
export async function CreateUser(dto: CreateUserDto): Promise<UserDto> {
    return await request<UserDto>("POST", "/api/auth/register", dto);
}

// POST /api/auth/login - User login
export async function LoginUser(dto: LoginUserDto) {
    return await request<void>("POST", "/api/auth/login", dto);
}

// POST /api/auth/logout - User logout
export async function LogoutUser() {
    return await request<void>("POST", "/api/auth/logout");
}

// POST /api/auth/refresh - User refresh
export async function RefreshUser() {
    return await request<UserDto>("POST", "/api/auth/refresh");
}