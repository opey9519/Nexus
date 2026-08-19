import type { UserGetResponseDto, UpdateUser } from "@/lib/Interfaces/UserInterface";
import { ApiError } from "@/lib/api/Utils";

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

// GET /api/user/me - Gets the current user; returns null if not authenticated
export async function GetUser(): Promise<UserGetResponseDto | null> {
    try {
        const response = await request<{ message: string; userData: UserGetResponseDto }>("GET", "/api/user/me");
        return response?.userData ?? null;
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
            return null;
        }

        throw error;
    }
}

// PUT /api/user/me - Updates the current user
export async function EditUser(dto: UpdateUser): Promise<void> {
    await request<void>("PUT", "/api/user/me", dto);
}

// DELETE /api/user/me - Deletes the current user
export async function DeleteUser(): Promise<void> {
    await request<void>("DELETE", "/api/user/me");
}