import {
  useLazyGetMapObjectByIdQuery,
  useLazyGetMapObjectsQuery,
  useUisCallTransferMutation,
  useUisEndCallMutation,
  useUisUnHoldCallMutation,
} from "@/services/RtkQueryService";
import Spinner from "@/components/ui/Spinner";
import LeftSideBarMap from "@/components/shared/LeftSideBarMap";
import { RightSideBarMap } from "@/components/shared/RightSideBarMap";
import "./index.css";
import { useEffect, useState, useRef, useCallback } from "react";
import CentralMapComponent from "@/components/shared/CentralMapComponent";
import { useAppDispatch, useAppSelector, setPoints } from "@/store";
import { TypeTabMap } from "@/@types/tabs";
import { HiMiniChevronDoubleLeft } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";
import { toast, Button } from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { ToastType } from "@/@types/toast";
import { useTranslation } from "react-i18next";
import useStorage from "@/utils/hooks/useStorage";
import transformMultipleOptionsToList from "@/utils/transformMultipleOptionsToList";
import { TIMER_DISABLED } from "@/constants/map.constant";
import UserMapDropdown from "@/components/shared/UserMapDropdown";
import {
  setEntityMarkers,
  setFiltersMap,
} from "@/store/slices/entities/markersSlice";
import groupDataByMaxPrice from "@/utils/groupDataByMaxPrice";
import BtnsPriority from "@/components/shared/BtnsPriority";

