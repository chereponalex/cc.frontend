export const WS_TIMER_RECONNECT = 10000;
export const PING_INTERVAL = 5000;

export const WS_SERVER_PONG_RESPONSE = "pong";
export const WS_SERVER_PING_REQUEST = "ping";

export enum SocketMessageType {
  ONOPEN = "socket_onopen",
  ONCLOSE = "socket_close",
  ONERROR = "socket_error",
  MESSAGE = "socket_onmessage",
  NO_PONG = "server_no_pong",
}
