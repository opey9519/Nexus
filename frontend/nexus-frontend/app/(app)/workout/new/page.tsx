"use client"

// Fill-in screen for logging a new workout. Draft exercises live
// in local state until "Save Workout" persists them one by one;
// if a save fails mid-batch, retry continues from the unsaved
// entries so nothing is duplicated.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X } from "lucide-react";
import WorkoutHeader from "@/components/workout/WorkoutHeader";
import ExerciseFormCard, {
    ValidateExerciseValues,
    type ExerciseFormValues,
} from "@/components/workout/ExerciseFormCard";
import { CreateLift } from "@/lib/api/Lifts";

interface DraftExercise extends ExerciseFormValues {
    key: number;
}

export default function NewWorkoutPage() {
    const router = useRouter();

    const [drafts, setDrafts] = useState<DraftExercise[]>([
        { key: 0, exerciseName: "", weightLBS: 0, reps: 0, sets: 1, rpe: null, notes: null },
    ]);
    const [nextKey, setNextKey] = useState(1);

    const [savedCount, setSavedCount] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function addDraft() {
        setDrafts((current) => [
            ...current,
            { key: nextKey, exerciseName: "", weightLBS: 0, reps: 0, sets: 1, rpe: null, notes: null },
        ]);
        setNextKey((key) => key + 1);
    }

    function updateDraft(key: number, values: ExerciseFormValues) {
        setDrafts((current) =>
            current.map((draft) =>
                draft.key === key ? { ...draft, ...values } : draft
            )
        );
    }

    function removeDraft(key: number) {
        setDrafts((current) => current.filter((draft) => draft.key !== key));
    }

    async function handleSave() {
        setError(null);

        // Client-side pass over every draft before contacting the API
        for (let index = savedCount; index < drafts.length; index++) {
            const validationError = ValidateExerciseValues(drafts[index]);

            if (validationError) {
                setError(`Exercise ${index + 1}: ${validationError}`);
                return;
            }
        }

        setIsSaving(true);

        try {
            // Resume from the first unsaved entry on retry
            for (let index = savedCount; index < drafts.length; index++) {
                const draft = drafts[index];

                await CreateLift({
                    ...draft,
                    performedAt: new Date().toISOString(),
                });

                setSavedCount(index + 1);
            }

            router.replace("/workout");
            router.refresh();
        } catch (err) {
            const remaining = drafts.length - savedCount;

            setError(
                err instanceof Error && remaining > 0
                    ? `${err.message} - ${remaining} exercise${remaining === 1 ? "" : "s"} still unsaved.`
                    : err instanceof Error
                        ? err.message
                        : "Something went wrong. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    }

    function handleDiscard() {
        if (isSaving) return;

        if (drafts.length > 0) {
            router.back();
        }
    }

    return (
        <main className="px-4 pb-24 pt-8">
            <div className="mx-auto max-w-md space-y-6">

                <div className="flex items-start justify-between">
                    <WorkoutHeader
                        date={new Date().toLocaleDateString(
                            "en-US",
                            { weekday: "long", month: "long", day: "numeric" }
                        )}
                        workoutName="New Workout"
                    />

                    <button
                        type="button"
                        onClick={handleDiscard}
                        aria-label="Discard workout"
                        disabled={isSaving}
                        className="
                            mt-6 rounded-full p-2
                            text-[#625C70]
                            transition-colors hover:text-[#F5F3FA]
                            disabled:cursor-not-allowed disabled:opacity-50
                        "
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {error && (
                    <div
                        className="
                            rounded-xl
                            border border-red-400/20
                            bg-red-400/10
                            px-4 py-3 text-sm text-red-300
                        "
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {drafts.map((draft, index) => (
                        <div key={draft.key} className="relative">
                            <p className="
                                mb-2 text-xs font-medium uppercase
                                tracking-wider text-[#A855F7]
                            ">
                                Exercise {index + 1}
                            </p>

                            <ExerciseFormCard
                                initialValues={draft}
                                showActions={false}
                                onValuesChange={(values) =>
                                    updateDraft(draft.key, values)
                                }
                                onSave={(values) =>
                                    Promise.resolve(updateDraft(draft.key, values))
                                }
                            />

                            {drafts.length > 1 && !isSaving && (
                                <button
                                    type="button"
                                    onClick={() => removeDraft(draft.key)}
                                    aria-label={`Remove exercise ${index + 1}`}
                                    className="
                                        absolute right-3 top-9
                                        rounded-full p-1.5
                                        text-[#625C70]
                                        transition-colors hover:text-red-300
                                    "
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {!isSaving && (
                    <button
                        type="button"
                        onClick={addDraft}
                        className="
                            flex w-full
                            items-center justify-center
                            gap-2 rounded-2xl
                            border border-dashed border-white/10
                            py-4 text-sm font-medium text-[#9A94A8]
                            transition-all hover:border-[#A855F7]/50
                            hover:text-[#A855F7]
                            active:scale-[0.98]
                        "
                    >
                        <Plus className="h-5 w-5" />
                        Add Another Exercise
                    </button>
                )}

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving || drafts.length === 0}
                    className="
                        h-12 w-full
                        rounded-xl
                        bg-[#A855F7]
                        text-sm font-semibold text-white
                        transition-all duration-200
                        hover:bg-[#C084FC]
                        active:scale-[0.98]
                        disabled:cursor-not-allowed disabled:opacity-50
                    "
                >
                    {isSaving
                        ? `Saving... (${savedCount}/${drafts.length})`
                        : `Save Workout`}
                </button>

            </div>
        </main>
    );
}
