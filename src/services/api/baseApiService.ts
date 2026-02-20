import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse } from "@/types/api";

export abstract class BaseApiService {
  protected http: AxiosInstance;

  constructor(resourcePath: string) {
    this.http = axios.create({
      baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/${resourcePath}`,
      headers: { "Content-Type": "application/json" },
      timeout: 10000, // Replace getRequestTimeout() if it's a constant
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.http.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<any>>) => {
        const apiResponse = response.data;

        if (!apiResponse.success) {
          return Promise.reject(apiResponse);
        }

        return response;
      },
      (error) => {
        const formattedError: ApiResponse<null> = error.response?.data || {
          success: false,
          message: error.message || "An unexpected error occurred",
          data: null,
          errors: [
            error.code === "ECONNABORTED"
              ? "Request timed out"
              : "Network error",
          ],
        };

        return Promise.reject(formattedError);
      },
    );
  }

  protected async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.http.request<ApiResponse<T>>(config);
    return response.data.data as T;
  }

  get<T>(url: string = "", config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "GET", url });
  }

  post<T>(url: string = "", data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "POST", url, data });
  }

  put<T>(url: string = "", data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "PUT", url, data });
  }

  delete<T>(url: string = "", config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "DELETE", url });
  }
}
