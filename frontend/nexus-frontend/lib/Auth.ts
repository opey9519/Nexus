import type { CreateUserDto, LoginUserDto, UserDto } from "@/lib/Interfaces/AuthInterface";
import { ApiError } from "@/lib/Utils";

// Contains authentication API's

// API URL to server
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// Shared request helper: sends the JWT via the access_token cookie,
// returns the parsed JSON body (or undefined for 204 No Content)
async function request<T>(method: string, url: string, body?: unknown): Promise<T | undefined> {
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
        return undefined;
    }

    return (await response.json()) as T;
}

// POST /api/auth/register - Creates a new user
export async function CreateUser(dto: CreateUserDto): Promise<UserDto> {
    return (await request<UserDto>("POST", "/api/auth/register", dto))!;
}

// POST /api/auth/login - User login
export async function LoginUser(dto: LoginUserDto): Promise<void> {
    await request<void>("POST", "/api/auth/login", dto);
}

// POST /api/auth/logout - User logout
export async function LogoutUser(): Promise<void> {
    await request<void>("POST", "/api/auth/logout");
}

// POST /api/auth/refresh - User refresh
export async function RefreshUser(): Promise<void> {
    await request<void>("POST", "/api/auth/refresh");
}