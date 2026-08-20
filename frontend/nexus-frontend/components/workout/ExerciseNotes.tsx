"use client"

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ExerciseNotesProps {
    notes?: string | null;
}

export default function ExerciseNotes({notes} : ExerciseNotesProps) {
    const [isOpen, setIsOpen] = useState(false);

    return(
        <>
            <div className="border-t border-white/5">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="
                    flex w-full
                    items-center justify-between
                    px-4 py-3
                    text-sm
                    text-[#9A94A8]
                    transition-colors
                    hover:text-[#F5F3FA]
                "
            >
                <span>
                    {notes ? "View Notes" : "Add Notes"}
                </span>

                <ChevronDown
                    className={`
                        h-4 w-4
                        transition-transform
                        ${isOpen ? "rotate-180" : ""}
                    `}
                />
            </button>

            {isOpen && (
                <div className="px-4 pb-4">
                    <textarea
                        defaultValue={notes ?? ""}
                        placeholder="How did this exercise feel?"
                        className="
                            min-h-24
                            w-full
                            resize-none
                            rounded-xl
                            border border-white/10
                            bg-[#09080F]
                            p-3
                            text-sm
                            text-[#F5F3FA]
                            outline-none
                            placeholder:text-[#625C70]
                            focus:border-[#A855F7]
                            focus:ring-1
                            focus:ring-[#A855F7]/50
                        "
                    />
                </div>
            )}
        </div>
        </>
    );
}