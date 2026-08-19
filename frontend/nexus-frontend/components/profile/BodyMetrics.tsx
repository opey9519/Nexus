import ProfileStat from "./ProfileStat";

interface BodyMetricsProps {
    heightCm : number;
    bodyweightLbs: number;
}

export default function BodyMetrics({heightCm, bodyweightLbs} : BodyMetricsProps) {
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
            <h2 className="
                pt-4
                text-sm
                font-semibold
                text-[#F5F3FA]
            ">
                Body Metrics
            </h2>

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