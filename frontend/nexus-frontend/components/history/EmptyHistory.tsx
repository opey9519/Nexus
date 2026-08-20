import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function EmptyHistory() {
    return(
        <>
            <div
            className="
                flex
                flex-col
                items-center
                justify-center
                rounded-2xl
                border border-white/10
                bg-[#12101A]
                px-6
                py-12
                text-center
            "
        >
            <div
                className="
                    flex
                    h-14 w-14
                    items-center justify-center
                    rounded-full
                    bg-[#A855F7]/10
                    text-[#A855F7]
                "
            >
                <Dumbbell className="h-6 w-6" />
            </div>

            <h2 className="
                mt-5
                text-base
                font-semibold
                text-[#F5F3FA]
            ">
                No workouts yet
            </h2>

            <p className="
                mt-2
                max-w-xs
                text-sm
                text-[#9A94A8]
            ">
                Start your first workout to begin
                building your training history.
            </p>

            <Link
                href="/workout"
                className="
                    mt-6
                    rounded-xl
                    bg-[#A855F7]
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition-colors
                    hover:bg-[#C084FC]
                "
            >
                Start Workout
            </Link>
        </div>
        </>
    );
}