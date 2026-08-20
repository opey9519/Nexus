import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface WorkoutHistoryCardProps {
    id: string;
    date: string;
    name: string;
    exerciseCount: number;
    setCount: number;
    totalVolume?: number;
}

export default function WorkoutHistoryCard({id, date, name, exerciseCount, setCount, totalVolume} : WorkoutHistoryCardProps) {
    const formattedDate = new Date(date).toLocaleDateString(
        "en-US",
        {
            weekday: "short",
            month: "short",
            day: "numeric"
        }
    );

    return(
        <>
            <Link
            href={`/workout/${id}`}
            className="
                group
                block
                rounded-2xl
                border border-white/10
                bg-[#12101A]
                p-4
                transition-all duration-200
                hover:border-[#A855F7]/30
                active:scale-[0.98]
            "
        >
            <div className="flex items-center justify-between">
                <div className="min-w-0">

                    <p className="
                        text-xs
                        text-[#9A94A8]
                    ">
                        {formattedDate}
                    </p>

                    <h2 className="
                        mt-1
                        text-base
                        font-semibold
                        text-[#F5F3FA]
                    ">
                        {name}
                    </h2>

                </div>

                <ChevronRight
                    className="
                        h-5 w-5
                        shrink-0
                        text-[#625C70]
                        transition-transform
                        group-hover:translate-x-1
                        group-hover:text-[#A855F7]
                    "
                />
            </div>

            <div className="
                mt-4
                flex
                items-center
                gap-2
                text-xs
                text-[#9A94A8]
            ">
                <span>
                    {exerciseCount} Exercises
                </span>

                <span className="text-[#625C70]">
                    ·
                </span>

                <span>
                    {setCount} Sets
                </span>

                {totalVolume !== undefined && (
                    <>
                        <span className="text-[#625C70]">
                            ·
                        </span>

                        <span>
                            {totalVolume.toLocaleString()} lbs
                        </span>
                    </>
                )}
            </div>
        </Link>
        </>
    );
}