import { useEffect, useMemo } from "react";
import { SocketClass } from "@/websocket/create-socket";
import useStorage from "@/utils/hooks/useStorage";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  setActiveTransfer,
  setClearUisInfo,
  setLegIDClient,
  setUisEvent,
  setUisInfo,
} from "@/store/slices/uis";
import { setReportLink } from "@/store/slices/report";
import { setWS } from "@/store/slices/ws";
import {
  setEntityByIdTransfer,
  updateEntityMarkers,
  updateEntityRating,
} from "@/store/slices/entities";
import {
  WS_SERVER_PONG_RESPONSE,
  SocketMessageType,
} from "@/websocket/constants";
import appConfig from "@/configs/app.config";
import { updateEntityRatingWeekly } from "@/store/slices/entities/ratingWeeklySlice";
import { useSearchParams } from "react-router-dom";
import { TabUrl } from "@/views/Rating/Rating";
import { updateRatingWeeklyCount } from "@/store/slices/entities/ratingCountSlice";

type Args = {
  type: string;
  data?: any;
  socket?: WebSocket | null;
};

const parseChannelName = (str: string) => {
  if (str) {
    return str?.split(":")[0];
  } else {
    return "";
  }
};

enum ChannelsType {
  CALL = "call",
  REPORT = "report",
  TRANSFER = "transfer",
  RATING = "rating",
  RATING_WEEK = "rating-week",
  MAP = "map",
}

export default function WSManager(): null {
  const dispatch = useAppDispatch();
  const [queryParams, setQueryParams] = useSearchParams();
  const wsChannels = useAppSelector((state) => state.ws.wsChannels);
  const employee_id = useAppSelector((state) => state.auth.user.id);
  const { token } = useAppSelector((state) => state.auth.session);
  const tab = queryParams.get("tab");
  const wsListener = (message: Args) => {
    switch (message?.type) {
      case SocketMessageType.ONOPEN:
        wsChannels?.length > 0 &&
          wsChannels?.forEach((channel: string) => {
            socketInstance?.sendSocketMessageFx({
              subscribe: [channel],
            });
          });
        dispatch(setWS(true));
        console.log(SocketMessageType.ONOPEN, message);
        break;
      case SocketMessageType.ONCLOSE:
        if (message?.data?.code !== 1000) {
          dispatch(setWS(false));
        }
        console.log(SocketMessageType.ONCLOSE, message);
        break;
      case SocketMessageType.NO_PONG:
        dispatch(setWS(false));
        break;
      case SocketMessageType.ONERROR:
        console.log(SocketMessageType.ONERROR, message);
        dispatch(setWS(false));
        break;
      case SocketMessageType.MESSAGE:
        if (message?.data?.data === WS_SERVER_PONG_RESPONSE) {
          dispatch(setWS(true));
        }
        if (parseChannelName(message?.data?.channel) === ChannelsType.CALL) {
          if (message?.data?.event) {
            if (message?.data?.event?.key === "SHOULDER_COMPLETION") {
              dispatch(setClearUisInfo());
              dispatch(setActiveTransfer(null));
            } else {
              if (message?.data?.event?.key !== "END_OF_CONVERSATION") {
                dispatch(setUisInfo(message?.data));
                dispatch(setLegIDClient(message?.data?.leg_id));
              }
              if (message?.data?.event?.key === "STARTING_A_CONVERSATION") {
                dispatch(setUisEvent(message?.data?.event?.key));
              }
            }
          }
        }
        if (parseChannelName(message?.data?.channel) === ChannelsType.REPORT) {
          dispatch(setReportLink(message?.data));
        }
        if (
          parseChannelName(message?.data?.channel) === ChannelsType.TRANSFER
        ) {
          dispatch(setEntityByIdTransfer(message?.data.data));
        }
        if (message?.data?.channel === ChannelsType.RATING) {
          tab === TabUrl.DAILY_RATING &&
            dispatch(updateEntityRating(message?.data));
        }
        if (message?.data?.channel === ChannelsType.RATING_WEEK) {
          tab === TabUrl.WEEKLY_RATING &&
            dispatch(updateEntityRatingWeekly(message?.data));
        }
        if (
          message?.data?.channel ===
          `${ChannelsType.RATING_WEEK}:${employee_id}`
        ) {
          dispatch(updateRatingWeeklyCount(message?.data?.data));
        }
        if (message?.data?.channel === ChannelsType.MAP) {
          dispatch(updateEntityMarkers(message?.data));
        }
        break;
      default:
        break;
    }
  };

  const socketInstance: SocketClass | null = useMemo(() => {
    return new SocketClass();
  }, []);

  const sendMessage = (e: CustomEvent) => {
    e.detail && socketInstance?.sendSocketMessageFx(e.detail);
  };

  useEffect(() => {
    let pingInterval = null;
    window.addEventListener(
      "send-socket-message",
      sendMessage as EventListener,
    );
    return () => {
      pingInterval && clearInterval(pingInterval);
      window.removeEventListener(
        "send-socket-message",
        sendMessage as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    socketInstance?.openSocketFx(
      { wsURL: `${appConfig.wsLink}?token=${token}` },
      wsListener,
    );
    // if (employee_id) {
    //   socketInstance?.openSocketFx(
    //     { channel: `connect:${employee_id}` },
    //     wsListener,
    //   );
    // } else socketInstance?.closeSocketFx(1000, "client disconnected");
    return () => {
      socketInstance?.closeSocketFx(1000, "client disconnected");
    }
  }, [token]);

  return null;
}
