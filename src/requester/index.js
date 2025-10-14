import axios from "axios";
import axiosRetry from "axios-retry";
import { baseUrl } from "constant";
import secureStorage from "hooks/secureStorage";

const API_BASE_URL = baseUrl || "";

/**
 * AxiosRequester: a reusable wrapper for axios
 */
export class AxiosRequester {
    constructor(config = {}) {
        this.config = { ...config };
        this.baseURL = config.baseURL || API_BASE_URL;
        this.instance = axios.create({
            baseURL: this.baseURL,
            headers: { "Content-Type": "application/json" },
            ...config,
        });

        // Retry failed network/idempotent requests
        axiosRetry(this.instance, {
            retries: config.retries || 1,
            retryDelay: axiosRetry.exponentialDelay,
            retryCondition: (error) => {
                return (
                    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
                    error.response?.status === 429
                );
            },
        });

        // -----------------------------
        // Request Interceptor
        // -----------------------------
        this.instance.interceptors.request.use(
            async (cfg) => {
                // Add auth token if available
                const token = secureStorage.getItem("authToken");
                if (token) cfg.headers["Authorization"] = `Bearer ${token}`;

                // Debug logging (optional)
                if (this.config.debug) {
                    console.log("➡️ Request:", cfg.url, cfg);
                }

                return cfg;
            },
            (error) => Promise.reject(error)
        );

        // -----------------------------
        // Response Interceptor
        // -----------------------------
        this.instance.interceptors.response.use(
            async (response) => response,
            async (error) => {
                if (error.response) {
                    const { status, data } = error.response;
                    // Example: handle 401 Unauthorized
                    if (status === 401) {
                        secureStorage.clear();
                        // window.location.href = "/login-authentication"; // redirect if needed
                    }
                    throw {
                        status,
                        message: data?.message || error?.message || error?.statusText,
                        data,
                    };
                }
                return Promise.reject(error);
            }
        );
    }

    // -----------------------------
    // Core Request Methods
    // -----------------------------
    async get(url, params, headers = {}) {
        const res = await this.instance.get(url, { params, headers });
        return this.#parseResponse(res);
    }

    async post(url, data, params, headers = {}) {
        const res = await this.instance.post(url, data, { params, headers });
        return this.#parseResponse(res);
    }

    async put(url, data, params, headers = {}) {
        const res = await this.instance.put(url, data, { params, headers });
        return this.#parseResponse(res);
    }

    async patch(url, data, params, headers = {}) {
        const res = await this.instance.patch(url, data, { params, headers });
        return this.#parseResponse(res);
    }

    async delete(url, params, headers = {}) {
        const res = await this.instance.delete(url, { params, headers });
        return this.#parseResponse(res);
    }

    // -----------------------------
    // Internal Response Parser
    // -----------------------------
    async #parseResponse(response) {
        const contentType = response.headers["content-type"] || "";
        const responseType = response.config?.responseType || "";

        // 1 JSON
        if (contentType.includes("application/json")) {
            if (response.data instanceof Blob) {
                const text = await response.data.text();
                return JSON.parse(text);
            }

            const data = response.data;

            // Handle logical errors (even if status = 200)
            if (data && data.success === false) {
                const err = new Error(data.message || "Request failed");
                err.data = data;
                err.status = response.status;
                throw err;
            }

            return data;
        }

        // 2 Plain Text / HTML
        if (
            contentType.includes("text/plain") ||
            contentType.includes("text/html")
        ) {
            return response.data;
        }

        // 3 Binary / Blob
        if (
            responseType === "blob" ||
            contentType.includes("application/octet-stream") ||
            contentType.includes("application/pdf") ||
            contentType.startsWith("image/") ||
            contentType.startsWith("video/") ||
            contentType.startsWith("audio/")
        ) {
            if (response.data instanceof Blob) return response.data;
            return new Blob([response.data], { type: contentType });
        }

        // 4 Default fallback
        return response.data ?? null;
    }

}

/**
 * Helper to easily create a requester
 * Example: request({ responseType: 'blob' })
 */
export function request(config = {}) {
    return new AxiosRequester({
        baseURL: API_BASE_URL,
        ...config,
    });
}