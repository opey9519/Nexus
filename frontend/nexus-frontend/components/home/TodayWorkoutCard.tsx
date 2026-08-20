import Link from "next/link";
import WorkoutProgress from "./WorkoutProgress";

interface Workout {
    id: string;
    name: string;
    exerciseCount: number;
    completedSets: number;
    totalSets: number;
}

interface TodayWorkoutCardProps {
    workout?: Workout;
}

export default function TodayWorkoutCard({
    workout,
}: TodayWorkoutCardProps) {

    // No workout exists for today
    if (!workout) {
        return (
            <section
                className="
                    rounded-2xl
                    border border-white/10
                    bg-[#12101A]
                    p-5
                "
            >
                <p
                    className="
                        text-xs
                        font-medium
                        uppercase
                        tracking-wider
                        text-[#A855F7]
                    "
                >
                    Today's Workout
                </p>

                <h2
                    className="
                        mt-2
                        text-xl
                        font-semibold
                        text-[#F5F3FA]
                    "
                >
                    Ready to train?
                </h2>

                <p
                    className="
                        mt-2
                        text-sm
                        leading-relaxed
                        text-[#9A94A8]
                    "
                >
                    Start a workout and begin tracking
                    your progress.
                </p>

                <Link
                    href="/workout"
                    className="
                        mt-5
                        flex
                        w-full
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#A855F7]
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        transition-all
                        hover:bg-[#C084FC]
                        active:scale-[0.98]
                    "
                >
                    Start Workout
                </Link>
            </section>
        );
    }

    // A workout exists for today
    const isComplete =
        workout.completedSets >= workout.totalSets;

    return (
        <section
            className="
                overflow-hidden
                rounded-2xl
                border border-[#A855F7]/20
                bg-[#12101A]
                p-5
            "
        >
            <p
                className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-[#A855F7]
                "
            >
                Today's Workout
            </p>

            <h2
                className="
                    mt-2
                    text-xl
                    font-semibold
                    text-[#F5F3FA]
                "
            >
                {workout.name}
            </h2>

            <p
                className="
                    mt-1
                    text-sm
                    text-[#9A94A8]
                "
            >
                {workout.exerciseCount} Exercises ·{" "}
                {workout.totalSets} Sets
            </p>

            <div className="mt-5">
                <WorkoutProgress
                    completedSets={workout.completedSets}
                    totalSets={workout.totalSets}
                />
            </div>

            <Link
                href={`/workout/${workout.id}`}
                className="
                    mt-5
                    flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#A855F7]
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition-all
                    hover:bg-[#C084FC]
                    active:scale-[0.98]
                "
            >
                {isComplete
                    ? "View Workout"
                    : workout.completedSets > 0
                        ? "Continue Workout"
                        : "Start Workout"}
            </Link>
        </section>
    );
}