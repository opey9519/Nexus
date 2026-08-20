interface WorkoutHeaderProps {
    date: string;
    workoutName: string;
}

export default function WorkoutHeader ({date, workoutName} : WorkoutHeaderProps) {
    return (
        <>
            <header className="space-y-2">
            <p className="text-sm text-[#9A94A8]">
                {date}
            </p>

            <h1 className="
                text-2xl
                font-semibold
                tracking-tight
                text-[#F5F3FA]
            ">
                {workoutName}
            </h1>
        </header>
        </>
    );
}