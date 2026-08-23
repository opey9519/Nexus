import { ApiError } from "./Utils";

// Shared API client used by all endpoint modules.
// Sends/receives the JWT via httpOnly cookies and
// silently refreshes an expired access token once per request.

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// Single in-flight refresh so concurrent 401s share one call
let refreshInFlight: Promise<boolean> | null = null;

function redirectToLogin(): void {
    if (typeof window !== "undefined") {
        // Hard navigation from non-React code: clears all client
        // state and re-runs the proxy auth gate.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign("/login");
    }
}

async function tryRefresh(): Promise<boolean> {
    if (!refreshInFlight) {
        refreshInFlight = (async () => {
            try {
                const response = await fetch(`${API_BASE}/api/auth/refresh`, {
                    method: "POST",
                    credentials: "include"
                });

                return response.ok;
            } catch {
                return false;
            }
        })().finally(() => {
            refreshInFlight = null;
        });
    }

    return refreshInFlight;
}

async function parseError(response: Response): Promise<ApiError> {
    let message = `Request failed (${response.status})`;

    try {
        const data = await response.json();
        if (typeof data?.message === "string" && data.message) {
            message = data.message;
        }
    } catch {
        // Non-JSON body, keep default message
    }

    return new ApiError(response.status, message);
}

export async function request<T>(
    method: string,
    url: string,
    body?: unknown,
    allowRefresh = true
): Promise<T | undefined> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json"
    };

    const response = await fetch(`${API_BASE}${url}`, {
        method,
        headers,
        credentials: "include",
        body: body !== undefined ? JSON.stringify(body) : undefined
    });

    // Access token expired - refresh once and retry the original request.
    // Auth endpoints are excluded: a 401 there means bad credentials,
    // not an expired session.
    if (response.status === 401 && allowRefresh && !url.startsWith("/api/auth/")) {
        const refreshed = await tryRefresh();

        if (refreshed) {
            return request<T>(method, url, body, false);
        }

        redirectToLogin();
        throw new ApiError(401, "Your session has expired. Please sign in again.");
    }

    if (!response.ok) {
        throw await parseError(response);
    }

    if (response.status === 204) {
        return undefined;
    }

    return (await response.json()) as T;
}
