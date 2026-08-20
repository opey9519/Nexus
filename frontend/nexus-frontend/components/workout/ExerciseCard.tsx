import SetRow from "./SetRow";
import ExerciseNotes from "./ExerciseNotes";

interface Set {
    id: number;
    setNumber: number
    weight: number;
    reps: number;
    rpe?: number | null;
}

interface ExerciseCardProps {
    exerciseName: string;
    sets: Set[];
    notes?: string | null;
}

export default function ExerciseCard({exerciseName, sets, notes} : ExerciseCardProps) {
    return(
        <>
            <section
            className="
                overflow-hidden
                rounded-2xl
                border border-white/10
                bg-[#12101A]
            "
        >
            {/* Exercise Header */}
            <div className="px-4 pt-4">
                <h2 className="
                    text-base
                    font-semibold
                    text-[#F5F3FA]
                ">
                    {exerciseName}
                </h2>
            </div>

            {/* Set Header */}
            <div className="
                mt-4
                grid
                grid-cols-[40px_1fr_60px_60px]
                gap-2
                px-4
                text-xs
                text-[#625C70]
            ">
                <span>Set</span>
                <span>Weight</span>
                <span>Reps</span>
                <span>RPE</span>
            </div>

            {/* Sets */}
            <div className="mt-1">
                {sets.map((set) => (
                    <SetRow
                        key={set.id}
                        setNumber={set.setNumber}
                        weight={set.weight}
                        reps={set.reps}
                        rpe={set.rpe}
                    />
                ))}
            </div>

            {/* Notes */}
            <ExerciseNotes notes={notes} />
        </section>
        </>
    );
}