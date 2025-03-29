import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Carousel from "./Carousel";
import TabRightSide from "./TabRightSide";
import {
  useCreateTransferMutation,
  useUpdateTransferMutation,
} from "@/services/RtkQueryService";
import Loading from "./Loading";
import { TbBriefcaseOff } from "react-icons/tb";
import { FaRegBuilding, FaExternalLinkAlt } from "react-icons/fa";
import { BsPersonWalking, BsCarFrontFill } from "react-icons/bs";
import { GiWallet } from "react-icons/gi";
import { Tooltip } from "@/components/ui/Tooltip";
import { useTranslation } from "react-i18next";
import "../../views/ManagerPage/index.css";
import { separateNumbers } from "@/utils/separateNumbers";
import { ScrollBar, toast } from "../ui";
import { TableObjectsMap } from "./TableObjectsMap";
import { TypeRightSideTab, TypeTabMap } from "@/@types/tabs";
import useDarkMode from "@/utils/hooks/useDarkmode";
import { setActiveTransfer } from "@/store/slices/uis";
import { DURATION_ANIMATION, TIMER_DISABLED } from "@/constants/map.constant";
import { clearDisabledOffer } from "@/store/slices/entities";
import { ToastType } from "@/@types/toast";
import Notification from "@/components/ui/Notification";

