// API URL to server
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// Healthcheck with ASP.NET CORE
export async function HealthCheck() {
    try {
        const response = await fetch(`${API_BASE}/api/health`);

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        console.log(data.message)
        
        return data;
    } catch (error) {
        console.error("Server returned error:", error);

        return {
            error: true,
            message: "System is not healthy"
        };
    }
}