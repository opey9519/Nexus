import type { UserGetResponseDto, UpdateUser } from "../Interfaces/UserInterface";
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

export async function GetUser() {
    
}

export async function EditUser() {

}

export async function DeleteUser() {

}