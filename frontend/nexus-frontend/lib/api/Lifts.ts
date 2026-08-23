import type {CreateLiftDto, LiftEntryDto, UpdateLiftEntryDto } from "@/lib/Interfaces/LiftInterface"
import { request } from "@/lib/api/Client";
import { ApiError } from "@/lib/api/Utils";

// API URL to server

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