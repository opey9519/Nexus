interface ActivityLevelProps {
    activityLevel: string;
}

export default function ActivityLevel({activityLevel} : ActivityLevelProps) {
    return(
        <>
            <section
            className="
                rounded-2xl
                border border-white/10
                bg-[#12101A]
                p-4
            "
        >
            <h2 className="
                text-sm
                font-semibold
                text-[#F5F3FA]
            ">
                Activity Level
            </h2>

            <div className="mt-3 flex items-center gap-3">
                <div
                    className="
                        h-2
                        w-2
                        rounded-full
                        bg-[#A855F7]
                        shadow-[0_0_8px_rgba(168,85,247,0.7)]
                    "
                />

                <span className="text-sm text-[#F5F3FA]">
                    {activityLevel}
                </span>
            </div>
        </section>
        </>
    );
}