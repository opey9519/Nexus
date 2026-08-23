// Canonical activity levels - must match the backend whitelist
// enforced in UserService.PatchCurrentUserActivityLevelAsync

export const ACTIVITY_LEVELS = [
    "Sedentary",
    "Lightly Active",
    "Moderately Active",
    "Very Active",
    "Extremely Active"
] as const;

export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number];
