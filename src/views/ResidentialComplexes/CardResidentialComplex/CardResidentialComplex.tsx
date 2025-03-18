import Card from "@/components/ui/Card";
import { useNavigate, useParams } from "react-router-dom";
import {
  useLazyGetRealEstateBuildingByIdQuery,
  useR_E_BuildingBindMetroStationsMutation,
  useR_E_BuildingBindMetroStationsUpdateMutation,
  useR_E_BuildingBindPaymentMethodsMutation,
  useR_E_BuildingBindTagsMutation,
  useR_E_BuildingUnBindMetroStationsMutation,
  useR_E_BuildingUnBindPaymentMethodsMutation,
  useR_E_BuildingUnBindTagsMutation,
  useSoftDeleteMetroStationByIdMutation,
  useSoftDeleteOfferByIdMutation,
  useSoftDeletePaymentMethodByIdMutation,
  useSoftDeleteRealEstateBuildingByIdMutation,
  useSoftDeleteRealEstateObjectByIdMutation,
  useUpdateMetroStationByIdMutation,
  useUpdateOfferByIdMutation,
  useUpdateRealEstateBuildingByIdMutation,
  useUpdateRealEstateObjectByIdMutation,
} from "@/services/RtkQueryService";
import { ActionLink, Loading } from "@/components/shared";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FormResidentialComplex from "@/views/ResidentialComplexes/FormResidentialComplex";
import { ToastType } from "@/@types/toast";
import {
  Button,
  Dialog,
  Input,
  Switcher,
  Tooltip,
  toast,
} from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { FormEssence } from "@/@types/form";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";
import CustomerInfoField from "@/components/ui/CustomerInfoField";
import {
  BuildingObject,
  MetroStation,
  Offer,
  PaymentMethod,
  RealEstateBuilding,
  TableTextConst,
  Tag,
} from "@/@types";
import { debounce, omit } from "lodash";
import { TypeTabTableResidentialComplex } from "@/@types/tabs";
import Tabs from "../../../components/ui/Tabs";
import TabTableResidentialComplex from "@/views/ResidentialComplexes/TabTableResidentialComplex";
import { ColumnDef } from "@tanstack/react-table";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import TableWorkHoursBindOffer from "@/components/shared/TableWorkHoursBindOffer";
import methodInsert from "@/utils/methodInsertBread";
import { IoArrowUndo } from "react-icons/io5";
import { UpdateMetroStationResponse } from "@/@types/requestRtk";
import { useAppDispatch, useAppSelector } from "@/store";
import thousandSeparatorValue from "@/utils/thousandSeparator";
import { FaCheck } from "react-icons/fa";
import { setDrawerState } from "@/store/slices/actionState";

const { TabNav, TabList, TabContent } = Tabs;

const maxLength = 40;

const { METRO_STATIONS, PAYMENT_METHODS, TAGS, OBJECTS, OFFERS } =
  TypeTabTableResidentialComplex;

const SwitcherComponent = ({ value, onClick }: any) => {
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions
  );
  const updateKeyOffer = `api.v1.crm.${TableTextConst.OFFER}.update`;

  const onSwitcherToggle = () => {
    onClick(!value);
  };

  return (
    <div>
      <Switcher
        disabled={!permissions[updateKeyOffer]}
        checked={value}
        color="green-500"
        onChange={onSwitcherToggle}
      />
    </div>
  );
};

