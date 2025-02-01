
export type ServerResp<T> = {
  data: T,
  error: string
  status: boolean
}