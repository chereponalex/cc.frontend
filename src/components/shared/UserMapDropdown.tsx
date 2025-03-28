import Avatar from "@/components/ui/Avatar";
import Dropdown from "@/components/ui/Dropdown";
import withHeaderItem from "@/utils/hoc/withHeaderItem";
import useAuth from "@/utils/hooks/useAuth";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { HiOutlineLogout, HiOutlineUser } from "react-icons/hi";
import type { CommonProps } from "@/@types/common";
import { useTranslation } from "react-i18next";
import { setEngineerMode, useAppDispatch, useAppSelector } from "@/store";
import routePrefix from "@/configs/routes.config/routePrefix";
import { Profile } from "@/assets/svg";
import { MdOutlineEngineering } from "react-icons/md";
import { Switcher } from "@/components/ui";
import ModeSwitcher from "../template/ThemeConfigurator/ModeSwitcher";
import useDarkMode from "@/utils/hooks/useDarkmode";
import "../../views/ManagerPage/index.css";
import {
  ADMINISTRATOR,
  CONTENT_MANAGER,
  CURATOR,
  OKK,
} from "@/constants/permissions.constant";
import { useEffect, useState } from "react";
import Progress from "@/components/ui/Progress";
import CustomProgressInfo from "./CustomProgressInfo";
import displayStep from "@/utils/displayProgressStep";
import useElementWidthStatic from "@/utils/hooks/useElementWidthStatic";
import { Loading } from "@/components/shared";

const SwitcherComponent = ({ value, onClick }: any) => {
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions,
  );
  const onSwitcherToggle = () => {
    onClick(!value);
  };

  return (
    <span className="flex items-center" style={{ marginLeft: "5px" }}>
      <Switcher checked={value} onChange={onSwitcherToggle} />
    </span>
  );
};

const _UserMapDropdown = ({ className }: CommonProps) => {
  const [isDark] = useDarkMode();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [actualWidth, setActualWidth] = useState<number>(0);

  const { ref, width } = useElementWidthStatic(isOpen);

  const user = useAppSelector((state) => state.auth.user);
  const engineerMode = useAppSelector((state) => state.map.engineerMode);
  const myCountInitial = useAppSelector(
    (state) => state?.auth?.rating?.initialRating?.count,
  );
  const myCountUpdated = useAppSelector(
    (state) => state.entities.weeklyCount.count,
  );
  const isLoadingCount = useAppSelector(
    (state) => state?.auth?.rating?.isLoading,
  );
  const [actualCount, setActualCount] = useState<number>(0);

  useEffect(() => {
    width && setActualWidth(width);
  }, [width]);

  useEffect(() => {
    if (myCountInitial) {
      setActualCount(myCountInitial);
    }
  }, [myCountInitial]);

  useEffect(() => {
    if (myCountUpdated) {
      setActualCount(myCountUpdated);
    }
  }, [myCountUpdated]);

  const { signOut } = useAuth();

  const { t } = useTranslation();

  const UserAvatar = (
    <div className={classNames(className, "flex items-center gap-2")}>
      <Avatar
        size={30}
        shape="circle"
        icon={<HiOutlineUser />}
        className={`${engineerMode && "pulse"}`}
      />
    </div>
  );

  return (
    <div>
      <Dropdown
        onToggle={(val) => {
          val && setIsOpen(val);
        }}
        menuStyle={{ minWidth: 240 }}
        renderTitle={UserAvatar}
        placement="bottom-end"
      >
        <Dropdown.Item variant="header">
          <div className="py-2 px-3 flex items-center gap-2 relative">
            <Avatar size={30} shape="circle" icon={<HiOutlineUser />} />
            <div>
              <div className="text-xs capitalize">{user.status?.value}</div>
              <div ref={ref} className="font-bold">
                {user.first_name} {user.last_name}
              </div>
            </div>
            <div
              style={{
                width: `${actualWidth + 15}px`,
              }}
              className="absolute bottom-[-8px] left-[50px] flex"
            >
              {isLoadingCount ? (
                <div className="w-[15px] absolute bottom-[-10px]">
                  <Loading loading={true} />
                </div>
              ) : (
                <Progress
                  percent={Number(displayStep(actualCount).percent)}
                  variant={"line"}
                  size="md"
                  unlimited={displayStep(actualCount)?.unlimited}
                  color={displayStep(actualCount)?.color}
                  customInfo={
                    <CustomProgressInfo
                      count={actualCount}
                      display={() => displayStep(actualCount)}
                    />
                  }
                />
              )}
            </div>
          </div>
        </Dropdown.Item>
        <Dropdown.Item variant="divider" />
        <Dropdown.Item
          variant="default"
          style={{ height: "25px" }}
          className={`inline-block ${
            !isDark ? "user_dropdown_map_light " : "user_dropdown_map_dark"
          }`}
        >
          <Link className="" to={routePrefix.profile}>
            <div className="flex items-center gap-2 cursor-pointer">
              {/* <Profile /> */}
              <div>
                <div className="font-bold text-gray-900 dark:text-gray-100">
                  <span className="flex gap-2 items-center w-full">
                    <span>Профиль</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </Dropdown.Item>
        <Dropdown.Item variant="divider" />
        {user.role?.name === ADMINISTRATOR ||
        user.role?.name === OKK ||
        user.role?.name === CONTENT_MANAGER ||
        user.role?.name === CURATOR ? (
          <Dropdown.Item
            variant="default"
            style={{ height: "25px" }}
            className={`${
              !isDark ? "user_dropdown_map_light " : "user_dropdown_map_dark"
            }`}
          >
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => dispatch(setEngineerMode(!engineerMode))}
            >
              {/* <MdOutlineEngineering size={20} /> */}
              <div>
                <div className="flex items-center font-bold text-gray-900 dark:text-gray-100">
                  <span className="flex gap-2 items-center w-full">
                    <span>Инженерный режим</span>
                  </span>
                  <div>
                    <SwitcherComponent value={engineerMode} />
                  </div>
                </div>
              </div>
            </div>
          </Dropdown.Item>
        ) : null}

        <Dropdown.Item variant="divider" />
        {/* <Dropdown.Item variant="default">
            <div className="py-4"><ModeSwitcher /></div>
        </Dropdown.Item> */}
        <Dropdown.Item
          eventKey="Sign Out"
          className={`gap-2 ${
            !isDark ? "user_dropdown_map_light " : "user_dropdown_map_dark"
          }`}
          style={{ height: "20px" }}
          onClick={signOut}
        >
          {/* <span className="text-xl opacity-50">
            <HiOutlineLogout />
          </span> */}
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {t("global.signOut")}
          </span>
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
};

const UserMapDropdown = withHeaderItem(_UserMapDropdown);

export default UserMapDropdown;
