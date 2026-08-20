// TODO: Functionality upon clicking button

import { Plus } from "lucide-react";

export default function AddExerciseButton() {
    return(
        <>
            <button
            type="button"
            className="
                flex w-full
                items-center justify-center
                gap-2
                rounded-2xl
                border border-dashed
                border-white/10
                py-4
                text-sm font-medium
                text-[#9A94A8]
                transition-all
                hover:border-[#A855F7]/50
                hover:text-[#A855F7]
                active:scale-[0.98]
            "
        >
            <Plus className="h-5 w-5" />

            Add Exercise
        </button>
        </>
    );
}