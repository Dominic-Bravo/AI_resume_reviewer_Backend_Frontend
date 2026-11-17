import Axios, { AxiosRequestConfig, AxiosError } from "axios";

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  withCredentials: true, // Crucial for sending/receiving HttpOnly JWT cookies securely
  headers: {
    "Content-Type": "application/json",
  },
});

// Custom wrapper function utilized by Orval generated hooks
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();

  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // Attach cancel method to the promise for React Query lifecycle cleanup
  //@ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled by React Query.");
  };

  return promise;
};

// Optional: Global response interceptor for handling 401 Unauthorized globally
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle global errors (e.g., redirecting to login on token expiration)
    if (error.response?.status === 401) {
      // Optional: trigger client-side auth state reset or redirect
    }
    return Promise.reject(error);
  },
);

export default customInstance;
