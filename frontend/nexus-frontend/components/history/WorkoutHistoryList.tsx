import WorkoutHistoryCard from "./WorkoutHistoryCard";

interface WorkoutHistoryItem {
    id: string;
    date: string;
    name: string;
    exerciseCount: number;
    setCount: number;
    totalVolume?: number;
}

interface WorkoutHistoryProps {
    workouts: WorkoutHistoryItem[];
}

export default function WorkoutHistoryList({workouts} : WorkoutHistoryProps) {
    return(
        <>
            <div className="space-y-4">
            {workouts.map((workout) => (
                <WorkoutHistoryCard
                    key={workout.id}
                    {...workout}
                />
            ))}
        </div>
        </>
    );    
}