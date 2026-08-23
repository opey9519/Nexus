"use client"

import { useEffect, useState } from "react";
import WorkoutHeader from "@/components/workout/WorkoutHeader";
import WorkoutSummary from "@/components/workout/WorkoutSummary";
import ExerciseCard from "@/components/workout/ExerciseCard";
import ExerciseFormCard, {
    type ExerciseFormValues,
} from "@/components/workout/ExerciseFormCard";
import AddExerciseButton from "@/components/workout/AddExerciseButton";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import { GetLifts, EditLift, DeleteLift } from "@/lib/api/Lifts";
import {
    GroupWorkoutsByDay,
    GetTodayWorkout,
    GetWorkoutLabel,
    ExpandSets,
    type WorkoutGroup,
} from "@/lib/workouts";

export default function WorkoutPage() {
    const [today, setToday] = useState<WorkoutGroup | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        (async () => {
            try {
                const groups = GroupWorkoutsByDay(await GetLifts());

                if (!active) return;
                setToday(GetTodayWorkout(groups));
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
    }, [reloadKey]);

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

            setEditingId(null);
            setIsLoading(true);
            setReloadKey((key) => key + 1);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setBusyId(null);
        }
    }

    return (
        <main className="px-4 pb-24 pt-8">
            <div className="mx-auto max-w-md space-y-6">

                {isLoading && <LoadingState />}

                {!isLoading && error && (
                    <ErrorState message={error} onRetry={handleRetry} />
                )}

                {!isLoading && !error && (
                    <>
                        <WorkoutHeader
                            date={new Date().toLocaleDateString(
                                "en-US",
                                { weekday: "long", month: "long", day: "numeric" }
                            )}
                            workoutName={
                                today ? GetWorkoutLabel(today) : "No workout yet"
                            }
                        />

                        {today && (
                            <WorkoutSummary
                                exerciseCount={today.exerciseCount}
                                setCount={today.setCount}
                            />
                        )}

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

                            {today?.lifts.map((lift) =>
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
                                        isBusy={busyId === lift.id}
                                        onEdit={() => setEditingId(lift.id)}
                                        onDelete={() => handleDelete(lift.id)}
                                    />
                                )
                            )}

                        </div>

                        <AddExerciseButton />
                    </>
                )}

            </div>
        </main>
    );
}
