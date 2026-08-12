// Matches the C# DTO CreateLiftDto in backend/NexusAPI/DTOs/LiftsDto.cs
export interface CreateLiftDto {
    exerciseName: string;
    weightLBS: number;
    reps: number;
    sets: number;
    rpe?: number | null;
    performedAt: string; // ISO 8601
    notes?: string | null;
}

// Matches the C# DTO LiftEntryDto in backend/NexusAPI/DTOs/LiftsDto.cs
export interface LiftEntryDto extends CreateLiftDto {
    id: string; // Guid
}

// Matches the C# DTO UpdateLiftEntryDto in backend/NexusAPI/DTOs/LiftsDto.cs
// Every field is optional: omitted fields keep their existing value
export interface UpdateLiftEntryDto {
    exerciseName?: string;
    weightLBS?: number;
    reps?: number;
    sets?: number;
    rpe?: number | null;
    performedAt?: string; // ISO 8601
    notes?: string | null;
}
