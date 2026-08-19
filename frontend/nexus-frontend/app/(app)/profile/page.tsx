import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInformation from "@/components/profile/ProfileInformation";
import BodyMetrics from "@/components/profile/BodyMetrics";
import ActivityLevel from "@/components/profile/ActivityLevel";

export default function ProfilePage() {
    return (
        <>
            <main className="px-4 pb-24 pt-8">
            <div className="mx-auto max-w-md space-y-6">

                <h1 className="
                    text-2xl
                    font-semibold
                    text-[#F5F3FA]
                ">
                    Profile
                </h1>

                <ProfileHeader
                    firstName="Gavin"
                    lastName="Wilson"
                    username="gavin"
                />

                <ProfileInformation
                    firstName="Gavin"
                    lastName="Wilson"
                    email="gavin@example.com"
                />

                <BodyMetrics
                    heightCm={173}
                    bodyweightLbs={201.5}
                />

                <ActivityLevel
                    activityLevel="Very Active"
                />

                <section
                    className="
                        rounded-2xl
                        border border-white/10
                        bg-[#12101A]
                        p-4
                    "
                >
                    <p className="text-sm text-[#9A94A8]">
                        Member Since
                    </p>

                    <p className="mt-1 font-medium text-[#F5F3FA]">
                        August 19, 2026
                    </p>
                </section>

            </div>
        </main>
        </>
    );
}