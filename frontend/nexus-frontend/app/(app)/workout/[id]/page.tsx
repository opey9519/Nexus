"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import WorkoutHeader from "@/components/workout/WorkoutHeader";
import WorkoutSummary from "@/components/workout/WorkoutSummary";
import ExerciseCard from "@/components/workout/ExerciseCard";
import ExerciseFormCard, {
    type ExerciseFormValues,
} from "@/components/workout/ExerciseFormCard";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import { GetLifts, EditLift, DeleteLift } from "@/lib/api/Lifts";
import {
    GroupWorkoutsByDay,
    GetWorkoutLabel,
    ExpandSets,
    type WorkoutGroup,
} from "@/lib/workouts";

// Shows a single past workout (by date key YYYY-MM-DD) with full
// edit/delete controls per exercise and for the whole day.

export default function WorkoutDetailPage() {
    const router = useRouter();

    const params = useParams<{ id: string }>();
    const workoutId = params?.id;

    const [workout, setWorkout] = useState<WorkoutGroup | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [isDeletingDay, setIsDeletingDay] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    useEffect(() => {
        if (!workoutId) return;

        let active = true;

        (async () => {
            try {
                const groups = GroupWorkoutsByDay(await GetLifts());

                if (!active) return;
                setWorkout(groups.find((group) => group.id === workoutId));
            } catch (err) {
                if (!active) return;
                setError(err instanceof Error ? err.message : "Something went wrong.");
            } finally {
                if (active) setIsLoading(false);
            }
        })();

        return () => {
            active = false;
        };
    }, [workoutId, reloadKey]);

    function handleRetry() {
        setError(null);
        setIsLoading(true);
        setReloadKey((key) => key + 1);
    }

    async function handleEditSave(id: string, values: ExerciseFormValues) {
        setActionError(null);
        setBusyId(id);

        try {
            const updated = await EditLift(id, values);

            if (!updated) {
                setActionError("That exercise no longer exists.");
                setEditingId(null);
                return;
            }

            setEditingId(null);
            setIsLoading(true);
            setReloadKey((key) => key + 1);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setBusyId(null);
        }
    }

    async function handleDelete(id: string) {
        setActionError(null);
        setBusyId(id);

        try {
            await DeleteLift(id);

            // If that was the last exercise of the day, the workout is gone
            if (workout && workout.lifts.length <= 1) {
                router.replace("/history");
                router.refresh();
                return;
            }

            setIsLoading(true);
            setReloadKey((key) => key + 1);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setBusyId(null);
        }
    }

    async function handleDeleteDay() {
        if (!workout) return;

        setActionError(null);
        setIsDeletingDay(true);

        try {
            const results = await Promise.allSettled(
                workout.lifts.map((lift) => DeleteLift(lift.id))
            );

            if (results.some((result) => result.status === "rejected")) {
                setActionError("Some exercises could not be deleted. Please retry.");
                return;
            }

            router.replace("/history");
            router.refresh();
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setIsDeletingDay(false);
        }
    }

    return (
        <main className="px-4 pb-24 pt-8">
            <div className="mx-auto max-w-md space-y-6">

                {isLoading && <LoadingState />}

                {!isLoading && error && (
                    <ErrorState message={error} onRetry={handleRetry} />
                )}

                {!isLoading && !error && !workout && (
                    <p className="text-sm text-[#9A94A8]">
                        Workout not found.
                    </p>
                )}

                {!isLoading && !error && workout && (
                    <>
                        <div className="flex items-start justify-between">
                            <WorkoutHeader
                                date={workout.performedAt.toLocaleDateString(
                                    "en-US",
                                    { weekday: "long", month: "long", day: "numeric" }
                                )}
                                workoutName={GetWorkoutLabel(workout)}
                            />

                            {/* Delete Whole Day */}
                            {!isDeletingDay ? (
                                <button
                                    type="button"
                                    onClick={() => setIsDeletingDay(true)}
                                    aria-label="Delete this workout"
                                    className="
                                        mt-6 rounded-full p-2
                                        text-[#625C70]
                                        transition-colors hover:text-red-300
                                    "
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            ) : (
                                <div className="mt-4 flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsDeletingDay(false)}
                                        disabled={busyId !== null}
                                        className="
                                            rounded-lg border border-white/10
                                            px-3 py-1.5 text-xs text-[#9A94A8]
                                            transition-colors hover:text-[#F5F3FA]
                                            disabled:cursor-not-allowed disabled:opacity-50
                                        "
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleDeleteDay}
                                        disabled={busyId !== null}
                                        className="
                                            rounded-lg bg-red-500/80
                                            px-3 py-1.5 text-xs font-semibold text-white
                                            transition-colors hover:bg-red-500
                                            disabled:cursor-not-allowed disabled:opacity-50
                                        "
                                    >
                                        Delete Workout?
                                    </button>
                                </div>
                            )}
                        </div>

                        <WorkoutSummary
                            exerciseCount={workout.exerciseCount}
                            setCount={workout.setCount}
                        />

                        {actionError && (
                            <div
                                className="
                                    rounded-xl border border-red-400/20
                                    bg-red-400/10 px-4 py-3 text-sm text-red-300
                                "
                                role="alert"
                            >
                                {actionError}
                            </div>
                        )}

                        <div className="space-y-4">

                            {workout.lifts.map((lift) =>
                                editingId === lift.id ? (
                                    <ExerciseFormCard
                                        key={lift.id}
                                        initialValues={{
                                            exerciseName: lift.exerciseName,
                                            weightLBS: lift.weightLBS,
                                            reps: lift.reps,
                                            sets: lift.sets,
                                            rpe: lift.rpe ?? null,
                                            notes: lift.notes ?? null,
                                        }}
                                        onCancel={() => setEditingId(null)}
                                        onSave={(values) =>
                                            handleEditSave(lift.id, values)
                                        }
                                    />
                                ) : (
                                    <ExerciseCard
                                        key={lift.id}
                                        exerciseName={lift.exerciseName}
                                        sets={ExpandSets(lift)}
                                        notes={lift.notes ?? null}
                                        isBusy={busyId === lift.id || isDeletingDay}
                                        onEdit={() => setEditingId(lift.id)}
                                        onDelete={() => handleDelete(lift.id)}
                                    />
                                )
                            )}

                        </div>
                    </>
                )}

            </div>
        </main>
    );
}
