interface ProfileStatProps {
    label: string;
    value: string;
}

export default function ProfileStat({label, value} : ProfileStatProps) {
    return(
        <>
            <div className="flex items-center justify-between py-3">
            <span className="text-sm text-[#9A94A8]">
                {label}
            </span>

            <span className="text-sm font-medium text-[#F5F3FA]">
                {value}
            </span>
        </div>
        </>
    );
}