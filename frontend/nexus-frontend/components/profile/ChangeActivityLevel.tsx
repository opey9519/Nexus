"use client"

// Form shown in place of the Activity Level card while no level
// is set (or while being edited).

import { useState } from "react";
import { EditUserActivityLevel } from "@/lib/api/User";
import { ApiError } from "@/lib/api/Utils";
import { ACTIVITY_LEVELS } from "@/lib/ActivityLevels";

interface ChangeActivityLevelProps {
    initialActivityLevel?: string | null;
    onSaved: () => void;
    onCancel?: () => void;
}

export default function ChangeActivityLevel({
    initialActivityLevel,
    onSaved,
    onCancel,
}: ChangeActivityLevelProps) {
    const validInitial = ACTIVITY_LEVELS.find(
        (level) => level === initialActivityLevel
    );

    const [activityLevel, setActivityLevel] = useState(validInitial ?? "");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!activityLevel) {
            setError("Select an activity level.");
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            await EditUserActivityLevel({
                changeActivityLevel: activityLevel,
            });

            onSaved();
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError("Something went wrong. Please try again.");
            }

            setIsLoading(false);
        }
    }

    return (
        <section
            className="
                rounded-2xl
                border border-white/10
                bg-[#12101A]
                p-4
            "
        >
            <h2 className="text-sm font-semibold text-[#F5F3FA]">
                Activity Level
            </h2>

            <p className="mt-1 text-xs leading-relaxed text-[#9A94A8]">
                How active are you outside of workouts? Optional -
                you can always change this later.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {/* Activity Level */}
                <div className="space-y-2">
                    <label
                        htmlFor="activity-level"
                        className="text-sm font-medium text-[#F5F3FA]"
                    >
                        Activity Level
                    </label>

                    <select
                        id="activity-level"
                        value={activityLevel}
                        onChange={(event) => setActivityLevel(event.target.value)}
                        required
                        className="
                            h-11 w-full
                            rounded-xl
                            border border-white/10
                            bg-[#09080F]
                            px-3 text-sm text-[#F5F3FA]
                            outline-none
                            focus:border-[#A855F7]
                            focus:ring-1
                            focus:ring-[#A855F7]/50
                        "
                    >
                        <option value="" disabled>
                            Select your activity level
                        </option>

                        {ACTIVITY_LEVELS.map((level) => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Error */}
                {error && (
                    <div
                        className="
                            rounded-xl
                            border border-red-400/20
                            bg-red-400/10
                            px-3 py-2
                            text-xs text-red-300
                        "
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {/* Actions */}
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
                        {isLoading ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </section>
    );
}
