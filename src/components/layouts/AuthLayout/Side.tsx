import { cloneElement } from "react";
import Avatar from "@/components/ui/Avatar";
import Logo from "@/components/template/Logo";
import { APP_NAME } from "@/constants/app.constant";
import type { CommonProps } from "@/@types/common";
import { useTranslation } from "react-i18next";

interface SideProps extends CommonProps {
  content?: React.ReactNode;
}

const Side = ({ children, content, ...rest }: SideProps) => {
  const { t } = useTranslation();
  return (
    <div className="grid lg:grid-cols-3 h-full">
      <div
        className="bg-no-repeat bg-cover py-6 px-16 flex-col justify-between hidden lg:flex"
        style={{
          backgroundImage: `url('/img/others/auth-side-bg.jpg')`,
        }}
      >
        <Logo mode="dark" style={{ maxWidth: "30%" }} />
        <div>
          <p className="text-lg text-white opacity-80">
            {t("authPage.side.info")}
          </p>
        </div>
        <span className="text-white">
          {t("authPage.side.copyright")}
          {/* Copyright &copy; 2022{" "} */}
          {/* <span className="font-semibold">{`${APP_NAME}`}</span>{" "} */}
        </span>
      </div>
      <div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
        <div className="xl:min-w-[450px] px-8">
          <div className="mb-8">{content}</div>
          {children
            ? cloneElement(children as React.ReactElement, {
                ...rest,
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default Side;
