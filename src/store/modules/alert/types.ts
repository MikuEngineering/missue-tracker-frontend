export interface Alert {
  type: string,
  message: string,
  timeoutId: number
}

export interface AlertState {
  alerts: Alert[]
}
