interface WorkoutSummaryProps {
    exerciseCount: number;
    setCount: number;
}

export default function WorkoutSummary({exerciseCount, setCount} : WorkoutSummaryProps) {
    return(
        <>
            <div className="
            flex
            items-center
            gap-2
            text-sm
            text-[#9A94A8]
        ">
            <span>{exerciseCount} Exercises</span>

            <span className="text-[#625C70]">
                ·
            </span>

            <span>{setCount} Sets</span>
        </div>
        </>
    );    
}