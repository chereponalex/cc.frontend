import {
  PING_INTERVAL,
  WS_SERVER_PING_REQUEST,
  WS_SERVER_PONG_RESPONSE,
  WS_TIMER_RECONNECT,
} from "./constants";
import { SocketMessageType } from "@/websocket/constants";

export class SocketClass {
  socket: WebSocket | null = null;
  socketUrl: string = "";
  pingInterval: ReturnType<typeof setInterval> | null;
  pingTimeout: ReturnType<typeof setTimeout> | null;
  reconnectTimeout: ReturnType<typeof setTimeout> | null;
  callback?: (args: { type: string; data?: any }) => any;

  constructor(url: string) {
    this.socketUrl = url;
    this.pingInterval = null;
    this.pingTimeout = null;
    this.reconnectTimeout = null;
  }

  openSocketFx(
    { type, channel }: { channel: string; type?: string },
    cb: (args: { type: string; data?: any }) => any,
  ) {
    this.callback = cb;
    if (this.socket && type !== "reconnect") {
      return;
    }

    clearTimeout(this.reconnectTimeout as any);
    this.socket = new WebSocket(this.socketUrl);
    this.socket.onopen = (e) => {
      this.callback &&
        this.callback({ type: SocketMessageType.ONOPEN, data: e });
      this.pingInterval = setInterval(() => {
        this.socket?.send(
          JSON.stringify({ channel, data: WS_SERVER_PING_REQUEST }),
        );
        this.pingTimeout = setTimeout(() => {
          this.callback &&
            this.callback({ type: SocketMessageType.NO_PONG, data: e });
        }, 1500);
      }, PING_INTERVAL);
    };

    this.socket.onclose = (e) => {
      console.log(e, "e");
      this.callback &&
        this.callback({ type: SocketMessageType.ONCLOSE, data: e });
      clearInterval(this.pingInterval as any);
      if (e.code !== 1000) {
        this.reconnectTimeout = setTimeout(() => {
          this.openSocketFx({ type: "reconnect", channel: channel }, cb);
        }, WS_TIMER_RECONNECT);
      }
    };

    this.socket.onerror = (e) => {
      this.callback &&
        this.callback({ type: SocketMessageType.ONERROR, data: e });
      clearInterval(this.pingInterval as any);
    };
    this.socket.onmessage = (event: MessageEvent) => {
      let message = event.data ? JSON.parse(event.data) : {};
      if (message.data === WS_SERVER_PONG_RESPONSE) {
        clearTimeout(this.pingTimeout as any);
      }
      this.callback &&
        this.callback({ type: SocketMessageType.MESSAGE, data: message });
    };
  }

  closeSocketFx(code?: number, reason?: string) {
    if (this.socket) {
      this.socket.close(code, reason);
      this.socket = null;
    }
  }

  sendSocketMessageFx(message: { [key: string]: any }) {
    if (
      this.socket &&
      this.socket.readyState !== WebSocket.CONNECTING &&
      this.socket.readyState !== WebSocket.CLOSING
    ) {
      this.socket.send(JSON.stringify(message));
    }
  }
}

// export const getSocketLink = (
//   apiPrefix: string,
//   query: { [key: string]: string },
//   port?: number,
// ) => {
//   const protocol = window.location.protocol === "https:" ? "wss" : "wss";
//   const url = port ? `dev.api.lidofon.com:${port}` : "dev.api.lidofon.com";

//   return `${protocol}://${url}?${new URLSearchParams({
//     ...query,
//   }).toString()}`;
// };
