"use client"

// Error message with retry, shown when an API call fails

export default function ErrorState({
    message,
    onRetry,
}: {
    message: string;
    onRetry?: () => void;
}) {
    return (
        <div
            role="alert"
            className="
                rounded-2xl
                border border-red-400/20
                bg-red-400/10
                p-5 text-center
            "
        >
            <p className="text-sm text-red-300">
                {message}
            </p>

            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="
                        mt-4 rounded-xl
                        bg-[#A855F7]
                        px-5 py-2
                        text-sm font-semibold text-white
                        transition-colors hover:bg-[#C084FC]
                    "
                >
                    Try Again
                </button>
            )}
        </div>
    );
}
