import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface RecentWorkoutCardProps {
    id: string;
    name: string;
    date: string;
    setCount: number;
}

export default function RecentWorkoutCard({
    id,
    name,
    date,
    setCount,
}: RecentWorkoutCardProps) {
    return (
        <section>
            <div className="
                mb-3
                flex
                items-center
                justify-between
            ">
                <h2 className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-[#625C70]
                ">
                    Recent
                </h2>

                <Link
                    href="/history"
                    className="
                        text-xs
                        text-[#A855F7]
                    "
                >
                    View All
                </Link>
            </div>

            <Link
                href={`/workout/${id}`}
                className="
                    flex
                    items-center
                    justify-between
                    rounded-2xl
                    border border-white/10
                    bg-[#12101A]
                    p-4
                    transition-all
                    hover:border-[#A855F7]/30
                    active:scale-[0.98]
                "
            >
                <div>
                    <p className="
                        text-sm
                        font-semibold
                        text-[#F5F3FA]
                    ">
                        {name}
                    </p>

                    <p className="
                        mt-1
                        text-xs
                        text-[#9A94A8]
                    ">
                        {date} · {setCount} Sets
                    </p>
                </div>

                <ChevronRight
                    className="
                        h-5 w-5
                        text-[#625C70]
                    "
                />
            </Link>
        </section>
    );
}