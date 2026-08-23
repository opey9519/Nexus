import type { UserGetResponseDto, UpdateUser, PatchUserBodyMetrics, PatchUserActivityLevel } from "@/lib/Interfaces/UserInterface";
import { request } from "@/lib/api/Client";
import { ApiError } from "@/lib/api/Utils";

// Contains user API's

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

// PATCH /api/user/me/body-metric - Updates the current users body metrics
export async function EditUserBodyMetric(dto: PatchUserBodyMetrics) : Promise<void> {
    await request<void>("PATCH", "/api/user/me/body-metrics", dto);
}

// PATCH /api/user/me/activity-level - Updates the current users activity level
export async function EditUserActivityLevel (dto: PatchUserActivityLevel) : Promise<void> {
    await request<void>("PATCH", "/api/user/me/activity-level", dto);
}

// DELETE /api/user/me - Deletes the current user
export async function DeleteUser(): Promise<void> {
    await request<void>("DELETE", "/api/user/me");
}
