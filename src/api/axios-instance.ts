import Axios, {
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const AXIOS_INSTANCE = Axios.create({
  // Note: Orval paths already begin with /api/v1/...
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  withCredentials: true, // Sends the HttpOnly refresh cookie
});

// Shared single-flight refresh helper (prevents duplicate calls on Strict Mode mount or concurrent 401s)
export const refreshAccessToken = async (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = AXIOS_INSTANCE.post<{ access: string }>(
      "/api/v1/token/refresh/",
    )
      .then(({ data }) => {
        setAccessToken(data.access);
        return data.access;
      })
      .catch((error) => {
        setAccessToken(null);
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// Attach in-memory access token to every request
AXIOS_INSTANCE.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
);

// Silent refresh interceptor on 401
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Avoid infinite loops on login/refresh endpoints
    if (
      originalRequest &&
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/token/refresh/") &&
      !originalRequest.url?.includes("/login/")
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return AXIOS_INSTANCE(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

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

  // @ts-expect-error attach cancel for React Query
  promise.cancel = () => source.cancel("Query was cancelled by React Query.");

  return promise;
};

export default customInstance;