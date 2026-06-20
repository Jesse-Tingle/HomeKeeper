const API_BASE_URL = "http://localhost:5000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return {
            "Content-Type": "application/json"
        };
    }

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };
};

const apiClient = {
    get: async (endpoint) => {
        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                headers: getAuthHeaders()
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Request failed");
        }

        return data;
    },

    post: async (endpoint, body) => {
        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(body)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Request failed");
        }

        return data;
    },

    put: async (endpoint, body) => {
        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(body)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Request failed");
        }

        return data;
    },

    delete: async (endpoint) => {
        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                method: "DELETE",
                headers: getAuthHeaders()
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Request failed");
        }

        return data;
    }
};

export default apiClient;