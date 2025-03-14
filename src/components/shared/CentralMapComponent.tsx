import { useEffect, useState } from "react";
import { TypeTabMap } from "@/@types/tabs";
import Tabs from "@/components/ui/Tabs";
import { useTranslation } from "react-i18next";
import Input from "@/components/ui/Input";
import { MapComponent } from "@/components/shared/MapComponent";
import Transfers from "@/views/Transfers/Transfers";
import { ScrollBar, Spinner, toast } from "../ui";
import TableCalls from "./TableCalls";
import "../../views/ManagerPage/index.css";
import { useLazyGetMapObjectsQuery } from "@/services/RtkQueryService";
import { ToastType } from "@/@types/toast";
import Notification from "@/components/ui/Notification";
import useDarkMode from "@/utils/hooks/useDarkmode";
import cs from "classnames";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "@/store";

const { TabNav, TabList, TabContent } = Tabs;

const CentralMapComponent = ({
  data,
  loading,
  currentTab,
  setCurrentTab,
  setPhoneVal,
  phoneVal,
  setMessage,
  message,
}: MapProps) => {
  const [isDark] = useDarkMode();
  const { t } = useTranslation();
  const [loadingCheck, setLoadingCheck] = useState<boolean>(false);
  const [queryParams, _] = useSearchParams();
  const callBegin = useAppSelector((state) => state.uis?.uisEvent);

  useEffect(() => {
    setMessage && phoneVal.length < 11 && setMessage("");
  }, [currentTab, queryParams, phoneVal]);

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  return (
    <ScrollBar
      autoHide
      direction="ltr"
      style={{ width: "100%", height: "100%" }}
    >
      <div
        style={{
          zIndex: 2,
          width: "100%",
          height: "100%",
        }}
      >
        <Tabs
          variant="pill"
          style={{ position: "relative" }}
          value={currentTab}
          onChange={(val) => setCurrentTab && setCurrentTab(val)}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              position: currentTab === TypeTabMap.MAP ? "absolute" : "relative",
              zIndex: 3,
              left: "50%",
              transform: "translate(-50%)",
              width: "100%",
            }}
          >
            <TabList
              style={{
                justifyContent: "center",
                alignItems: "start",
                border: "none",
                padding: "10px",
                color: "#333333",
                width: "100%",
                maxWidth: "1000px",
              }}
            >
              {currentTab === TypeTabMap.MAP && (
                <div
                  id="inject-input_ym"
                  className={cs({
                    "dark-mode": isDark === true,
                    "light-mode": isDark === false,
                  })}
                ></div>
              )}
              {currentTab !== TypeTabMap.MAP && <div id="empty_div"></div>}
              <div
                className="flex ml-2 mr-2 justify-between"
                style={{
                  background:
                    currentTab === TypeTabMap.MAP
                      ? "rgba(255,255,255, 0.9)"
                      : "none",
                  borderRadius: "7px",
                }}
              >
                <TabNav
                  style={{
                    background:
                      currentTab === TypeTabMap.MAP ? "#eef2ff" : "none",
                    color:
                      currentTab === TypeTabMap.MAP ? "#4f46e5" : "#6b7280",
                  }}
                  value={TypeTabMap.MAP}
                >
                  {t("tabsText.map")}
                </TabNav>
                {/* <TabNav
                  style={{
                    background:
                      currentTab === TypeTabMap.TRANSFERS ? "#eef2ff" : "none",
                    color:
                      currentTab === TypeTabMap.TRANSFERS
                        ? "#4f46e5"
                        : "#6b7280",
                  }}
                  value={TypeTabMap.TRANSFERS}
                >
                  {t("tabsText.transfers")}
                </TabNav> */}
              </div>
              <div style={{ width: "100%" }}>
                {currentTab === TypeTabMap.MAP && (
                  <Input
                    disabled={callBegin === "STARTING_A_CONVERSATION"}
                    size="sm"
                    value={phoneVal}
                    className={`text-black ${
                      callBegin === "STARTING_A_CONVERSATION" &&
                      "cursor-not-allowed"
                    }`}
                    style={{
                      background:
                        callBegin === "STARTING_A_CONVERSATION"
                          ? "#cdd2dc"
                          : "#ffff",
                    }}
                    type="text"
                    onChange={(e) => setPhoneVal(e.target.value)}
                    placeholder="Проверка номера телефона"
                  />
                )}
                {message && !loadingCheck && currentTab === TypeTabMap.MAP && (
                  <p
                    style={{
                      display: "inline-block",
                      marginTop: "5px",
                      color: "white",
                      background:
                        message === "Успешно"
                          ? "rgb(10, 136, 10)"
                          : "rgb(228, 106, 118)",
                      boxShadow:
                        message === "Успешно"
                          ? "rgb(10, 136, 10) 0px 0px 2px 2px"
                          : "rgb(228, 106, 118) 0px 0px 2px 2px",
                      fontSize: "10px",
                      fontWeight: 900,
                    }}
                  >
                    {message}
                  </p>
                )}
              </div>
            </TabList>
          </div>
          <TabContent value={TypeTabMap.MAP}>
            <MapComponent
              setPhoneVal={setPhoneVal}
              phoneVal={phoneVal}
              data={data}
              loading={loading}
            />
          </TabContent>
          {/* <div className="py-4 px-4" style={{ width: "100%" }}>
            <TabContent value={TypeTabMap.TRANSFERS}>
              <div style={{ marginTop: "10px" }}>
                <div className="mt-8">
                  <Transfers />
                </div>
              </div>
            </TabContent>
          </div> */}
        </Tabs>
      </div>
    </ScrollBar>
  );
};

export default CentralMapComponent;