const CardResidentialComplex = ({ item }: any) => {
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions
  );

  // const updateKey = `api.v1.crm.${TableTextConst.REALESTATEBUILDING}.update`;
  // const deleteSoftKey = `api.v1.crm.${TableTextConst.REALESTATEBUILDING}.delete_soft`;

  // const viewKeyPaymentMethod = `api.v1.crm.${TableTextConst.PAYMENT_METHOD}.view`;
  // const viewKeyMetroStastion = `api.v1.crm.${TableTextConst.METRO_STATION}.view`;
  // const viewKeyTag = `api.v1.crm.${TableTextConst.TAG}.view`;
  // const viewKeyObject = `api.v1.crm.${TableTextConst.REAL_ESTATE_OBJECT}.view`;
  // const viewKeyOffer = `api.v1.crm.${TableTextConst.OFFER}.view`;

  // const viewKeyScript = `api.v1.crm.${TableTextConst.SCRIPT}.view`;
  // const viewKeyWorkTime = `api.v1.crm.${TableTextConst.WORK_TIME}.view`;

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isEdit, setIsEdit] = useState(false);
  const [bindMode, setBindMode] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<Record<string, any>>({});
  const [isEditWalk, setIsEditWalk] = useState<Record<string, boolean>>({});
  const inputChangeStation = useRef<{
    [key: string]: { time_on_car: string | null; time_on_foot: string | null };
  }>({});
  const inputChangeObject = useRef<{
    [key: string]: { square: string | null; price: string | null };
  }>({});
  const [isEditDriving, setIsEditDriving] = useState<Record<string, boolean>>(
    {}
  );
  const [isEditSquare, setIsEditSquare] = useState<Record<string, boolean>>({});
  const [isEditPrice, setIsEditPrice] = useState<Record<string, boolean>>({});
  const [paramCache, setParamCache] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState<string>("");
  const [searchMetroStation, setSearchMetroStation] = useState<string>("");

  const fetchLoading = useRef(false);

  const searchParams = new URLSearchParams(location.search);
  const isEditPage = searchParams.get("editPage");
  const isDuplicatePage = searchParams.get("duplicate");

  useEffect(() => {
    setBindMode(false);
    fetchLoading.current = false;
  }, [currentTab]);

  useEffect(() => {
    setSearchMetroStation("");
  }, [bindMode]);

  const openDialog = (rowId: string, type: string) => {
    setIsOpen((prev) => ({
      ...prev,
      [type]: { [rowId]: true },
    }));
  };

  const onDialogClose = (rowId: string, type: string) => {
    setIsOpen((prev) => ({
      ...prev,
      [type]: { [rowId]: false },
    }));
  };

  // const [getData, { data, isLoading, isFetching }] =
  //   useLazyGetRealEstateBuildingByIdQuery();
  // const searchStations = data?.info?.metro_stations?.filter((item: any) =>
  //   item.name.toLowerCase().includes(searchMetroStation.toLowerCase())
  // );

  useEffect(() => {
    // if (permissions[viewKeyPaymentMethod]) {
    //   setCurrentTab(PAYMENT_METHODS);
    // } else if (permissions[viewKeyMetroStastion]) {
    //   setCurrentTab(METRO_STATIONS);
    // } else if (permissions[viewKeyTag]) {
    //   setCurrentTab(TAGS);
    // } else if (permissions[viewKeyObject]) {
    //   setCurrentTab(OBJECTS);
    // } else if (permissions[viewKeyOffer]) {
    //   setCurrentTab(OFFERS);
    // } else {
    //   setCurrentTab("");
    // }
    // getData({ id: id, params: paramCache } as any);
  }, []);

  // ================update======================
  const [UpdateData, { data: updateData, isLoading: loadingUpdate }] =
    useUpdateRealEstateBuildingByIdMutation();
  const [UpdateDataStation, { isLoading: isLoadingUpdateStation }] =
    useUpdateMetroStationByIdMutation();
  const [UpdateDataOffer, { data: offer = null, isLoading: isLoadingUpdate }] =
    useUpdateOfferByIdMutation();
  const [UpdateDataObject] = useUpdateRealEstateObjectByIdMutation();
  // ===============bind=======================
  const [BindPaymentMethod] = useR_E_BuildingBindPaymentMethodsMutation();
  const [BindMetroStation] = useR_E_BuildingBindMetroStationsMutation();
  const [bindTag] = useR_E_BuildingBindTagsMutation();
  const [UpdateBindMetroStation] =
    useR_E_BuildingBindMetroStationsUpdateMutation();
  // =================unbind=======================
  const [unBindPaymentMethod] = useR_E_BuildingUnBindPaymentMethodsMutation();
  const [unBindMetroStation] = useR_E_BuildingUnBindMetroStationsMutation();
  const [unbindTag] = useR_E_BuildingUnBindTagsMutation();
  // ===============delete=======================
  const [SoftDeleteRealEstateBuilding] =
    useSoftDeleteRealEstateBuildingByIdMutation();
  const [SoftDeletePaymentMethod] = useSoftDeletePaymentMethodByIdMutation();
  const [SoftDeleteMetroStation] = useSoftDeleteMetroStationByIdMutation();
  const [SoftDeleteRealEstateObject] =
    useSoftDeleteRealEstateObjectByIdMutation();
  const [SoftDeleteOffer] = useSoftDeleteOfferByIdMutation<any>();

  // const formData = useMemo(() => {
  //   return data ? omit(data.data, "id") : data;
  // }, [data]);

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>
    );
  };
  const bindItemToBuilding = async (newIds: {
    [key in TypeTabTableResidentialComplex]?: any;
  }) => {
    try {
      // if (newIds.hasOwnProperty(PAYMENT_METHODS)) {
      //   const alreadyBindedIds: any = data?.data.payment_methods.map(
      //     (el) => el.payment_method_id
      //   );
      //   const allIds = [...alreadyBindedIds, ...newIds.payment_methods];
      //   const transform = allIds?.map((id) => ({
      //     payment_method_id: id,
      //   }));
      //   await bindData(PAYMENT_METHODS, transform);
      // }
      // if (newIds.hasOwnProperty(METRO_STATIONS)) {
      //   const alreadyBindedIds: any = data?.data.metro_stations.map(
      //     (el) => el.metro_station_id
      //   );
      //   const allIds = [...alreadyBindedIds, ...newIds.metro_stations];
      //   const transform = allIds.map((id) => ({
      //     metro_station_id: id,
      //     time_on_car: inputChangeStation.current[id]?.time_on_car || null,
      //     time_on_foot: inputChangeStation.current[id]?.time_on_foot || null,
      //   }));
      //   await bindData(METRO_STATIONS, transform);
      // }
      // if (newIds.hasOwnProperty(TAGS)) {
      //   const alreadyBindedIds: any = data?.data.tags.map((el) => el.tag_id);
      //   const allIds = [...alreadyBindedIds, ...newIds.tags];
      //   const transform = allIds?.map((id) => ({
      //     tag_id: id,
      //   }));
      //   await bindData(TAGS, transform);
      // }
      // getData({
      //   id: id,
      //   params: paramCache,
      // } as any).then(() => {
      //   openNotification(
      //     ToastType.SUCCESS,
      //     t(`toast.message.${TableTextConst.REALESTATEBUILDING}.update`)
      //   );
      //   setBindMode(false);
      //   inputChangeStation.current = {};
      //   // setInputChangeStation({});
      // });
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message
      );
    }
  };

  const bindData = async (tabType: any, transform: any) => {
    try {
      switch (tabType) {
        case PAYMENT_METHODS:
          await BindPaymentMethod({
            real_estate_building_id: id,
            payment_methods: transform as any,
          });
          break;
        case METRO_STATIONS:
          await BindMetroStation({
            real_estate_building_id: id as string,
            metro_stations: transform,
          });
          break;
        case TAGS:
          await bindTag({
            real_estate_building_id: id,
            tags: transform as any,
          });
          break;
        default:
          break;
      }
    } catch (e) {
      throw e;
    } finally {
      fetchLoading.current = false;
    }
  };
  const unBindItemToBuilding = async (objectId: {
    [key in TypeTabTableResidentialComplex]?: string[];
  }) => {
    try {
      if (objectId.hasOwnProperty(METRO_STATIONS)) {
        const transform = objectId.metro_stations;
        await unBindData(METRO_STATIONS, transform);
      }
      if (objectId.hasOwnProperty(PAYMENT_METHODS)) {
        const transform = objectId.payment_methods;
        await unBindData(PAYMENT_METHODS, transform);
      }
      if (objectId.hasOwnProperty(TAGS)) {
        const transform = objectId.tags;
        await unBindData(TAGS, transform);
      }
      async function unBindData(tabType: any, transform: any) {
        switch (tabType) {
          case PAYMENT_METHODS:
            fetchLoading.current = true;
            await unBindPaymentMethod(transform).then(async (res) => {
              //@ts-ignore
              if (res?.data.success) {
                // await getData({ id: id, params: paramCache } as any).then(
                //   () => {
                //     fetchLoading.current = false;
                //   }
                // );
              }
            });
            break;
          case METRO_STATIONS:
            fetchLoading.current = true;
            await unBindMetroStation(transform).then(async (res) => {
              //@ts-ignore
              if (res?.data.success) {
                // await getData({ id: id, params: paramCache } as any).then(
                //   () => {
                //     fetchLoading.current = false;
                //   }
                // );
              }
            });
            break;
          case TAGS:
            fetchLoading.current = true;
            await unbindTag(transform).then(async (res) => {
              //@ts-ignore
              if (res?.data.success) {
                // await getData({ id: id, params: paramCache } as any).then(
                //   () => {
                //     fetchLoading.current = false;
                //   }
                // );
              }
            });
            break;
          default:
            break;
        }
        openNotification(
          ToastType.SUCCESS,
          t(`toast.message.${TableTextConst.REALESTATEBUILDING}.update`)
        );
      }
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message
      );
    }
  };

  // console.log(fetchLoading.current, 'cur')

  const editModeDriving = (rowId: string) => {
    setIsEditDriving((prev) => {
      return {
        ...prev,
        [rowId]: true,
      };
    });
  };
  const editModeWalk = (rowId: string) => {
    setIsEditWalk((prev) => {
      return {
        ...prev,
        [rowId]: true,
      };
    });
  };
  const editSquare = (rowId: string) => {
    setIsEditSquare((prev) => {
      return {
        ...prev,
        [rowId]: true,
      };
    });
  };
  const editPrice = (rowId: string) => {
    setIsEditPrice((prev) => {
      return {
        ...prev,
        [rowId]: true,
      };
    });
  };
  const updateTime = async (rowId: string, type: string) => {
    try {
      fetchLoading.current = true;
      const res: any = await UpdateBindMetroStation({
        id: rowId,
        real_estate_building_id: id,
        time_on_car:
          type === "time_on_car"
            ? Number(inputChangeStation.current[rowId]?.time_on_car)
            : null,
        time_on_foot:
          type === "time_on_foot"
            ? Number(inputChangeStation.current[rowId]?.time_on_foot)
            : null,
      } as UpdateMetroStationResponse);
      if (res?.data.success) {
        // await getData({ id: id, params: paramCache } as any);
        fetchLoading.current = false;
        setIsEditDriving({});
        setIsEditWalk({});
      }
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.METRO_STATION}.update`)
      );
    } catch (error) {
      console.log(error, "error");
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message
      );
    }
  };
  const updateInlineObject = async (rowId: string, type: string) => {
    try {
      fetchLoading.current = true;
      const fieldToUpdate = type === "price" ? "price" : "square";
      const updatedValue = Number(
        inputChangeObject.current[rowId]?.[fieldToUpdate]?.replace(/\s/g, "")
      );
      const res: any = await UpdateDataObject({
        id: rowId,
        [fieldToUpdate]: updatedValue,
      });
      if (res?.data?.success) {
        // await getData({ id: id, params: paramCache } as any).then(() => {
        //   fetchLoading.current = false;
        //   setIsEditSquare({});
        //   setIsEditPrice({});
        //   openNotification(
        //     ToastType.SUCCESS,
        //     t(`toast.message.${TableTextConst.REAL_ESTATE_OBJECT}.update`)
        //   );
        // });
      }
    } catch (error) {
      console.log(error, "error");
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message
      );
    }
  };

  const handleInputChange = (rowId: string, field: string, value: string) => {
    if (rowId) {
      inputChangeStation.current = {
        ...inputChangeStation.current,
        [rowId]: {
          ...inputChangeStation.current[rowId],
          [field]: value,
        },
      };
    }
  };

  const handleInputChangeObject = (
    rowId: string,
    field: string,
    value: string
  ) => {
    if (rowId) {
      inputChangeObject.current = {
        ...inputChangeObject.current,
        [rowId]: {
          ...inputChangeObject.current[rowId],
          [field]: value,
        },
      };
    }
  };

  const columnsMetroStations: ColumnDef<MetroStation>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.name"),
        accessorKey: "name",
        cell: function (props) {
          return useCustomLink(routePrefix.metro_station, props.row.original);
        },
      },
      {
        header: t("table.columnsHeader.metroLine"),
        accessorKey: "line",
        cell: function (props) {
          return useCustomLink(routePrefix.metro_line, props.row.original.line);
        },
      },
      {
        header: t("table.columnsHeader.time_on_car"),
        accessorKey: "time_on_car",
        cell: function (props) {
          return (
            <div className="flex justify-start items-center">
              {bindMode ? (
                <Input
                  style={{ marginRight: "3px", maxWidth: "50px" }}
                  size="xs"
                  defaultValue={props.row.original.time_on_car}
                  onChange={(e) =>
                    handleInputChange(
                      props.row.original.id,
                      "time_on_car",
                      e.target.value
                    )
                  }
                />
              ) : isEditDriving[props.row.original.id] ? (
                <>
                  <Input
                    style={{ marginRight: "3px", maxWidth: "50px" }}
                    size="xs"
                    defaultValue={props.row.original.time_on_car}
                    onChange={(e) =>
                      handleInputChange(
                        props.row.original.id,
                        "time_on_car",
                        e.target.value
                      )
                    }
                  />
                  <Tooltip title={"Подтвердить"}>
                    <Button
                      shape="circle"
                      variant="plain"
                      size="xs"
                      icon={<IoArrowUndo />}
                      onClick={() =>
                        updateTime(props.row.original.id, "time_on_car")
                      }
                    />
                  </Tooltip>
                </>
              ) : (
                <>
                  <p>
                    {props.row.original.time_on_car}
                    {""} минут
                  </p>
                  <Button
                    className="ml-1"
                    shape="circle"
                    variant="plain"
                    size="xs"
                    icon={<HiPencil />}
                    onClick={() => editModeDriving(props.row.original.id)}
                  />
                </>
              )}
            </div>
          );
        },
      },
      {
        header: t("table.columnsHeader.time_on_foot"),
        accessorKey: "time_on_foot",
        cell: function (props) {
          return (
            <div className="flex justify-start items-center">
              {bindMode ? (
                <Input
                  style={{ marginRight: "3px", maxWidth: "50px" }}
                  size="xs"
                  defaultValue={props.row.original.time_on_foot}
                  onChange={(e) =>
                    handleInputChange(
                      props.row.original.id,
                      "time_on_foot",
                      e.target.value
                    )
                  }
                />
              ) : isEditWalk[props.row.original.id] ? (
                <>
                  <Input
                    style={{ marginRight: "3px", maxWidth: "50px" }}
                    size="xs"
                    defaultValue={props.row.original.time_on_foot}
                    onChange={(e) =>
                      handleInputChange(
                        props.row.original.id,
                        "time_on_foot",
                        e.target.value
                      )
                    }
                  />
                  <Tooltip title={"Подтвердить"}>
                    <Button
                      shape="circle"
                      variant="plain"
                      size="xs"
                      icon={<IoArrowUndo />}
                      onClick={() =>
                        updateTime(props.row.original.id, "time_on_foot")
                      }
                    />
                  </Tooltip>
                </>
              ) : (
                <>
                  <p>
                    {props.row.original.time_on_foot}
                    {""} минут
                  </p>
                  <Button
                    className="ml-1"
                    shape="circle"
                    variant="plain"
                    size="xs"
                    icon={<HiPencil />}
                    onClick={() => editModeWalk(props.row.original.id)}
                  />
                </>
              )}
            </div>
          );
        },
      },
    ];
  }, [isEditWalk, isEditDriving, bindMode]);

  const columnsOffers: ColumnDef<Offer>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.offeractive"),
        accessorKey: "is_active",
        cell: (props) => {
          const value: any = props.getValue();
          const rowId = props.row.original.id;
          return (
            <SwitcherComponent
              value={value}
              onClick={(v: any) => {
                return handleUpdateOffer(v, rowId);
              }}
            />
          );
        },
      },
      {
        header: t("table.columnsHeader.priority"),
        accessorKey: "priority",
        cell: (props) => {
          return <>{props.row.original.priority}</>;
        },
      },
      {
        header: t("table.columnsHeader.name"),
        accessorKey: "name",
        cell: function (props) {
          return (
            <div style={{ whiteSpace: "nowrap" }}>
              {useCustomLink(routePrefix.offer, props.row.original, 20)}
            </div>
          );
        },
      },
      {
        header: t("table.columnsHeader.expertOffers"),
        accessorKey: "expert_mode",
        cell: (props) => {
          const is_expert = props.row.original.expert_mode;
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {is_expert ? (
                <IoIosCheckmarkCircleOutline color="green" size={"24"} />
              ) : (
                <MdOutlineCancel color="#ef4444" size={"24"} />
              )}
            </div>
          );
        },
      },
      {
        header: t("table.columnsHeader.marketplace"),
        accessorKey: "marketplace.name",
        cell: function (props) {
          return useCustomLink(
            routePrefix.marketplace,
            props.row.original.marketplace,
            maxLength
          );
        },
      },
      {
        header: t("table.columnsHeader.developer"),
        accessorKey: "developer.name",
        cell: function (props) {
          return useCustomLink(
            routePrefix.developer,
            props.row.original.developer,
            maxLength
          );
        },
      },
      {
        header: t("table.columnsHeader.script"),
        accessorKey: "script.name",
        cell: function (props) {
          return (
            <>
              {Object.entries(props.row.original.scripts || {}).length > 0 
              // &&
              // permissions[viewKeyScript] 
              
              ? (
                <Button
                  size="xs"
                  style={{ padding: "4px" }}
                  variant="plain"
                  onClick={() => openDialog(props.row.original.id, "script")}
                >
                  <p style={{ textDecoration: "underline" }}>Посмотреть</p>
                </Button>
              ) : (
                "-"
              )}

              <Dialog
                width={580}
                isOpen={isOpen?.script?.[props.row.original.id]}
                onClose={() => onDialogClose(props.row.original.id, "script")}
                onRequestClose={() =>
                  onDialogClose(props.row.original.id, "script")
                }
              >
                <div className="flex flex-col h-full justify-between">
                  {" "}
                  <ul>
                    {Object.entries(props.row.original.scripts || {}).map(
                      ([key, script]: any) => (
                        <li key={script.id} className="mb-2">
                          <h6>Название: {script.name}</h6>
                          <p>
                            Относится к:{" "}
                            {script.script_location?.value || "Не указано"}
                          </p>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </Dialog>
            </>
          );
        },
      },
      {
        header: t("table.columnsHeader.price"),
        accessorKey: "price",
      },
      {
        header: t("table.columnsHeader.reward"),
        accessorKey: "operator_award",
      },
      {
        header: t("table.columnsHeader.sipUri"),
        accessorKey: "sip_uri",
      },
      {
        header: t("table.columnsHeader.workTime"),
        accessorKey: "work_time",
        cell: (props) => {
          return (
            <>
              {/* {
              permissions[viewKeyWorkTime] ? ( */}
                <Button
                  size="xs"
                  style={{ padding: "4px" }}
                  variant="plain"
                  onClick={() => openDialog(props.row.original.id, "work_time")}
                >
                  <p style={{ textDecoration: "underline" }}>Посмотреть</p>
                </Button>
              {/* ) : (
                "-"
              )} */}
              <Dialog
                width={580}
                isOpen={isOpen?.work_time?.[props.row.original.id]}
                onClose={() =>
                  onDialogClose(props.row.original.id, "work_time")
                }
                onRequestClose={() =>
                  onDialogClose(props.row.original.id, "work_time")
                }
              >
                <div className="flex flex-col h-full justify-between">
                  <TableWorkHoursBindOffer
                    data={props.row.original.work_time}
                  />
                </div>
              </Dialog>
            </>
          );
        },
      },
      {
        header: t("table.columnsHeader.period_of_uniqueness"),
        accessorKey: "uniqueness_period",
      },
      {
        header: t("table.columnsHeader.limit_call"),
        accessorKey: "limit",
      },
      {
        header: t("table.columnsHeader.findFor"),
        accessorKey: "not_looking_for_himself",
        cell: (props) => {
          const not_looking_for_himself = props.getValue();
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {not_looking_for_himself ? (
                <IoIosCheckmarkCircleOutline color="green" size={"24"} />
              ) : (
                <MdOutlineCancel color="#ef4444" size={"24"} />
              )}
            </div>
          );
        },
      },
      {
        header: t("table.columnsHeader.outsideCity"),
        accessorKey: "client_is_out_of_town",
        cell: (props) => {
          const client_is_out_of_town = props.getValue();
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {client_is_out_of_town ? (
                <IoIosCheckmarkCircleOutline color="green" size={"24"} />
              ) : (
                <MdOutlineCancel color="#ef4444" size={"24"} />
              )}
            </div>
          );
        },
      },
    ];
  }, [isOpen]);

  const columnsPaymentMethods: ColumnDef<PaymentMethod>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.service"),
        accessorKey: "name",
        cell: function (props) {
          return useCustomLink(routePrefix.payment_method, props.row.original);
        },
      },
    ];
  }, []);

  const columnsTags: ColumnDef<Tag>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.name"),
        accessorKey: "name",
        cell: function (props) {
          return useCustomLink(routePrefix.tag, props.row.original);
        },
      },
    ];
  }, []);

  const columnsBuildingObject: ColumnDef<BuildingObject>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.roominess"),
        accessorKey: "roominess",
        cell: (props) => {
          const { key, value }: any = props.getValue();
          return <span>{value}</span>;
        },
      },
      {
        header: t("table.columnsHeader.type"),
        accessorKey: "type",
        cell: (props) => {
          const { key, value }: any = props.getValue();
          return <span>{value}</span>;
        },
      },
      {
        header: t("table.columnsHeader.finishing"),
        accessorKey: "finishing",
        cell: (props) => {
          const { key, value }: any = props.getValue();
          return <span>{value}</span>;
        },
      },
      {
        header: t("table.columnsHeader.square"),
        accessorKey: "square",
        cell: (props) => {
          return (
            <span className="flex justify-start items-center whitespace-nowrap">
              {isEditSquare[props.row.original.id] ? (
                <>
                  <Tooltip title={"Подтвердить"}>
                    <Button
                      shape="circle"
                      variant="plain"
                      size="xs"
                      icon={<FaCheck size={15} />}
                      onClick={() =>
                        updateInlineObject(props.row.original.id, "square")
                      }
                    />
                  </Tooltip>
                  <Input
                    style={{
                      marginRight: "3px",
                      width: "100px",
                      paddingLeft: "5px",
                    }}
                    size="xs"
                    defaultValue={thousandSeparatorValue(
                      Number(
                        props.row.original?.square
                          ?.toString()
                          ?.replace(/\D/g, "")
                      )
                    )}
                    onChange={(e) =>
                      handleInputChangeObject(
                        props.row.original.id,
                        "square",
                        e.target.value
                      )
                    }
                  />
                </>
              ) : (
                <>
                  <Button
                    className="mr-1"
                    shape="circle"
                    variant="plain"
                    size="xs"
                    icon={<HiPencil />}
                    onClick={() => editSquare(props.row.original.id)}
                  />
                  <p>
                    {props.row.original.square}
                    {""}
                  </p>
                </>
              )}
            </span>
          );
        },
      },
      {
        header: t("table.columnsHeader.price"),
        accessorKey: "price",
        cell: (props) => {
          return (
            <span className="flex justify-start items-center whitespace-nowrap">
              {isEditPrice[props.row.original.id] ? (
                <>
                  <Tooltip title={"Подтвердить"}>
                    <Button
                      shape="circle"
                      variant="plain"
                      size="xs"
                      icon={<FaCheck size={15} />}
                      onClick={() =>
                        updateInlineObject(props.row.original.id, "price")
                      }
                    />
                  </Tooltip>
                  <Input
                    style={{
                      marginRight: "3px",
                      width: "100px",
                      paddingLeft: "5px",
                    }}
                    size="xs"
                    defaultValue={thousandSeparatorValue(
                      Number(
                        props.row.original.price.toString().replace(/\D/g, "")
                      )
                    )}
                    onChange={(e) =>
                      handleInputChangeObject(
                        props.row.original.id,
                        "price",
                        e.target.value
                      )
                    }
                  />
                </>
              ) : (
                <>
                  <Button
                    className="mr-1"
                    shape="circle"
                    variant="plain"
                    size="xs"
                    icon={<HiPencil />}
                    onClick={() => editPrice(props.row.original.id)}
                  />
                  <p>
                    {props.row.original.price}
                    {""}
                  </p>
                </>
              )}
            </span>
          );
        },
      },
      {
        header: t("table.columnsHeader.priceForSquare"),
        accessorKey: "price_per_meter",
      },
      {
        header: t("table.columnsHeader.deadline"),
        accessorKey: "deadline",
        cell: (props) => {
          const value: any = props.getValue();
          return <span style={{ whiteSpace: "nowrap" }}>{value.value}</span>;
        },
      },
    ];
  }, [isEditSquare, isEditPrice]);

  const handleUpdate = async (form: FormEssence<RealEstateBuilding>) => {
    try {
      await UpdateData({ id: item?.id, ...form }).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.REALESTATEBUILDING}.update`)
      );
      setIsEdit(false);
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message
      );
    }
  };
  const handleUpdateOffer = async (value: boolean, offerId: string) => {
    try {
      await UpdateDataOffer({
        id: offerId,
        is_active: value,
      } as any).then((res) => {
        //@ts-ignore
        if (res?.data.success) {
          // getData({ id: id, params: paramCache } as any);
        }
      });
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.OFFER}.update`)
      );
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message
      );
    }
  };

  const handleDelete = async (id: string) => {
    const deletedItem: any = await SoftDeleteRealEstateBuilding(id);
    if (!deletedItem?.data.error) {
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.REALESTATEBUILDING}.delete`)
      );
      dispatch(setDrawerState(false));
      // navigate(`${routePrefix.real_estate_building}`);
    }
  };

  useEffect(() => {
    if (isEditPage) {
      setIsEdit(true);
    }
  }, []);

  return (
    <Loading /* loading={!data && isLoading} type="cover" */>
      {/* {methodInsert(document.getElementById("breadcrumbs"), data?.data.name)} */}
      <>
        <div className="mb-1 flex justify-between items-center w-full">
          <h3 className="mb-2 text-base">
            {t(`${TableTextConst.REALESTATEBUILDING}Page.card.title`)}{" "}
            {item?.name}
          </h3>
          <div className="mb-1 flex justify-end flex-row">
            {isEdit ? (
              <Button
                shape="circle"
                variant="plain"
                size="md"
                icon={<HiEye size={15} />}
                onClick={() => setIsEdit((prev) => !prev)}
              />
            ) : (
              // permissions[updateKey] && (
                <Button
                  shape="circle"
                  variant="plain"
                  size="md"
                  icon={<HiPencil size={15} />}
                  onClick={() => setIsEdit((prev) => !prev)}
                />
              // )
            )}
            {/* {permissions[deleteSoftKey] && ( */}
              <Button
                shape="circle"
                variant="plain"
                size="md"
                icon={<HiTrash size={15} />}
                onClick={() => handleDelete(item?.id as string)}
              />
            {/* )} */}
          </div>
        </div>

        {isEdit ? (
          <FormResidentialComplex
            duplicate={isDuplicatePage}
            data={item}
            onNextChange={handleUpdate}
            // isLoadingEndpoint={isLoading}
            isEdit
          />
        ) : (
          <>
            {/* {data?.data?.images && data?.data?.images?.length > 0 && (
              <div style={{ flexWrap: "wrap" }}>
                <p>{t("formInput.residentialComplexes.photo")}</p>
                {data?.data.images?.map((photo: any) => {
                  return (
                    <div className="inline-flex mr-2">
                      <img
                        className="w-full h-36 max-w-36 rounded-lg"
                        src={`${photo}`}
                        alt="фото ЖК"
                      />
                    </div>
                  );
                })}
              </div>
            )} */}
            <Card>
              <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-4 gap-x-4">
                  <CustomerInfoField
                    title={t("formInput.residentialComplexes.id")}
                    value={item?.int_id || t("global.noDataAvailable")}
                  />
                  <CustomerInfoField
                    title={t("formInput.residentialComplexes.name")}
                    value={item?.name || t("global.noDataAvailable")}
                  />
                  <CustomerInfoField
                    title={t("formInput.residentialComplexes.developer")}
                    value={
                      item?.developer ? (
                        <ActionLink
                          target="_blank"
                          to={`${routePrefix.developer}/${item?.developer.id}`}
                        >
                          {item?.developer?.name}
                        </ActionLink>
                      ) : (
                        t("global.noDataAvailable")
                      )
                    }
                  />
                  <CustomerInfoField
                    title={t("formInput.residentialComplexes.city")}
                    value={
                      item?.city ? (
                        <ActionLink
                          target="_blank"
                          to={`${routePrefix.city}/${item?.city.id}`}
                        >
                          {item?.city.name}
                        </ActionLink>
                      ) : (
                        t("global.noDataAvailable")
                      )
                    }
                  />
                  <CustomerInfoField
                    title={t("formInput.residentialComplexes.region")}
                    value={
                      item?.is_region
                        ? "Да"
                        : "Нет" || t("global.noDataAvailable")
                    }
                  />
                  <CustomerInfoField
                    title={t("formInput.residentialComplexes.latitude")}
                    value={item?.latitude || t("global.noDataAvailable")}
                  />
                  <CustomerInfoField
                    title={t("formInput.residentialComplexes.longitude")}
                    value={item?.longitude || t("global.noDataAvailable")}
                  />
                  <CustomerInfoField
                    title={t("formInput.residentialComplexes.website")}
                    value={
                      item?.site ? (
                        <ActionLink target="_blank" to={item?.site}>
                          {item?.site}
                        </ActionLink>
                      ) : (
                        t("global.noDataAvailable")
                      )
                    }
                  />
                  <CustomerInfoField
                    title={t("formInput.residentialComplexes.location")}
                    value={item?.location || t("global.noDataAvailable")}
                  />
                  <CustomerInfoField
                    title={t("formInput.residentialComplexes.description")}
                    value={
                      item?.description || t("global.noDataAvailable")
                    }
                  />
                </div>
              </div>
            </Card>
          </>
        )}
        {!isEdit && (
          <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}>
            <TabList>
              {/* {permissions[viewKeyPaymentMethod] && ( */}
                <TabNav value={PAYMENT_METHODS}>
                  {t("tabsText.paymentMethods")}
                </TabNav>
              {/* )} */}
              {/* {data?.info[METRO_STATIONS] &&
                permissions[viewKeyMetroStastion] && ( */}
                  <TabNav value={METRO_STATIONS}>
                    {t("tabsText.metroStations")}
                  </TabNav>
                {/* )
                } */}
              {/* {permissions[viewKeyTag] && ( */}
                <TabNav value={TAGS}>{t("tabsText.tags")}</TabNav>
              {/* )} */}
              {/* {permissions[viewKeyObject] && ( */}
                <TabNav value={OBJECTS}>{t("tabsText.objects")}</TabNav>
              {/* )} */}
              {/* {permissions[viewKeyOffer] && ( */}
                <TabNav value={OFFERS}>{t("tabsText.offers")}</TabNav>
              {/* )} */}
              {currentTab === METRO_STATIONS && bindMode && (
                <Input
                  style={{ maxWidth: "300px" }}
                  size="xs"
                  placeholder="Введите станцию метро..."
                  onChange={debounce(async (e) => {
                    setSearchMetroStation(e.target.value);
                  }, 500)}
                />
              )}
            </TabList>
            <div className="py-4">
              <TabContent value={PAYMENT_METHODS}>
                <TabTableResidentialComplex<PaymentMethod>
                  onNext={bindItemToBuilding}
                  onBack={unBindItemToBuilding}
                  update={UpdateData}
                  setBindMode={setBindMode}
                  bindMode={bindMode}
                  // info={data?.info.payment_methods}
                  info={[]}
                  // cityId={data?.data.city?.id}
                  columns={columnsPaymentMethods}
                  type={PAYMENT_METHODS}
                  textConst={TableTextConst.PAYMENT_METHOD}
                  // data={
                  //   bindMode
                  //     ? data?.info.payment_methods
                  //     : data?.data.payment_methods
                  // }
                  // loading={isFetching}
                  // getData={(req) => {
                  //   getData({ id, params: req } as any);
                  // }}
                  SoftDelete={(req) => SoftDeletePaymentMethod(req)}
                />
              </TabContent>
              <TabContent value={METRO_STATIONS}>
                <TabTableResidentialComplex<MetroStation>
                  onNext={bindItemToBuilding}
                  onBack={unBindItemToBuilding}
                  update={UpdateData}
                  setBindMode={setBindMode}
                  bindMode={bindMode}
                  isMetroStationTableBind
                  // info={data?.info}
                  // cityId={data?.data.city?.id}
                  columns={columnsMetroStations}
                  type={METRO_STATIONS}
                  textConst={TableTextConst.METRO_STATION}
                  // data={bindMode ? searchStations : data?.data.metro_stations}
                  // loading={isFetching}
                  // getData={(req) => {
                  //   getData({ id, params: req } as any);
                  // }}
                  SoftDelete={(req) => SoftDeleteMetroStation(req)}
                  setParamCache={setParamCache}
                />
              </TabContent>
              <TabContent value={TAGS}>
                <TabTableResidentialComplex<Tag>
                  onNext={bindItemToBuilding}
                  onBack={unBindItemToBuilding}
                  update={UpdateData}
                  setBindMode={setBindMode}
                  bindMode={bindMode}
                  // info={data?.info}
                  // cityId={data?.data.city?.id}
                  columns={columnsTags}
                  type={TAGS}
                  textConst={TableTextConst.TAG}
                  // data={bindMode ? data?.info.tags : data?.data.tags}
                  // loading={isFetching}
                  // getData={(req) => {
                  //   getData({ id, params: req } as any);
                  // }}
                  SoftDelete={(req) => SoftDeletePaymentMethod(req)}
                />
              </TabContent>
              <TabContent value={OBJECTS}>
                <TabTableResidentialComplex<BuildingObject>
                  onNext={bindItemToBuilding}
                  columns={columnsBuildingObject}
                  type={OBJECTS}
                  textConst={TableTextConst.REAL_ESTATE_OBJECT}
                  // data={data?.data.objects || []}
                  // loading={isFetching}
                  // getData={(req) => {
                  //   getData({ id, params: req } as any);
                  // }}
                  SoftDelete={(req) => SoftDeleteRealEstateObject(req)}
                />
              </TabContent>
              <TabContent value={OFFERS}>
                <TabTableResidentialComplex<Offer>
                  onNext={bindItemToBuilding}
                  columns={columnsOffers}
                  type={OFFERS}
                  textConst={TableTextConst.OFFER}
                  // data={data?.data.offers || []}
                  // loading={isLoadingUpdate || isFetching}
                  // getData={(req) => {
                  //   getData({ id, params: req } as any);
                  // }}
                  SoftDelete={(req) => SoftDeleteOffer(req)}
                  setParamCache={setParamCache}
                />
              </TabContent>
            </div>
          </Tabs>
        )}
      </>
    </Loading>
  );
};

export default CardResidentialComplex;
