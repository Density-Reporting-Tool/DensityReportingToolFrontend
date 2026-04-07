export interface BackendApiResponse<T> {
  success: boolean
message: string
data: T | null
errors: string[] | null
stackTrace?: string //optional, for dev
}
