import ProfileStat from "./ProfileStat";

interface BodyMetricsProps {
    heightCm : number;
    bodyweightLbs: number;
    onEdit?: () => void;
}

export default function BodyMetrics({heightCm, bodyweightLbs, onEdit} : BodyMetricsProps) {
    const bodyweightKg = (bodyweightLbs / 2.20462);

    return(
        <>
            <section
            className="
                rounded-2xl
                border border-white/10
                bg-[#12101A]
                px-4
            "
        >
            <div className="flex items-center justify-between pt-4">
                <h2 className="
                    text-sm
                    font-semibold
                    text-[#F5F3FA]
                ">
                    Body Metrics
                </h2>

                {onEdit && (
                    <button
                        type="button"
                        onClick={onEdit}
                        className="
                            text-xs font-medium
                            text-[#A855F7]
                            transition-colors hover:text-[#C084FC]
                        "
                    >
                        Edit
                    </button>
                )}
            </div>

            <ProfileStat
                label="Height"
                value={`${heightCm} cm`}
            />

            <ProfileStat
                label="Bodyweight-KG"
                value={`${bodyweightKg.toFixed(2)} kg`}
            />

            <ProfileStat
                label="Bodyweight-LBS"
                value={`${bodyweightLbs.toFixed(1)} lbs`}
            />
        </section>
        </>
    );
}