export const RightSideBarMap = ({
  data,
  loading,
  isVisible,
  unHoldCall,
  endCall,
  transferCall,
  setPhone,
}: any) => {
  const dispatch = useAppDispatch();
  const reasEstateBuildingInfo = data?.data;
  const { t } = useTranslation();
  const [isDark] = useDarkMode();
  const [queryParams, setQueryParams] = useSearchParams();
  const [messDisableOffer, setMesDisableOffer] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>(
    TypeRightSideTab.PRESENTATION,
  );
  const [disabled, setDisabled] = useState<boolean>(true);
  const [checkedObject, setCheckedObject] = useState<{
    [key: string]: boolean;
  }>({});
  const [inputValue, setInputValue] = useState<{
    name: string;
    payment: string;
  }>({ name: "", payment: "" });
  const [clientInformation, setClientInformation] = useState<any>({
    PRESENTATION: { questions: {} },
    QUESTION: { questions: {} },
    TRANSFER: { questions: {} },
    object: {},
  });
  const [infoScript, setInfoScript] = useState<any>(null);
  const [isAnimation, setIsAnimation] = useState<boolean>(false);

  const engineerMode = useAppSelector((state) => state.map.engineerMode);
  const activeTransfer = useAppSelector((state) => state.uis?.active_transfer);
  const callBegin = useAppSelector((state) => state.uis?.uisEvent);
  const disabledOfferId = useAppSelector(
    (state) => state.entities.markers.disabledOffer,
  );
  const id = queryParams.get("pointId");
  // const point = useAppSelector((state) => state.map.points)?.find(
  //   (el: any) => el.id === id,
  // );

  useEffect(() => {
    let timeOut = null;
    if (callBegin === "STARTING_A_CONVERSATION") {
      timeOut = setTimeout(() => {
        setDisabled(false);
      }, TIMER_DISABLED);
    } else {
      if (isAnimation) {
        setTimeout(() => {
          setDisabled(true);
        }, DURATION_ANIMATION);
      }
      if (!isAnimation) {
        setDisabled(true);
      }
    }

    return () => {
      if (timeOut) {
        clearTimeout(timeOut);
      }
    };
  }, [callBegin]);

  useEffect(() => {
    if (disabledOfferId === id && disabledOfferId !== null) {
      setQueryParams((prev) => {
        prev.delete("pointId");
        return prev;
      });
      dispatch(clearDisabledOffer(null));
      setMesDisableOffer(true);
    } else {
      setTimeout(() => {
        setMesDisableOffer(false);
      }, 5000);
    }
  }, [disabledOfferId]);

  useEffect(() => {
    if (messDisableOffer) {
      openNotification(
        ToastType.WARNING,
        "ЖК отключен, выберите другой вариант",
        5000,
      );
    }
  }, [messDisableOffer]);

  useEffect(() => {
    setInfoScript(null);
    setInputValue({ name: "", payment: "" });
    setCurrentTab(TypeRightSideTab.PRESENTATION);
  }, [queryParams]);

  const refTransferId = useRef(null);
  const [createTransfer, { isLoading: createTransferLoading, isError }] =
    useCreateTransferMutation();
  const [updateTransfer, { isLoading: updateLoading }] =
    useUpdateTransferMutation();

  const collectStatFransfer = async (data: any, type: string) => {
    try {
      if (
        type === "create" &&
        !createTransferLoading &&
        activeTransfer === null
      ) {
        createTransfer({
          transfer_entity: reasEstateBuildingInfo,
          ...data,
        } as any).then((res: any) => {
          dispatch(setActiveTransfer(res?.data?.data));
          refTransferId.current = res?.data?.data?.id || null;
        });
      }
      if (type === "update" && refTransferId.current) {
        updateTransfer({
          id: refTransferId.current,
          transfer_entity: reasEstateBuildingInfo,
          ...data,
        } as any).then((res) => {});
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const maxOffer: Offers =
    Array.isArray(data?.data.offers) &&
    data?.data.offers.reduce((maxElement: any, currentElement: any) => {
      if (
        currentElement.is_active &&
        (maxElement === null || currentElement.priority < maxElement.priority)
      ) {
        return currentElement;
      }
      return maxElement;
    }, null);

  const openNotification = (
    type: ToastType,
    text: string,
    duration: number,
  ) => {
    toast.push(
      <Notification
        duration={duration}
        title={t(`toast.title.${type}`)}
        type={type}
      >
        {text}
      </Notification>,
    );
  };

  return (
    <div
      className="text-center py-2 px-2"
      style={{
        width: "100%",
        maxWidth: "28%",
        background: isDark ? "#101827" : "none",
        display: isVisible ? "block" : "none",
      }}
    >
      {!id ? (
        <>
          <h6>Для отображения информации кликните по маркеру на карте</h6>
          <h6>Если маркеров нет, настройте фильтры</h6>
        </>
      ) : (
        <Loading type="default" loading={/* fetchLoading.current */ loading}>
          <ScrollBar
            autoHide
            direction="ltr"
            style={{
              width: "100%",
              // background: "#101827",
              height: "100%",
              marginBottom: "10px",
            }}
          >
            <div
              className="container_main"
              style={{
                display: isVisible ? "block" : "none",
              }}
            >
              <div
                className="flex justify-between items-center mb-2"
                style={{ width: "100%" }}
              >
                <Tooltip title={t(`tooltip.map.developer`)}>
                  <div className="flex items-center">
                    <FaRegBuilding size={15} />
                    <p className="ml-1 mr-1" style={{ fontSize: "14px" }}>
                      {maxOffer?.developer?.name}
                    </p>
                  </div>
                </Tooltip>
                <Tooltip title={t(`tooltip.map.uniqueness_period`)}>
                  <div className="flex items-center">
                    <TbBriefcaseOff size={15} />
                    <p className="ml-1 mr-1" style={{ fontSize: "14px" }}>
                      {maxOffer?.uniqueness_period}
                    </p>{" "}
                    дней
                  </div>
                </Tooltip>
                <Tooltip title={t(`tooltip.map.operator_award`)}>
                  <div className="flex items-center">
                    <GiWallet size={15} />
                    <p className="ml-1 mr-1" style={{ fontSize: "14px" }}>
                      {separateNumbers(maxOffer?.operator_award)}
                    </p>{" "}
                    ₽
                  </div>
                </Tooltip>
              </div>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.45)",
                    position: "absolute",
                    top: 0,
                    zIndex: 2,
                    padding: "0.25rem",
                    width: "100%",
                  }}
                >
                  <div
                    className={`flex items-center justify-between ${
                      data?.data?.tags?.length > 0 && "border-b"
                    }`}
                  >
                    <h6
                      className="text-start flex"
                      style={{ fontSize: "14px" }}
                    >
                      <p
                        style={{
                          fontWeight: "700",
                          marginRight: "5px",
                          color: "#ffff",
                        }}
                      >
                        Жилой комплекс:
                      </p>
                      <p
                        style={{
                          fontWeight: "400",
                          color: "#ffff",
                        }}
                      >
                        {data?.data?.name}
                      </p>
                    </h6>
                    <a
                      className="cursor-pointer"
                      href={`${data?.data?.site}`}
                      target="blank"
                    >
                      <FaExternalLinkAlt size={14} color="#f3f4f6" />
                    </a>
                  </div>
                  <h6
                    style={{
                      fontSize: "14px",
                      lineHeight: "10px",
                      flexWrap: "wrap",
                      fontWeight: "400",
                    }}
                    className={`${data?.data?.tags?.length > 0 && "mt-1"} flex`}
                  >
                    {data?.data?.tags?.map(
                      (tag: any, index: number, array: any) => {
                        return (
                          <p
                            className="text-start mr-1 mb-1"
                            style={{
                              whiteSpace: "nowrap",
                              color: "#ffff",
                            }}
                            key={tag.id}
                          >
                            {tag.name}
                            {index !== array.length - 1 && ","}
                          </p>
                        );
                      },
                    )}
                  </h6>
                </div>
                {data && data?.data?.metro_stations?.length > 0 ? (
                  <div
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.45)",
                      position: "absolute",
                      bottom: 0,
                      zIndex: 2,
                      padding: "0.25rem",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{ flexWrap: "wrap" }}
                      className="mt-1 mb-1 flex"
                    >
                      {data?.data?.metro_stations.map((station: any) => {
                        return (
                          <div className="whitespace-nowrap flex mr-2">
                            <Tooltip
                              title={`${station?.line?.name}`}
                              key={station.id}
                            >
                              <h6
                                className="flex items-center cursor-pointer mt-1"
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "400",
                                  lineHeight: "10px",
                                }}
                              >
                                <div
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    background: `${station?.line?.color}`,
                                    marginRight: "2px",
                                  }}
                                ></div>
                                <div
                                  className="text-start mr-1 flex"
                                  style={{ color: "#ffff" }}
                                >
                                  <p>{station.name}</p>
                                </div>
                              </h6>
                            </Tooltip>
                            {station?.time_on_car && (
                              <Tooltip title={"На машине до станции"}>
                                <div className="flex items-center mt-1 mr-1 cursor-pointer">
                                  <BsCarFrontFill
                                    size={14}
                                    color={isDark ? "none" : "white"}
                                  />
                                  <p
                                    className={`text-sm ml-1 ${
                                      isDark ? "" : "text-white"
                                    }`}
                                  >
                                    {station?.time_on_car}
                                  </p>
                                </div>
                              </Tooltip>
                            )}
                            {station?.time_on_foot && (
                              <Tooltip title={"Пешком до станции"}>
                                <div className="flex items-center mt-1 cursor-pointer">
                                  <BsPersonWalking
                                    size={14}
                                    color={isDark ? "none" : "white"}
                                  />
                                  <p
                                    className={`text-sm ${
                                      isDark ? "" : "text-white"
                                    }`}
                                  >
                                    {station?.time_on_foot}
                                  </p>
                                </div>
                              </Tooltip>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <Carousel images={data?.data.images} />
              </div>
              <div
                id="wrap"
                className={`${
                  disabled && !engineerMode && "cursor-not-allowed"
                }`}
              >
                <div
                  id="inner"
                  className={`${
                    disabled && !engineerMode && "disabled_question"
                  }`}
                >
                  <TabRightSide
                    setIsAnimation={setIsAnimation}
                    isAnimation={isAnimation}
                    disabled={disabled}
                    setPhone={setPhone}
                    unHoldCall={unHoldCall}
                    endCall={endCall}
                    transferCall={transferCall}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    setCurrentTab={setCurrentTab}
                    currentTab={currentTab}
                    collectStatFransfer={collectStatFransfer}
                    createTransferLoading={createTransferLoading}
                    setClientInformation={setClientInformation}
                    clientInformation={clientInformation}
                    infoScript={infoScript}
                    setInfoScript={setInfoScript}
                    offers={maxOffer}
                    object={
                      Object.values(checkedObject).some(
                        (value) => value === true,
                      )
                        ? data?.data.objects.find((item: any) => {
                            return Object.keys(checkedObject).includes(item.id);
                          })
                        : {}
                    }
                    setChecked={setCheckedObject}
                    real_estate_building={data?.data.name}
                    location={data?.data?.location}
                    description={data?.data?.description}
                    payment={data?.data.payment_methods}
                  />
                  <TableObjectsMap
                    setChecked={setCheckedObject}
                    checked={checkedObject}
                    currentTab={currentTab}
                    setClientInformation={setClientInformation}
                    data={data?.data.objects}
                    setInfoScript={setInfoScript}
                  />
                </div>
              </div>
            </div>
          </ScrollBar>
        </Loading>
      )}
    </div>
  );
};
