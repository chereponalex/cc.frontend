import { useMemo, lazy, Suspense, useEffect, useState } from "react";
import Loading from "@/components/shared/Loading";
import {
  setInitialRating,
  setLoadingInitRating,
  useAppDispatch,
  useAppSelector,
} from "@/store";
import Notification from "@/components/ui/Notification";
import {
  LAYOUT_TYPE_CLASSIC,
  LAYOUT_TYPE_MODERN,
  LAYOUT_TYPE_SIMPLE,
  LAYOUT_TYPE_STACKED_SIDE,
  LAYOUT_TYPE_DECKED,
  LAYOUT_TYPE_BLANK,
  LAYOUT_TYPE_MAP,
} from "@/constants/theme.constant";
import useAuth from "@/utils/hooks/useAuth";
import useDirection from "@/utils/hooks/useDirection";
import useLocale from "@/utils/hooks/useLocale";
import { setLoadingReport } from "@/store/slices/report";
import { ToastType } from "@/@types/toast";
import { toast } from "../ui";
import { useTranslation } from "react-i18next";
import isPassedDate from "@/utils/isPassedDate";
import useStorage from "@/utils/hooks/useStorage";
import { Dialog } from "../shared/CustomNotification";
import StatusIcon from "../ui/StatusIcon";
import useDarkMode from "@/utils/hooks/useDarkmode";
import { useLazyGetCountWeeklyQuery } from "@/services/RtkQueryService";

const layouts = {
  [LAYOUT_TYPE_CLASSIC]: lazy(() => import("./ClassicLayout")),
  [LAYOUT_TYPE_MODERN]: lazy(() => import("./ModernLayout")),
  [LAYOUT_TYPE_STACKED_SIDE]: lazy(() => import("./StackedSideLayout")),
  [LAYOUT_TYPE_SIMPLE]: lazy(() => import("./SimpleLayout")),
  [LAYOUT_TYPE_DECKED]: lazy(() => import("./DeckedLayout")),
  [LAYOUT_TYPE_BLANK]: lazy(() => import("./BlankLayout")),
  [LAYOUT_TYPE_MAP]: lazy(() => import("./MapLayout")),
};

const Layout = () => {
  const { handleSignOut } = useAuth();
  const [isDark] = useDarkMode();
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
  const { expired_token } = useAppSelector((state) => state.auth.expired);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const layoutType = useAppSelector((state) => state.theme.layout.type);
  const reportLink = useAppSelector((state) => state.report.reportInfo.link);
  const isOpenSocket = useAppSelector((state) => state?.ws.wsInfo);

  const user = useAppSelector((state) => state.auth.user);
  const [getCount, { data: count = null, isLoading, isFetching }] =
    useLazyGetCountWeeklyQuery();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification
        duration={5000}
        title={t(`toast.title.${type}`)}
        type={type}
      >
        {text}
      </Notification>,
    );
  };

  const { authenticated } = useAuth();

  useDirection();

  useLocale();

  useEffect(() => {
    const checkTokenExpiry = () => {
      if (expired_token && isPassedDate(expired_token)) {
        handleSignOut();
      }
    };
    const interval = setInterval(() => {
      checkTokenExpiry();
    }, 1000);
    setIntervalId(interval);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [expired_token]);

  useEffect(() => {
    if (reportLink) {
      window.location.href = reportLink;
      openNotification(ToastType.SUCCESS, t(`global.reportDone`));
    }
    dispatch(setLoadingReport(false));
  }, [reportLink]);

  useEffect(() => {
    if (authenticated) {
      dispatch(setLoadingInitRating(true));
      getCount(user?.id);
    }
  }, [authenticated]);

  useEffect(() => {
    if (count?.data && authenticated) {
      dispatch(setInitialRating(count?.data));
      dispatch(setLoadingInitRating(false));
    }
  }, [count]);

  const AppLayout = useMemo(() => {
    if (authenticated) {
      return layouts[layoutType];
    }
    return lazy(() => import("./AuthLayout"));
  }, [layoutType, authenticated]);

  return (
    <Suspense
      fallback={
        <div className="flex flex-auto flex-col h-[100vh]">
          <Loading loading={true} />
        </div>
      }
    >
      <Dialog value={!isOpenSocket} isDark={isDark}>
        <div className="flex">
          <div className="mr-3">
            <StatusIcon type={"danger"} />
          </div>
          <div className="flex flex-col">
            <h6 style={{ fontSize: "14px" }}>Ошибка!</h6>
            <p>{t(`toast.message.system.socket`)}</p>
          </div>
        </div>
      </Dialog>
      <AppLayout />
    </Suspense>
  );
};

export default Layout;
