interface SetRowProps {
    setNumber: number;
    weight: number;
    reps: number;
    rpe?: number | null;
}

export default function SetRow({setNumber, weight, reps, rpe} : SetRowProps) {
    return(
        <>
            <div className="
            grid
            grid-cols-[40px_1fr_60px_60px]
            items-center
            gap-2
            border-t
            border-white/5
            px-4
            py-3
            text-sm
        ">
            <span className="text-[#9A94A8]">
                {setNumber}
            </span>

            <span className="font-medium text-[#F5F3FA]">
                {weight} lbs
            </span>

            <span className="text-[#F5F3FA]">
                {reps}
            </span>

            <span className="text-[#9A94A8]">
                {rpe ?? "—"}
            </span>
        </div>
        </>
    );
}