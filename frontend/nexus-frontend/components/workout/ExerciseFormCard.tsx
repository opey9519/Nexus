"use client"

// Fill-in card used by the add-workout screen and inline exercise
// editing. Mirrors one lift entry in the database: all sets of an
// exercise share the same weight/reps/RPE.

import { useState } from "react";

export interface ExerciseFormValues {
    exerciseName: string;
    weightLBS: number;
    reps: number;
    sets: number;
    rpe?: number | null;
    notes?: string | null;
}

interface ExerciseFormCardProps {
    initialValues?: Partial<ExerciseFormValues>;
    onSave: (values: ExerciseFormValues) => Promise<void>;
    onCancel?: () => void;
    submitLabel?: string;
    // Hide the save/cancel row when the card is used as a pure
    // input surface (e.g. drafts on the new-workout screen)
    showActions?: boolean;
    // Fires on every keystroke so parents can keep draft state
    // in sync (used by batch saves that bypass form submission)
    onValuesChange?: (values: ExerciseFormValues) => void;
}

const MAX_NAME_LENGTH = 100;

// Shared validation used by this card and by batch saves on the
// new-workout screen so both enforce identical rules.
export function ValidateExerciseValues(values: ExerciseFormValues): string | null {
    if (!values.exerciseName.trim()) {
        return "An exercise name is required.";
    }

    if (values.exerciseName.trim().length > MAX_NAME_LENGTH) {
        return `Exercise name must be ${MAX_NAME_LENGTH} characters or fewer.`;
    }

    if (!Number.isFinite(values.weightLBS) || values.weightLBS < 0) {
        return "Weight must be 0 or more lbs (0 for bodyweight).";
    }

    if (!Number.isInteger(values.reps) || values.reps < 1) {
        return "Reps must be a whole number of at least 1.";
    }

    if (!Number.isInteger(values.sets) || values.sets < 1) {
        return "Sets must be a whole number of at least 1.";
    }

    if (values.rpe != null && (!Number.isFinite(values.rpe) || values.rpe < 1 || values.rpe > 10)) {
        return "RPE must be between 1 and 10, or left empty.";
    }

    return null;
}

