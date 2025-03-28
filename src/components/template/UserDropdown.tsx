import Avatar from "@/components/ui/Avatar";
import Dropdown from "@/components/ui/Dropdown";
import withHeaderItem from "@/utils/hoc/withHeaderItem";
import useAuth from "@/utils/hooks/useAuth";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { HiOutlineLogout, HiOutlineUser } from "react-icons/hi";
import type { CommonProps } from "@/@types/common";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store";
import routePrefix from "@/configs/routes.config/routePrefix";
import { Profile } from "@/assets/svg";
import Progress from "@/components/ui/Progress";
import CustomProgressInfo from "../shared/CustomProgressInfo";
import displayStep from "@/utils/displayProgressStep";
import { useEffect, useState } from "react";
import useElementWidthStatic from "@/utils/hooks/useElementWidthStatic";
import { Loading } from "@/components/shared";
import Spinner from "@/components/ui/Spinner";
import { ImSpinner9 } from "react-icons/im";

type DropdownList = {
  label: string;
  path: string;
  icon: JSX.Element;
};

const dropdownItemList: DropdownList[] = [];

const _UserDropdown = ({ className }: CommonProps) => {
  const { ref, width } = useElementWidthStatic();
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);

  const myCountInitial = useAppSelector(
    (state) => state?.auth?.rating?.initialRating?.count,
  );
  const myCountUpdated = useAppSelector(
    (state) => state.entities.weeklyCount.count,
  );
  const isLoading = useAppSelector((state) => state?.auth?.rating?.isLoading);
  const [actualCount, setActualCount] = useState<number>(0);

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

  const UserAvatar = (
    <div className={classNames(className, "flex flex-col items-start gap-2")}>
      <div className="flex items-center gap-2">
        <Avatar size={32} shape="circle" icon={<HiOutlineUser />} />
        <div className="hidden md:block">
          <div className="text-xs capitalize">{user.role?.name}</div>
          <div ref={ref} className="font-bold whitespace-nowrap">
            {user.first_name} {user.last_name}
          </div>
        </div>
      </div>

      <div
        style={{
          width: `${width + 20}px`,
        }}
        className="absolute bottom-[4px] left-[52px] flex"
      >
        {isLoading ? (
          <div className="w-[15px] absolute bottom-[-8px]">
            <Spinner isSpining={true} size={15} indicator={ImSpinner9} />
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
  );

  return (
    <div>
      <Dropdown
        menuStyle={{ minWidth: 240, top: "58px" }}
        renderTitle={UserAvatar}
        placement="bottom-end"
      >
        <Dropdown.Item variant="header">
          <div className="py-2 px-3 flex items-center gap-2">
            <Avatar shape="circle" icon={<HiOutlineUser />} />
            <div>
              <div className="font-bold text-gray-900 dark:text-gray-100">
                {user.login}
              </div>
              <div className="text-xs"> {user.email}</div>
            </div>
          </div>
        </Dropdown.Item>
        <Dropdown.Item variant="divider" />
        <Dropdown.Item variant="default" style={{ height: "35px" }}>
          <Link className="" to={routePrefix.profile}>
            <div className="flex items-center gap-2 cursor-pointer">
              <Profile />
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
        {dropdownItemList.map((item) => (
          <Dropdown.Item
            key={item.label}
            eventKey={item.label}
            className="mb-1 px-0"
          >
            <Link className="flex h-full w-full px-2" to={item.path}>
              <span className="flex gap-2 items-center w-full">
                <span className="text-xl opacity-50">{item.icon}</span>
                <span>{item.label}</span>
              </span>
            </Link>
          </Dropdown.Item>
        ))}
        {/* <Dropdown.Item variant="divider" /> */}
        <Dropdown.Item eventKey="Sign Out" className="gap-2" onClick={signOut}>
          <span className="text-xl opacity-50">
            <HiOutlineLogout />
          </span>
          <span>{t("global.signOut")}</span>
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
};

const UserDropdown = withHeaderItem(_UserDropdown);

export default UserDropdown;
