import HomeHeader from "@/components/home/HomeHeader";
import TodayWorkoutCard from "@/components/home/TodayWorkoutCard";
import QuickStats from "@/components/home/QuickStats";
import RecentWorkoutCard from "@/components/home/RecentWorkoutCard";

export default function HomePage() {
    return (
        <main className="px-4 pb-24 pt-8">
            <div className="
                mx-auto
                max-w-md
                space-y-6
            ">

                <HomeHeader
                    firstName="Gavin"
                />

                <TodayWorkoutCard
                    workout={{
                        id: "1",
                        name: "Upper Body",
                        exerciseCount: 3,
                        completedSets: 7,
                        totalSets: 9,
                    }}
                />  

                <QuickStats
                    workoutCount={24}
                    streak={7}
                />

                <RecentWorkoutCard
                    id="2"
                    name="Lower Body"
                    date="Aug 17"
                    setCount={16}
                />

            </div>
        </main>
    );
}