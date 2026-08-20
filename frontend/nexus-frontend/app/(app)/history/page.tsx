import HistoryHeader from "@/components/history/HistoryHeader";
import WorkoutHistoryList from "@/components/history/WorkoutHistoryList";
import EmptyHistory from "@/components/history/EmptyHistory";

const workouts = [
    {
        id: "1",
        date: "2026-08-20",
        name: "Upper Body",
        exerciseCount: 3,
        setCount: 9,
        totalVolume: 18450,
    },
    {
        id: "2",
        date: "2026-08-17",
        name: "Lower Body",
        exerciseCount: 5,
        setCount: 16,
        totalVolume: 24210,
    },
    {
        id: "3",
        date: "2026-08-15",
        name: "Upper Body",
        exerciseCount: 4,
        setCount: 12,
        totalVolume: 19850,
    },
];

export default function HistoryPage() {
    return (
        <main className="px-4 pb-24 pt-8">
            <div className="
                mx-auto
                max-w-md
                space-y-6
            ">
                <HistoryHeader />

                {workouts.length > 0 ? (
                    <WorkoutHistoryList
                        workouts={workouts}
                    />
                ) : (
                    <EmptyHistory />
                )}
            </div>
        </main>
    );
}