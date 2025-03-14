import { ToastType } from "@/@types/toast";
import Notification from "./Notification";
import { toast } from "@/components/ui";
import { useTranslation } from "react-i18next";

export type { NotificationProps } from "./Notification";
export { Notification };

export const openNotification = (
  duration: number,
  type: ToastType,
  text: string,
) => {
  toast.push(
    <Notification
      closable={true}
      duration={duration}
      title={"Ошибка!"}
      type={type}
    >
      {text}
    </Notification>,
  );
};

export default Notification;
