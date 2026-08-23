import type { LiftEntryDto } from "@/lib/Interfaces/LiftInterface";

// Derives workout views from flat lift entries.
// The backend stores one row per exercise; the UI groups
// these into per-day workouts.

export interface WorkoutGroup {
    id: string; // date key, e.g. "2026-08-21"
    dateKey: string;
    performedAt: Date;
    lifts: LiftEntryDto[];
    exerciseCount: number;
    setCount: number;
    totalVolume: number; // lbs
}

// Local calendar-day key, e.g. "2026-08-21"
function GetDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Groups lift entries by calendar day, newest first
export function GroupWorkoutsByDay(lifts: LiftEntryDto[]): WorkoutGroup[] {
    const grouped = new Map<string, WorkoutGroup>();

    for (const lift of lifts) {
        const performedAt = new Date(lift.performedAt);
        const dateKey = GetDateKey(performedAt);

        let group = grouped.get(dateKey);

        if (!group) {
            group = {
                id: dateKey,
                dateKey,
                performedAt,
                lifts: [],
                exerciseCount: 0,
                setCount: 0,
                totalVolume: 0
            };

            grouped.set(dateKey, group);
        }

        group.lifts.push(lift);
        group.exerciseCount += 1;
        group.setCount += lift.sets ?? 0;
        group.totalVolume += (lift.weightLBS ?? 0) * (lift.reps ?? 0) * (lift.sets ?? 0);
    }

    return Array.from(grouped.values()).sort(
        (a, b) => b.performedAt.getTime() - a.performedAt.getTime()
    );
}

// The group performed today, if any
export function GetTodayWorkout(groups: WorkoutGroup[]): WorkoutGroup | undefined {
    const todayKey = GetDateKey(new Date());

    return groups.find((group) => group.dateKey === todayKey);
}

// Consecutive days with a workout, ending today or yesterday
export function ComputeStreak(groups: WorkoutGroup[]): number {
    if (groups.length === 0) return 0;

    const keys = new Set(groups.map((group) => group.dateKey));

    const cursor = new Date();
    if (!keys.has(GetDateKey(cursor))) {
        cursor.setDate(cursor.getDate() - 1);

        if (!keys.has(GetDateKey(cursor))) return 0;
    }

    let streak = 0;
    while (keys.has(GetDateKey(cursor))) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
}

// Expands a lift entry into individual set rows for the workout page
export function ExpandSets(lift: LiftEntryDto): { id: string; setNumber: number; weight: number; reps: number; rpe?: number | null }[] {
    return Array.from({ length: Math.max(lift.sets ?? 0, 0) }, (_, index) => ({
        id: `${lift.id}-${index + 1}`,
        setNumber: index + 1,
        weight: lift.weightLBS ?? 0,
        reps: lift.reps ?? 0,
        rpe: lift.rpe ?? null
    }));
}

// Workouts have no stored name - single-exercise days use the
// exercise name, everything else falls back to a generic label
export function GetWorkoutLabel(group: WorkoutGroup): string {
    if (group.lifts.length === 1) {
        return group.lifts[0].exerciseName;
    }

    return "Workout";
}
