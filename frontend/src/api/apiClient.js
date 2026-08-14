const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
    throw new Error(
        "VITE_API_URL environment variable is not configured.",
    );
}

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
};

const parseResponse = async (response) => {
    if (response.status === 204) {
        return null;
    }

    const contentType =
        response.headers.get("content-type");

    if (
        contentType &&
        contentType.includes("application/json")
    ) {
        return response.json();
    }

    const text = await response.text();

    return text
        ? { error: text }
        : null;
};

const request = async (
    endpoint,
    options = {},
) => {
    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...options.headers,
            },
        },
    );

    const data = await parseResponse(response);

    if (!response.ok) {
        throw new Error(
            data?.error ||
            data?.message ||
            `Request failed with status ${response.status}`,
        );
    }

    return data;
};

const apiClient = {
    get: (endpoint) =>
        request(endpoint),

    post: (endpoint, body) =>
        request(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
        }),

    put: (endpoint, body) =>
        request(endpoint, {
            method: "PUT",
            body: JSON.stringify(body),
        }),

    delete: (endpoint) =>
        request(endpoint, {
            method: "DELETE",
        }),
};

export default apiClient;