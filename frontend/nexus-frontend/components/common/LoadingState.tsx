// Skeleton placeholder shown while a page loads its data

export default function LoadingState({ label = "Loading..." }: { label?: string }) {
    return (
        <div className="space-y-4" role="status" aria-label={label}>
            {[0, 1, 2].map((index) => (
                <div
                    key={index}
                    className="
                        h-24
                        animate-pulse
                        rounded-2xl
                        bg-white/5
                    "
                />
            ))}
        </div>
    );
}
