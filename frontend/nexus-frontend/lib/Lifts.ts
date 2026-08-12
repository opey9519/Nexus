import type {CreateLiftDto, LiftEntryDto, UpdateLiftEntryDto } from "@/lib/Interfaces/LiftInterface"

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

// Error thrown when the API returns a non-2xx status
export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

// POST /api/lifts - Creates a new lift
export async function CreateLift(dto: CreateLiftDto): Promise<LiftEntryDto> {
    return (await request<LiftEntryDto>("POST", "/api/lifts", dto))!;
}

// GET /api/lifts - Gets all lifts for the current user
export async function GetLifts(): Promise<LiftEntryDto[]> {
    return (await request<LiftEntryDto[]>("GET", "/api/lifts")) ?? [];
}

// GET /api/lifts/{id} - Gets a single lift; returns null if it does not exist
export async function GetLift(id: string): Promise<LiftEntryDto | null> {
    try {
        return (await request<LiftEntryDto>("GET", `/api/lifts/${id}`)) ?? null;
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            return null;
        }

        throw error;
    }
}

// PUT /api/lifts/{id} - Updates a lift; returns false if it does not exist
export async function EditLift(id: string, dto: UpdateLiftEntryDto): Promise<boolean> {
    try {
        await request<void>("PUT", `/api/lifts/${id}`, dto);
        return true;
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            return false;
        }

        throw error;
    }
}

// DELETE /api/lifts/{id} - Deletes a lift; returns false if it does not exist
export async function DeleteLift(id: string): Promise<boolean> {
    try {
        await request<void>("DELETE", `/api/lifts/${id}`);
        return true;
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            return false;
        }

        throw error;
    }
}