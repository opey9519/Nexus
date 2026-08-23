"use client"

// Form shown in place of the Body Metrics card while metrics
// are unset (or being edited). Both fields are optional.

import { useState } from "react";
import { EditUserBodyMetric } from "@/lib/api/User";
import { ApiError } from "@/lib/api/Utils";

interface ChangeBodyMetricProps {
    initialHeight?: number | null;
    initialBodyweightLBS?: number | null;
    onSaved: () => void;
    onCancel?: () => void;
}

const MAX_HEIGHT_CM = 280;
const MAX_BODYWEIGHT_LBS = 1000;

export default function ChangeBodyMetric({
    initialHeight,
    initialBodyweightLBS,
    onSaved,
    onCancel,
}: ChangeBodyMetricProps) {
    const [height, setHeight] = useState(
        initialHeight && initialHeight > 0 ? String(initialHeight) : ""
    );
    const [bodyweight, setBodyweight] = useState(
        initialBodyweightLBS && initialBodyweightLBS > 0 ? String(initialBodyweightLBS) : ""
    );

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function validate(): string | null {
        const heightValue = Number(height);
        const bodyweightValue = Number(bodyweight);

        if (!height && !bodyweight) {
            return "Enter a height, a bodyweight, or both.";
        }

        if (height && (!Number.isFinite(heightValue) || heightValue <= 0 || heightValue > MAX_HEIGHT_CM)) {
            return `Height must be between 0 and ${MAX_HEIGHT_CM} cm.`;
        }

        if (bodyweight && (!Number.isFinite(bodyweightValue) || bodyweightValue <= 0 || bodyweightValue > MAX_BODYWEIGHT_LBS)) {
            return `Bodyweight must be between 0 and ${MAX_BODYWEIGHT_LBS} lbs.`;
        }

        return null;
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
            await EditUserBodyMetric({
                changeHeight: height ? Number(height) : null,
                changeBodyweightLBS: bodyweight ? Number(bodyweight) : null,
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
                Body Metrics
            </h2>

            <p className="mt-1 text-xs leading-relaxed text-[#9A94A8]">
                Add your height and bodyweight. You can fill in one
                now and the other later.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    {/* Height */}
                    <div className="space-y-2">
                        <label
                            htmlFor="height"
                            className="text-sm font-medium text-[#F5F3FA]"
                        >
                            Height (cm)
                        </label>

                        <input
                            id="height"
                            type="number"
                            inputMode="decimal"
                            min="1"
                            max={MAX_HEIGHT_CM}
                            step="any"
                            value={height}
                            onChange={(event) => setHeight(event.target.value)}
                            placeholder="173"
                            className="
                                h-11 w-full
                                rounded-xl
                                border border-white/10
                                bg-[#09080F]
                                px-3
                                text-sm text-[#F5F3FA]
                                outline-none
                                placeholder:text-[#625C70]
                                focus:border-[#A855F7]
                                focus:ring-1
                                focus:ring-[#A855F7]/50
                                [appearance:textfield]
                                [&::-webkit-inner-spin-button]:appearance-none
                            "
                        />
                    </div>

                    {/* Bodyweight */}
                    <div className="space-y-2">
                        <label
                            htmlFor="bodyweight"
                            className="text-sm font-medium text-[#F5F3FA]"
                        >
                            Bodyweight (lbs)
                        </label>

                        <input
                            id="bodyweight"
                            type="number"
                            inputMode="decimal"
                            min="1"
                            max={MAX_BODYWEIGHT_LBS}
                            step="any"
                            value={bodyweight}
                            onChange={(event) => setBodyweight(event.target.value)}
                            placeholder="201.5"
                            className="
                                h-11 w-full
                                rounded-xl
                                border border-white/10
                                bg-[#09080F]
                                px-3
                                text-sm text-[#F5F3FA]
                                outline-none
                                placeholder:text-[#625C70]
                                focus:border-[#A855F7]
                                focus:ring-1
                                focus:ring-[#A855F7]/50
                                [appearance:textfield]
                                [&::-webkit-inner-spin-button]:appearance-none
                            "
                        />
                    </div>
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
