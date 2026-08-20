import WorkoutHeader from "@/components/workout/WorkoutHeader";
import WorkoutSummary from "@/components/workout/WorkoutSummary";
import ExerciseCard from "@/components/workout/ExerciseCard";
import AddExerciseButton from "@/components/workout/AddExerciseButton";

export default function WorkoutPage() {
    return (
        <main className="px-4 pb-24 pt-8">
            <div className="mx-auto max-w-md space-y-6">

                <WorkoutHeader
                    date="Thursday, August 20"
                    workoutName="Upper Body"
                />

                <WorkoutSummary
                    exerciseCount={3}
                    setCount={9}
                />

                <div className="space-y-4">

                    <ExerciseCard
                        exerciseName="Bench Press"
                        sets={[
                            {
                                id: 1,
                                setNumber: 1,
                                weight: 225,
                                reps: 5,
                                rpe: 8,
                            },
                            {
                                id: 2,
                                setNumber: 2,
                                weight: 225,
                                reps: 5,
                                rpe: 8.5,
                            },
                            {
                                id: 3,
                                setNumber: 3,
                                weight: 225,
                                reps: 4,
                                rpe: 9,
                            },
                        ]}
                        notes="Last set felt heavier than expected."
                    />

                    <ExerciseCard
                        exerciseName="Overhead Press"
                        sets={[
                            {
                                id: 4,
                                setNumber: 1,
                                weight: 135,
                                reps: 8,
                                rpe: 7,
                            },
                            {
                                id: 5,
                                setNumber: 2,
                                weight: 135,
                                reps: 8,
                                rpe: 7.5,
                            },
                            {
                                id: 6,
                                setNumber: 3,
                                weight: 135,
                                reps: 7,
                                rpe: 8,
                            },
                        ]}
                    />

                    <ExerciseCard
                        exerciseName="Barbell Row"
                        sets={[
                            {
                                id: 7,
                                setNumber: 1,
                                weight: 185,
                                reps: 8,
                                rpe: 7,
                            },
                            {
                                id: 8,
                                setNumber: 2,
                                weight: 185,
                                reps: 8,
                                rpe: 8,
                            },
                            {
                                id: 9,
                                setNumber: 3,
                                weight: 185,
                                reps: 8,
                                rpe: 8,
                            },
                        ]}
                    />

                </div>

                <AddExerciseButton />

            </div>
        </main>
    );
}