const ManagerPage = () => {
  const { t } = useTranslation();
  const [queryParams, setQueryParams] = useSearchParams();
  const fetchLoading = useRef(false);
  const prevQueryParams = useRef<{ [key: string]: any }>({});
  const defaultCity = useStorage().getItem("defaultCity");
  const cityId = queryParams.get("city");
  const [currentTab, setCurrentTab] = useState<string>(TypeTabMap.MAP);
  const [sideBarsControl, setSideBarsControl] = useState<{
    [key: string]: boolean;
  }>({
    left: true,
    right: true,
  });
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const dispatch = useAppDispatch();
  const dataRedux = useAppSelector((state) => state?.entities.markers.data);
  const clientNumber = useAppSelector(
    (state) => state?.uis?.uisInfo?.contact_info?.contact_phone_number,
  );
  const callBegin = useAppSelector((state) => state.uis?.uisEvent);

  useEffect(() => {
    if (currentTab === TypeTabMap.TRANSFERS) {
      setSideBarsControl({
        left: false,
        right: false,
      });
    } else if (currentTab === TypeTabMap.MAP) {
      setSideBarsControl({
        left: true,
        right: true,
      });
    }
  }, [currentTab]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        callBegin === "STARTING_A_CONVERSATION" &&
        clientNumber?.length > 10
      ) {
        setPhone(clientNumber);
      }
    }, TIMER_DISABLED);
    return () => clearTimeout(timeoutId);
  }, [clientNumber, queryParams, callBegin]);

  //==========Objects================
  const [getMapObjects, { data, isLoading, isFetching }] =
    useLazyGetMapObjectsQuery();

  const [filtered, setFiltered] = useState<any>(null);

  const [
    getDataById,
    { data: dataById, isLoading: isLoadingById, isFetching: isFetchingById },
  ] = useLazyGetMapObjectByIdQuery();
  //============UIS==================
  const [unHoldCall] = useUisUnHoldCallMutation();
  const [endCall] = useUisEndCallMutation();
  const [transferCall] = useUisCallTransferMutation();

  useEffect(() => {
    if (!queryParams.get("city")) {
      setQueryParams({ ["city"]: `${defaultCity}` });
    }
  }, []);

  useEffect(() => {
    dispatch(setEntityMarkers(data));
    setFiltered(data);
    dispatch(setPoints(data?.data));
  }, [data]);

  useEffect(() => {
    const allParams = Object.fromEntries(queryParams);
    dispatch(setFiltersMap(allParams));
    let newParams: { [key: string]: string } = {};
    for (const [param, value] of queryParams.entries()) {
      if (value && value !== "false") {
        newParams[param] = value;
      }
    }

    let type: "all" | "marker" | "map" = "all";
    if (dataRedux) {
      if (!queryParams.get("pointId")) {
        type = "map";
      } else if (
        prevQueryParams.current.pointId !== queryParams.get("pointId")
      ) {
        type = "marker";
      }
    } else {
      !queryParams.get("pointId") ? (type = "map") : (type = "all");
    }
    !fetchLoading.current && fetchData(newParams, type);
  }, [queryParams]);

  useEffect(() => {
    const allParams = Object.fromEntries(queryParams);
    cityId &&
      phone.length > 10 &&
      fetchData({ city: cityId, phone, ...allParams }, "map");
  }, [phone]);

  const fetchData = useCallback(
    (params: { [key: string]: string }, type: "all" | "marker" | "map") => {
      try {
        const transformedParams: { [key: string]: any } = {};
        for (const [key, value] of Object.entries(params)) {
          if (params.hasOwnProperty(key)) {
            if (key === "pointId") {
              continue;
            } else if (phone.length > 10 && key === "city") {
              transformedParams["phone"] = phone;
              transformedParams["city"] = cityId;
              continue;
            } else if (key === "tags" || key === "payment_methods") {
              continue;
            } else if (
              key === "client_is_out_of_town" ||
              key === "not_looking_for_himself"
            ) {
              if (params[key] === "true") {
                transformedParams[key] = 1;
              }
            } else if (key === "is_active") {
              if (params[key] === "true") {
                transformedParams[key] = "off";
              }
            } else if (key === "price") {
              const [min, max] = params[key].split("-");
              transformedParams[key] = {
                min: min ? Number(min) * 1000000 : null,
                max: max ? Number(max) * 1000000 : null,
              };
            } else if (key === "city" || key === "deadline") {
              transformedParams[key] = params[key];
            } else {
              if (value === "all") continue;
              else {
                const values = params[key].split(",");
                transformedParams[key] = [];
                values.forEach((value: any) => {
                  transformedParams[key].push(value);
                });
              }
            }
          }
        }

        fetchLoading.current = true;
        switch (type) {
          case "all":
            Promise.all([
              cityId && getMapObjects(transformedParams),
              getDataById({
                id: params.pointId,
                params: transformedParams,
              } as any),
            ]).then(() => {
              fetchLoading.current = false;
              prevQueryParams.current = params;
            });
            break;
          case "map":
            cityId &&
              getMapObjects({
                ...transformedParams,
                ...(phone.length > 10 && { phone }),
              }).then((res) => {
                if (!phone) {
                  setMessage("");
                }
                if (phone) {
                  setMessage(res?.data?.message as string);
                }
                fetchLoading.current = false;
                prevQueryParams.current = params;
              });

            break;
          case "marker":
            getDataById({
              id: params.pointId,
              params: transformedParams,
            } as any).then(() => {
              fetchLoading.current = false;
              prevQueryParams.current = params;
            });
            break;
          default:
            break;
        }
      } catch (error: any) {
        openNotification(ToastType.WARNING, error.message);
      } finally {
        fetchLoading.current = false;
      }
    },
    [cityId, phone, fetchLoading, prevQueryParams, getMapObjects, getDataById],
  );

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  useEffect(() => {
    const allParams = Object.fromEntries(queryParams);
    const tagsArray =
      allParams.tags && allParams.tags !== "all"
        ? allParams.tags.split(",")
        : [];
    const paymentMethodsArray =
      allParams.payment_methods && allParams.payment_methods !== "all"
        ? allParams.payment_methods.split(",")
        : [];
    if (tagsArray.length > 0 || paymentMethodsArray.length > 0) {
      const filteredData = dataRedux?.data?.filter((item: any) => {
        if (tagsArray.length > 0 && paymentMethodsArray.length > 0) {
          return (
            tagsArray.some((tag) => item.tags.includes(tag)) &&
            paymentMethodsArray.some((payment) =>
              item.payment_methods.includes(payment),
            )
          );
        } else if (tagsArray.length > 0) {
          return tagsArray.some((tag) => item.tags.includes(tag));
        } else if (paymentMethodsArray.length > 0) {
          return paymentMethodsArray.some((payment) =>
            Object.values(item.payment_methods).includes(payment),
          );
        }

        return false;
      });

      setFiltered({
        data: filteredData,
        city: dataRedux?.city,
      });
    } else {
      setFiltered(dataRedux);
    }
  }, [queryParams, dataRedux]);

  const resetBeforeCityChange = () => {
    for (let [key, val] of queryParams) {
      setQueryParams((prev) => {
        if (key !== "city") {
          prev.delete(key);
        }
        return prev;
      });
    }
  };

  const handleFiltersChange = (key: string, value: any) => {
    setQueryParams((prev) => {
      prev.delete("pointId");
      if (key === "city") {
        if (value != null) {
          resetBeforeCityChange();
          prev.set("city", value);
          return prev;
        } else {
          return new URLSearchParams({ city: value });
        }
      } else if (key === "deadline") {
        if (value === queryParams.get("deadline") || value === null) {
          prev.delete("deadline");
        } else {
          prev.set("deadline", value);
        }
      } else if (key === "payment_methods" || key === "developers") {
        if (value === null || value === "" || value === false) {
          prev.delete(key);
        } else {
          prev.set(key, transformMultipleOptionsToList(value).join(","));
        }
      }
      // else if (key === "pointId") {
      //   if (value === queryParams.get("pointId")) {
      //     prev.delete("pointId");
      //   } else {
      //     prev.set("pointId", value);
      //   }
      // }
      else {
        if (value === null || value === "" || value === false) {
          prev.delete(key);
        } else {
          prev.set(key, value);
        }
      }
      return prev;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        className="flex justify-center items-center"
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          width: "30px",
          left: sideBarsControl.left ? "345px" : "1%",
          top: "8%",
          zIndex: 3,
        }}
      >
        <HiMiniChevronDoubleLeft
          style={{
            height: "30px",
            width: "100%",
            borderRadius: "50%",
            background: "#ffff",
            border: "1px solid #9ca3af",
            transform: sideBarsControl.left ? "" : "rotate(180deg)",
          }}
          size={25}
          className="cursor-pointer"
          onClick={() =>
            setSideBarsControl((prev: any) => ({
              ...prev,
              left: !prev.left,
            }))
          }
        />
        <BtnsPriority
          groups={groupDataByMaxPrice(dataRedux?.data)}
          handleFiltersChange={handleFiltersChange}
        />
      </div>
      <LeftSideBarMap
        count={dataRedux?.data?.length}
        isVisible={sideBarsControl.left}
        handleFiltersChange={handleFiltersChange}
        loading={/* isLoading &&  */ isFetching}
      />
      <div
        style={{
          top: "50%",
          left: "50%",
          zIndex: "1",
          position: "absolute",
          transform: "translate(-50%, -50%)",
        }}
      >
        {isFetching && <Spinner size={80} />}
      </div>
      {
        <CentralMapComponent
          message={message}
          setMessage={setMessage}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          data={filtered}
          loading={isFetching}
          setPhoneVal={setPhone}
          phoneVal={phone}
          getMapObjects={getMapObjects}
        />
      }
      <div
        className="flex justify-center items-center"
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          width: "30px",
          right: sideBarsControl.right ? "29%" : "1%",
          top: "8%",
          zIndex: 3,
        }}
      >
        <HiMiniChevronDoubleLeft
          style={{
            height: "30px",
            width: "100%",
            borderRadius: "50%",
            background: "#ffff",
            border: "1px solid #9ca3af",
            transform: sideBarsControl.right ? "rotate(180deg)" : "",
          }}
          className="cursor-pointer"
          onClick={() =>
            setSideBarsControl((prev: any) => ({
              ...prev,
              right: !prev.right,
            }))
          }
        />
        <UserMapDropdown hoverable={false} />
      </div>
      <RightSideBarMap
        unHoldCall={unHoldCall}
        endCall={endCall}
        transferCall={transferCall}
        loading={isFetchingById}
        data={dataById}
        isVisible={sideBarsControl.right}
        setPhone={setPhone}
      />
    </div>
  );
};
export default ManagerPage;
