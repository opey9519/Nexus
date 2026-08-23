"use client"

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import SetRow from "./SetRow";
import ExerciseNotes from "./ExerciseNotes";

interface Set {
    id: string;
    setNumber: number
    weight: number;
    reps: number;
    rpe?: number | null;
}

interface ExerciseCardProps {
    exerciseName: string;
    sets: Set[];
    notes?: string | null;
    onEdit?: () => void;
    onDelete?: () => void;
    isBusy?: boolean;
}

export default function ExerciseCard({
    exerciseName,
    sets,
    notes,
    onEdit,
    onDelete,
    isBusy = false,
} : ExerciseCardProps) {
    // Two-step delete confirmation inside the card
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    return(
        <>
            <section
            className="
                overflow-hidden
                rounded-2xl
                border border-white/10
                bg-[#12101A]
            "
        >
            {/* Exercise Header */}
            <div className="flex items-center justify-between px-4 pt-4">
                <h2 className="
                    text-base
                    font-semibold
                    text-[#F5F3FA]
                ">
                    {exerciseName}
                </h2>

                {(onEdit || onDelete) && !confirmingDelete && (
                    <div className="flex items-center gap-1">
                        {onEdit && (
                            <button
                                type="button"
                                onClick={onEdit}
                                disabled={isBusy}
                                aria-label={`Edit ${exerciseName}`}
                                className="
                                    rounded-full p-1.5
                                    text-[#625C70]
                                    transition-colors hover:text-[#A855F7]
                                    disabled:cursor-not-allowed disabled:opacity-50
                                "
                            >
                                <Pencil className="h-4 w-4" />
                            </button>
                        )}

                        {onDelete && (
                            <button
                                type="button"
                                onClick={() => setConfirmingDelete(true)}
                                disabled={isBusy}
                                aria-label={`Delete ${exerciseName}`}
                                className="
                                    rounded-full p-1.5
                                    text-[#625C70]
                                    transition-colors hover:text-red-300
                                    disabled:cursor-not-allowed disabled:opacity-50
                                "
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Set Header */}
            <div className="
                mt-4
                grid
                grid-cols-[40px_1fr_60px_60px]
                gap-2
                px-4
                text-xs
                text-[#625C70]
            ">
                <span>Set</span>
                <span>Weight</span>
                <span>Reps</span>
                <span>RPE</span>
            </div>

            {/* Sets */}
            <div className="mt-1">
                {sets.map((set) => (
                    <SetRow
                        key={set.id}
                        setNumber={set.setNumber}
                        weight={set.weight}
                        reps={set.reps}
                        rpe={set.rpe}
                    />
                ))}
            </div>

            {/* Notes */}
            <ExerciseNotes notes={notes} />

            {/* Inline Delete Confirmation */}
            {confirmingDelete && (
                <div
                    className="
                        flex items-center justify-between gap-3
                        border-t border-red-400/20 bg-red-400/10
                        px-4 py-3
                    "
                >
                    <p className="text-xs text-red-300">
                        Delete this exercise?
                    </p>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setConfirmingDelete(false)}
                            disabled={isBusy}
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
                            onClick={onDelete}
                            disabled={isBusy}
                            className="
                                rounded-lg bg-red-500/80
                                px-3 py-1.5 text-xs font-semibold text-white
                                transition-colors hover:bg-red-500
                                disabled:cursor-not-allowed disabled:opacity-50
                            "
                        >
                            {isBusy ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            )}
        </section>
        </>
    );
}
