import ProfileStat from "./ProfileStats";

interface ProfileInformationProps {
    firstName: string;
    lastName: string;
    email: string;
}

export default function ProfileInformation({firstName, lastName, email} : ProfileInformationProps) {
    return (
        <>
            <section
            className="
                rounded-2xl
                border border-white/10
                bg-[#12101A]
                px-4
            "
        >
            <h2 className="
                pt-4
                text-sm
                font-semibold
                text-[#F5F3FA]
            ">
                Personal Information
            </h2>

            <ProfileStat
                label="First Name"
                value={firstName}
            />

            <ProfileStat
                label="Last Name"
                value={lastName}
            />

            <ProfileStat
                label="Email"
                value={email}
            />
        </section>
        </>
    );
}