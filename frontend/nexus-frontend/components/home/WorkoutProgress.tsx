interface WorkoutProgressProps {
    completedSets: number;
    totalSets: number;
}

export default function WorkoutProgress({
    completedSets,
    totalSets,
}: WorkoutProgressProps) {
    const progress =
        totalSets > 0
            ? (completedSets / totalSets) * 100
            : 0;

    return (
        <div>
            <div className="
                mb-2
                flex
                items-center
                justify-between
                text-xs
            ">
                <span className="text-[#9A94A8]">
                    Progress
                </span>

                <span className="font-medium text-[#F5F3FA]">
                    {completedSets}/{totalSets}
                </span>
            </div>

            <div className="
                h-2
                overflow-hidden
                rounded-full
                bg-[#25212F]
            ">
                <div
                    className="
                        h-full
                        rounded-full
                        bg-[#A855F7]
                        transition-all
                        duration-300
                    "
                    style={{
                        width: `${progress}%`,
                    }}
                />
            </div>
        </div>
    );
}