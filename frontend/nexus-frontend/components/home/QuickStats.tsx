interface QuickStatsProps {
    workoutCount: number;
    streak: number;
}

export default function QuickStats({
    workoutCount,
    streak,
}: QuickStatsProps) {
    return (
        <section>
            <h2 className="
                mb-3
                text-xs
                font-medium
                uppercase
                tracking-wider
                text-[#625C70]
            ">
                Quick Stats
            </h2>

            <div className="grid grid-cols-2 gap-3">

                <div className="
                    rounded-2xl
                    border border-white/10
                    bg-[#12101A]
                    p-4
                ">
                    <p className="text-xs text-[#9A94A8]">
                        Workouts
                    </p>

                    <p className="
                        mt-2
                        text-2xl
                        font-semibold
                        text-[#F5F3FA]
                    ">
                        {workoutCount}
                    </p>
                </div>

                <div className="
                    rounded-2xl
                    border border-white/10
                    bg-[#12101A]
                    p-4
                ">
                    <p className="text-xs text-[#9A94A8]">
                        Streak
                    </p>

                    <p className="
                        mt-2
                        text-2xl
                        font-semibold
                        text-[#A855F7]
                    ">
                        {streak} days
                    </p>
                </div>

            </div>
        </section>
    );
}