export default function ExerciseFormCard({
    initialValues,
    onSave,
    onCancel,
    submitLabel = "Save Exercise",
    showActions = true,
    onValuesChange,
}: ExerciseFormCardProps) {
    const [exerciseName, setExerciseName] = useState(initialValues?.exerciseName ?? "");
    const [weight, setWeight] = useState(
        initialValues?.weightLBS !== undefined ? String(initialValues.weightLBS) : ""
    );
    const [reps, setReps] = useState(
        initialValues?.reps !== undefined ? String(initialValues.reps) : ""
    );
    const [sets, setSets] = useState(
        initialValues?.sets !== undefined ? String(initialValues.sets) : "1"
    );
    const [rpe, setRpe] = useState(
        initialValues?.rpe != null ? String(initialValues.rpe) : ""
    );
    const [notes, setNotes] = useState(initialValues?.notes ?? "");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Snapshots the current form state into API-shaped values,
    // optionally overriding one field with its freshest value
    // (state updates are async, so onChange passes it directly)
    function buildValues(overrides?: Partial<Record<
        "exerciseName" | "weight" | "reps" | "sets" | "rpe" | "notes",
        string
    >>): ExerciseFormValues {
        const name = overrides?.exerciseName ?? exerciseName;
        const weightValue = overrides?.weight ?? weight;
        const repsValue = overrides?.reps ?? reps;
        const setsValue = overrides?.sets ?? sets;
        const rpeValue = overrides?.rpe ?? rpe;
        const notesValue = overrides?.notes ?? notes;

        return {
            exerciseName: name.trim(),
            weightLBS: Number(weightValue),
            reps: Number(repsValue),
            sets: Number(setsValue),
            rpe: rpeValue === "" ? null : Number(rpeValue),
            notes: notesValue.trim() === "" ? null : notesValue.trim(),
        };
    }

    function handleFieldChange(
        field: "exerciseName" | "weight" | "reps" | "sets" | "rpe" | "notes",
        value: string
    ) {
        switch (field) {
            case "exerciseName": setExerciseName(value); break;
            case "weight": setWeight(value); break;
            case "reps": setReps(value); break;
            case "sets": setSets(value); break;
            case "rpe": setRpe(value); break;
            case "notes": setNotes(value); break;
        }

        onValuesChange?.(buildValues({ [field]: value }));
    }

    function validate(): string | null {
        return ValidateExerciseValues(buildValues());
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            await onSave(buildValues());
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
            setIsLoading(false);
        }
    }

    const inputClassName = `
        h-11 w-full
        rounded-xl
        border border-white/10
        bg-[#09080F]
        px-3 text-sm text-[#F5F3FA]
        outline-none
        placeholder:text-[#625C70]
        focus:border-[#A855F7]
        focus:ring-1 focus:ring-[#A855F7]/50
        [appearance:textfield]
        [&::-webkit-inner-spin-button]:appearance-none
    `;

    return (
        <section
            className="
                rounded-2xl
                border border-white/10
                bg-[#12101A]
                p-4
            "
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Exercise Name */}
                <div className="space-y-2">
                    <label
                        htmlFor="exercise-name"
                        className="text-sm font-medium text-[#F5F3FA]"
                    >
                        Exercise Name
                    </label>

                    <input
                        id="exercise-name"
                        type="text"
                        maxLength={MAX_NAME_LENGTH}
                        value={exerciseName}
                        onChange={(event) => handleFieldChange("exerciseName", event.target.value)}
                        placeholder="Bench Press"
                        required
                        className={inputClassName}
                    />
                </div>

                {/* Numbers */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <label
                            htmlFor="weight"
                            className="text-sm font-medium text-[#F5F3FA]"
                        >
                            Weight (lbs)
                        </label>

                        <input
                            id="weight"
                            type="number"
                            inputMode="decimal"
                            min="0"
                            max="100000"
                            step="any"
                            value={weight}
                            onChange={(event) => handleFieldChange("weight", event.target.value)}
                            placeholder="225"
                            required
                            className={inputClassName}
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="rpe"
                            className="text-sm font-medium text-[#F5F3FA]"
                        >
                            RPE <span className="text-[#625C70]">(optional)</span>
                        </label>

                        <input
                            id="rpe"
                            type="number"
                            inputMode="decimal"
                            min="1"
                            max="10"
                            step="0.5"
                            value={rpe}
                            onChange={(event) => handleFieldChange("rpe", event.target.value)}
                            placeholder="8"
                            className={inputClassName}
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="reps"
                            className="text-sm font-medium text-[#F5F3FA]"
                        >
                            Reps
                        </label>

                        <input
                            id="reps"
                            type="number"
                            inputMode="numeric"
                            min="1"
                            max="10000"
                            step="1"
                            value={reps}
                            onChange={(event) => handleFieldChange("reps", event.target.value)}
                            placeholder="5"
                            required
                            className={inputClassName}
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="sets"
                            className="text-sm font-medium text-[#F5F3FA]"
                        >
                            Sets
                        </label>

                        <input
                            id="sets"
                            type="number"
                            inputMode="numeric"
                            min="1"
                            max="100"
                            step="1"
                            value={sets}
                            onChange={(event) => handleFieldChange("sets", event.target.value)}
                            placeholder="3"
                            required
                            className={inputClassName}
                        />
                    </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                    <label
                        htmlFor="notes"
                        className="text-sm font-medium text-[#F5F3FA]"
                    >
                        Notes <span className="text-[#625C70]">(optional)</span>
                    </label>

                    <textarea
                        id="notes"
                        rows={2}
                        maxLength={500}
                        value={notes}
                        onChange={(event) => handleFieldChange("notes", event.target.value)}
                        placeholder="How did it feel?"
                        className="
                            w-full
                            rounded-xl
                            border border-white/10
                            bg-[#09080F]
                            px-3 py-2 text-sm text-[#F5F3FA]
                            outline-none
                            resize-none
                            placeholder:text-[#625C70]
                            focus:border-[#A855F7]
                            focus:ring-1 focus:ring-[#A855F7]/50
                        "
                    />
                </div>

                {/* Error */}
                {error && (
                    <div
                        className="
                            rounded-xl
                            border border-red-400/20
                            bg-red-400/10
                            px-3 py-2 text-xs text-red-300
                        "
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {/* Actions */}
                {showActions && (
                    <div className="flex gap-2">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={isLoading}
                                className="
                                    h-11 flex-1
                                    rounded-xl
                                    border border-white/10
                                    text-sm font-medium text-[#9A94A8]
                                    transition-colors hover:text-[#F5F3FA]
                                    disabled:cursor-not-allowed disabled:opacity-50
                                "
                            >
                                Cancel
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="
                                h-11 flex-1
                                rounded-xl
                                bg-[#A855F7]
                                text-sm font-semibold text-white
                                transition-all duration-200
                                hover:bg-[#C084FC]
                                active:scale-[0.98]
                                disabled:cursor-not-allowed disabled:opacity-50
                            "
                        >
                            {isLoading ? "Saving..." : submitLabel}
                        </button>
                    </div>
                )}
            </form>
        </section>
    );
}
