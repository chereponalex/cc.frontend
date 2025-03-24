import { OnSortParam } from "@/components/shared";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import DataTable from "@/components/shared/DataTable";
import { Filter, Option, Response, TableTextConst, TypeFilter } from "@/@types";
import { useTranslation } from "react-i18next";
import Drawer from "@/components/ui/Drawer";
import { useAppDispatch, useAppSelector } from "@/store";
import { motion } from "framer-motion";
import {
  HiChevronDown,
  HiChevronRight,
  HiDuplicate,
  HiEye,
  HiOutlineFilter,
  HiPencil,
  HiPlus,
  HiTrash,
  HiX,
} from "react-icons/hi";
import DatePicker from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Tooltip } from "@/components/ui/Tooltip";
import { TypeTab } from "@/@types/tabs";
import RestoreFromTrashSvg from "@/assets/svg/RestoreFromTrashSvg";
import Tabs from "@/components/ui/Tabs";
import { ToastType } from "@/@types/toast";
import { Card, toast } from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { UseQueryStateResult } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { useNavigate } from "react-router-dom";
import routePrefix from "@/configs/routes.config/routePrefix";
import RestoreMassSvg from "@/assets/svg/RestoreMassSvg";
import debounce from "lodash/debounce";
import transformOptionsToString from "@/utils/transformOptionsToString";

import { components, ValueContainerProps } from "react-select";
import { RequestFilterType, RtkRequest } from "@/@types/requestRtk";
import { setFilterPaginate, setFiltersTransfer } from "@/store/slices/entities";
import dayjs from "dayjs";
import CreatNewDevelopers from "@/views/Developers/CreatNewDevelopers";
import { setDrawerState } from "@/store/slices/actionState";

const { TabNav, TabList, TabContent } = Tabs;

type TableColumnSort = {
  order: "" | "asc" | "desc";
  key: string | number;
};

interface TableFilter extends Filter {
  value: any;
}

type DateTimeFilter = {
  start: Date | null;
  end: Date | null;
};

type TablePageProps<T> = {
  columns: ColumnDef<T>[];
  textConst: TableTextConst;
  data: Response<T[]> | null;
  loading?: boolean;
  loadingReport?: boolean;
  noTab?: boolean;
  noCheckBoxes?: boolean;
  noActions?: boolean;
  noBtn?: boolean;
  getData: (request: RtkRequest) => UseQueryStateResult<any, any>;
  SoftDelete?: (request: string) => UseQueryStateResult<any, any>;
  SoftDeleteMass?: (request: string) => UseQueryStateResult<any, any>;
  HardDelete: (request: string) => UseQueryStateResult<any, any>;
  Recovery?: (request: string) => UseQueryStateResult<any, any>;
  RecoveryMass?: (request: string) => UseQueryStateResult<any, any>;
  childrenDrawer?: any;
  createReport?: (request: {
    [key: string]: any;
  }) => UseQueryStateResult<any, any>;
};

const ValueContainer = ({
  children,
  ...props
}: ValueContainerProps<{
  value: string;
  label: string;
}>) => {
  let [values, input] = children as any;
  if (Array.isArray(values)) {
    const plural = values.length === 1 ? "" : "о";
    values = `${values.length} выбран${plural}`;
  }
  return (
    <>
      <components.ValueContainer {...props}>
        <p style={{ fontSize: "11px", minHeight: "16px" }}>{values}</p>
        {input}
      </components.ValueContainer>
    </>
  );
};

function _TablePage<T>(props: TablePageProps<T>) {
  const {
    columns = [],
    textConst,
    data = null,
    loading = false,
    loadingReport = false,
    noTab = false,
    getData,
    SoftDelete,
    SoftDeleteMass,
    HardDelete,
    Recovery,
    RecoveryMass,
    createReport,
    noActions,
    noCheckBoxes,
    noBtn,
    childrenDrawer,
  } = props;
  const dispatch = useAppDispatch();
  const heightRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions,
  );
  const reportLinkLoading = useAppSelector((state) => state.report.isLoading);
  const createKey = `api.v1.crm.${textConst}.create`;
  const updateKey = `api.v1.crm.${textConst}.update`;
  const deleteSoftKey = `api.v1.crm.${textConst}.delete_soft`;
  const reportKey = `api.v1.crm.${textConst}.create_report`;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isOpenDrawer = useAppSelector(
    (state) => state.actionsState.actions.drawer,
  );

  const [selectedRowsData, setSelectedRowsData] = useState<any[]>([]);
  // const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>(TypeTab.ACTIVE);
  const [tableData, setTableData] = useState<{
    pageIndex: number;
    pageSize: number;
    sort: TableColumnSort[];
    query: string;
    total: number;
    selectedRows: string[];
    selectedRow: string;
  }>({
    total: 0,
    pageIndex: 1,
    pageSize: textConst === TableTextConst.TRANSFER ? 100 : 50,
    selectedRows: [],
    selectedRow: "",
    query: "",
    sort: [],
  });
  const [tableFiltersData, setTableFiltersData] = useState<TableFilter[]>([]);
  const [inputSearch, setInputSearch] = useState<string>("");
  const [dateTimeFilters, setDateTimeFilters] = useState<DateTimeFilter>({
    start: null,
    end: null,
  });
  const [activeHeight, setActiveHeight] = useState<number | null>(null);
  const direction = useAppSelector((state) => state.theme.direction);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [drawerType, setDrawerType] = useState<"card" | "create">("card");
  const refData = useRef(data?.data);

  const handleOpenDrawer = (type: "card" | "create", id?: string) => {
    setSelectedId(refData.current?.find((el: any) => el.id === id));
    setDrawerType(type);
    dispatch(setDrawerState(true));
  };

  const DrawerContent = useCallback(
    (props: any) => {
      const Comp =
        drawerType === "card" ? childrenDrawer.card : childrenDrawer.create;

      return <Comp {...props} />;
    },
    [drawerType],
  );

  const formatDate = (date: Date): string => {
    return date
      .toLocaleString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "");
  };

  const onCollapse = () => {
    setCollapse(!collapse);
  };

  useEffect(() => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setSelectedRowsData([]);
  }, [currentTab]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      const isInputFocused =
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA";
      if (
        (event.key.toLowerCase() === "f" || event.key.toLowerCase() === "а") &&
        !isInputFocused
      ) {
        onCollapse();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCollapse]);

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const onRowSelect = (checked: boolean, row: T) => {
    if (checked) {
      setTableData((prevData) => ({
        ...prevData,
        ...{
          selectedRows: [
            ...prevData.selectedRows,
            ...[(row as { id: string }).id],
          ],
        },
      }));
    } else {
      setTableData((prevData) => ({
        ...prevData,
        ...{
          selectedRows: [
            ...prevData.selectedRows.filter(
              (id) => id !== (row as { id: string }).id,
            ),
          ],
        },
      }));
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      if (currentTab === TypeTab.ACTIVE && SoftDelete) {
        await SoftDelete(userId).unwrap();
        openNotification(
          ToastType.SUCCESS,
          t(`toast.message.${textConst}.addInBasket`),
        );
      } else {
        await HardDelete(userId).unwrap();
        openNotification(
          ToastType.SUCCESS,
          t(`toast.message.${textConst}.delete`),
        );
      }
    } catch (error) {
      console.log(error);
      // @ts-ignore
      openNotification(ToastType.WARNING, error.message);
    }
  };

  const handleDeleteMass = async (rowIds: any) => {
    try {
      if (currentTab === TypeTab.ACTIVE && SoftDeleteMass) {
        const deletedItem = await SoftDeleteMass({
          ids: rowIds,
        } as any).unwrap();
        if (!deletedItem?.data.error) {
          // setSelectedRowsData([]);
          openNotification(
            ToastType.SUCCESS,
            t(`toast.message.${textConst}.addInBasket`),
          );
        }
      }
    } catch (error: any) {
      console.log(error);
      openNotification(ToastType.WARNING, error.message);
    }
  };

  const handleRecovery = async (userId: string) => {
    try {
      if (currentTab === TypeTab.BASKET && Recovery) {
        await Recovery(userId).unwrap();
        openNotification(
          ToastType.SUCCESS,
          t(`toast.message.${textConst}.recovery`),
        );
      } else {
        //@ts-ignore
        navigate(`${routePrefix[textConst]}/${userId}/?editPage=true`);
      }
    } catch (error) {
      console.log(error);
      // @ts-ignore
      openNotification(ToastType.WARNING, error.message);
    }
  };

  const handleRecoveryMass = async (rowIds: any) => {
    try {
      if (currentTab === TypeTab.BASKET && RecoveryMass) {
        await RecoveryMass({ ids: rowIds } as any).unwrap();
        openNotification(
          ToastType.SUCCESS,
          t(`toast.message.${textConst}.recovery`),
        );
      }
    } catch (error: any) {
      console.log(error);
      openNotification(ToastType.WARNING, error.message);
    }
  };

  const currentColumns: ColumnDef<T>[] = useMemo(() => {
    return [
      ...columns,
      ...(!noActions
        ? [
            {
              header: t("table.columnsHeader.action"),
              id: "action",
              cell: (props: any) => (
                <div
                  className={`${
                    textConst === TableTextConst.BLACK_LIST && "pr-10"
                  } flex justify-end`}
                >
                  {noTab ? (
                    <Tooltip
                      title={
                        currentTab === TypeTab.ACTIVE && SoftDelete
                          ? t(`tooltip.${textConst}.sendToCart`)
                          : t(`tooltip.${textConst}.delete`)
                      }
                    >
                      <Button
                        // style={{ paddingRight: "40px" }}
                        shape="circle"
                        variant="plain"
                        size="xs"
                        icon={<HiTrash />}
                        onClick={() =>
                          handleDelete(
                            (props.row.original as { id: string }).id,
                          )
                        }
                      />
                    </Tooltip>
                  ) : (
                    <>
                      {textConst !== TableTextConst.BLACK_LIST && (
                        <>
                          <Tooltip title={t(`tooltip.${textConst}.view`)}>
                            <Button
                              shape="circle"
                              variant="plain"
                              size="xs"
                              icon={<HiEye />}
                              onClick={() => {
                                handleOpenDrawer(
                                  "card",
                                  (props.row.original as { id: string }).id,
                                );
                                // setIsOpenDrawer(true);
                                // navigate(
                                //   `${(props.row.original as { id: string }).id}`
                                // );
                              }}
                            />
                          </Tooltip>
                          {Recovery && currentTab === TypeTab.ACTIVE ? (
                            // permissions[updateKey] && (
                            // <Tooltip title={t(`tooltip.${textConst}.edit`)}>
                            //   <Button
                            //     shape="circle"
                            //     variant="plain"
                            //     size="xs"
                            //     icon={<HiPencil />}
                            //     onClick={() =>
                            //       handleOpenDrawer(
                            //         (props.row.original as { id: string }).id,
                            //         "create"
                            //       )
                            //       // handleRecovery(
                            //       //   (props.row.original as { id: string }).id
                            //       // )
                            //     }
                            //   />
                            // </Tooltip>
                            <></>
                          ) : (
                            // )
                            <Tooltip title={t(`tooltip.${textConst}.recovery`)}>
                              <Button
                                shape="circle"
                                variant="plain"
                                size="xs"
                                icon={<RestoreFromTrashSvg />}
                                onClick={() =>
                                  handleRecovery(
                                    (props.row.original as { id: string }).id,
                                  )
                                }
                              />
                            </Tooltip>
                          )}
                          {/* {permissions[createKey] && ( */}
                          {/* <Tooltip
                            title={t(
                              `tooltip.${textConst}.duplicateAndCreatElement`
                            )}
                          >
                            <Button
                              shape="circle"
                              variant="plain"
                              size="xs"
                              icon={<HiDuplicate />}
                              onClick={() =>
                                navigate(
                                  //@ts-ignore
                                  `${routePrefix[textConst]}/creat-new/${
                                    (props.row.original as { id: string }).id
                                  }/?duplicate=true`
                                )
                              }
                            />
                          </Tooltip> */}
                          {/* )} */}
                        </>
                      )}
                      {/* {permissions[deleteSoftKey] && ( */}
                      <Tooltip
                        title={
                          currentTab === TypeTab.ACTIVE && SoftDelete
                            ? t(`tooltip.${textConst}.sendToCart`)
                            : t(`tooltip.${textConst}.delete`)
                        }
                      >
                        <Button
                          shape="circle"
                          variant="plain"
                          size="xs"
                          icon={<HiTrash />}
                          onClick={() =>
                            handleDelete(
                              (props.row.original as { id: string }).id,
                            )
                          }
                        />
                      </Tooltip>
                      {/* )} */}
                    </>
                  )}
                </div>
                // <Button variant="twoTone"
                //         color={props.row.original.is_blocked ? "green-600" : "red-600" }
                //         size="xs" onClick={() => handleBlockUser(props.row.original)}>
                //     {props.row.original.is_blocked ? t('table.button.unblocked') : t('table.button.blocked') }
                // </Button>
              ),
            },
          ]
        : []),
    ];
  }, [currentTab, columns, permissions]);

  const handlePaginationChange = (pageIndex: number) => {
    setTableData((prevData) => ({ ...prevData, ...{ pageIndex } }));
  };

  const handleSelectChange = (pageSize: number) => {
    setTableData((prevData) => ({ ...prevData, ...{ pageSize } }));
  };

  const handleResetAllFilters = async () => {
    setTableFiltersData((prevData) => [
      ...prevData.map((el) => ({ ...el, value: "" })),
    ]);
    setDateTimeFilters(() => {
      return { start: dayjs().startOf("day").toDate(), end: null };
    });

    const queryParams: any = {};
    queryParams.page = `${tableData.pageIndex}`;
    queryParams.per_page = `${tableData.pageSize}`;
    queryParams.date = {
      start: dayjs().startOf("day").format("YYYY-MM-DD HH:mm"),
    };
    await getData({
      body: queryParams,
      method: "PUT",
    }).unwrap();
    if (textConst === TableTextConst.TRANSFER) {
      dispatch(setFiltersTransfer(null));
    }
  };
  const resetSingleFilter = (key: string) => {
    setTableFiltersData((prevData) => [
      ...prevData.map((el) => {
        return el.name === key ? { ...el, value: "" } : { ...el };
      }),
    ]);
  };

  const handleFiltersChange = (key: string, value: any, whichDate?: string) => {
    setTableFiltersData((prevData) => [
      ...prevData.map((el) => {
        if (Array.isArray(value)) {
          return el.name === key
            ? { ...el, value: value.filter((el) => el !== "all") }
            : el;
        } else {
          if (el.type === "date-time-interval") {
            const currentValue = el.value || {};
            if (whichDate === "start") {
              return { ...el, value: { ...currentValue, start: value } };
            } else if (whichDate === "end") {
              return { ...el, value: { ...currentValue, end: value } };
            }
          }
          if (el.type === "dropdown-checkbox") {
            return el.name === key ? { ...el, value: value.split(",") } : el;
          } else {
            return el.name === key ? { ...el, value } : el;
          }
        }
      }),
    ]);
  };

  const handleSort = ({ order, key }: OnSortParam) => {
    setTableData((prevData) => {
      if (!prevData.sort.length) {
        return {
          ...prevData,
          sort: [{ order, key }],
        };
      }
      let sortArray: TableColumnSort[] = [];

      if (order) {
        sortArray = prevData.sort.map((el) => {
          return el.key === key ? { ...el, order: order } : { order, key };
        });
      }
      // } else {
      //     console.log(key)
      //     sortArray = prevData.sort.filter(el => el.key !== key)
      // }
      return {
        ...prevData,
        sort: sortArray,
      };
    });
  };
  const CamelCaseRefactoring = (text: string) => {
    return text
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str)
      .toLowerCase()
      .split(" ")
      .join("-");
  };

  const tableFilters = useMemo(() => {
    let res: { [key: string]: any } = {};
    if (tableFiltersData?.length) {
      tableFiltersData.map((el) => {
        // let nowDate = new Date().toISOString();
        if (el.type === "date-time-interval") {
          res["date"] = {
            start: dateTimeFilters.start
              ? formatDate(dateTimeFilters.start)
              : dayjs().startOf("day").format("YYYY-MM-DD HH:mm"),
            ...(el.value.end ? { end: formatDate(el.value.end) } : {}),
          };
        } else if (el.value !== "") {
          res[el.name] = el.value;
        }
      });
    }
    return res;
  }, [tableFiltersData]);

  const fetchData = async (
    type: RequestFilterType = "GET",
    isApplyFilters?: boolean,
  ) => {
    const queryParams: any = {};
    const sanitizeEmptyProperties = (obj: Record<string, object | string>) => {
      const finalObject: Record<string, object | string> = {};
      for (const [k, v] of Object.entries(obj)) {
        if (Array.isArray(v) && v.every((el) => el == "")) {
        } else if ((typeof v === "string" && v.length === 0) || v === "all") {
        } else {
          finalObject[k] = v;
        }
      }
      return finalObject;
    };
    if (Object.keys(tableFilters).length) {
      queryParams.page = isApplyFilters ? "1" : `${tableData.pageIndex}`;
      queryParams.per_page = `${tableData.pageSize}`;
      const sanitizedFilters = sanitizeEmptyProperties(tableFilters);
      Object.assign(queryParams, sanitizedFilters);
      dispatch(setFilterPaginate(queryParams.page));
    } else {
      queryParams.page = isApplyFilters ? "1" : `${tableData.pageIndex}`;
      queryParams.per_page = `${tableData.pageSize}`;
      if (textConst === TableTextConst.TRANSFER) {
        queryParams.date = {
          start: dayjs().startOf("day").format("YYYY-MM-DD HH:mm"),
        };
      }
      dispatch(setFilterPaginate(queryParams.page));
    }
    if (tableData.sort.length) {
      tableData.sort.map((el) => {
        //queryParams[`sort[${el.key}]`] = el.order;
        queryParams[`sort`] = {
          [el.key]: el.order,
        };
      });
    }
    if (currentTab === TypeTab.BASKET) {
      queryParams.isDeleted = true;
    }
    if (inputSearch) {
      queryParams.search = inputSearch;
    }

    try {
      if (textConst === TableTextConst.TRANSFER) {
        const copiedParams = { ...queryParams };
        const keysToDelete = [
          "page",
          "per_page",
          ...Object.keys(copiedParams).filter((key) => key.startsWith("sort")),
        ];
        keysToDelete.forEach((key) => {
          delete copiedParams[key];
        });
        dispatch(setFiltersTransfer(copiedParams));
      }
      const result = await getData({
        body: queryParams,
        method: type,
      }).unwrap();

      if (result) {
        setHasLoaded(true);
        setTableData((prevData) => ({
          ...prevData,
          ...{ total: result.paginate?.total || 0 },
          // ...{ pageIndex: result.paginate?.current_page || 1 },
          // ...{ pageSize: result.paginate?.per_page || 25 },
        }));
      }
    } catch (error) {
      console.log(error);
      // @ts-ignore
      openNotification(ToastType.WARNING, error.message);
    }
  };

  const applyFilters = () => {
    fetchData("PUT", true);
    setTableData((prevData) => ({
      ...prevData,
      ...{ pageIndex: 1 },
    }));
  };

  useEffect(() => {
    fetchData("PUT");
  }, [
    tableData.pageIndex,
    tableData.sort,
    tableData.pageSize,
    currentTab,
    inputSearch,
  ]);

  const fetchCreateReport = async () => {
    const queryParams: any = {};
    if (Object.keys(tableFilters).length) {
      Object.assign(queryParams, tableFilters);
    }
    if (createReport) {
      const result = await createReport(queryParams);
    }
  };

  useEffect(() => {
    if (data && !hasLoaded)
      setTableFiltersData(data?.filters?.map((el) => ({ ...el, value: "" })));
    refData.current = data?.data;
  }, [data]);

  const handleAnimationComplete = () => {
    if (heightRef.current) {
      const rect = heightRef.current.getBoundingClientRect();
      setActiveHeight(rect.height);
    }
  };

  return (
    <Card>
      <div className="overflow-x-none">
        <div
          className={`bg-white dark:bg-gray-800 z-[3] border-gray-200 dark:border-gray-700`}
        >
          {!!tableFiltersData?.length && (
            <div ref={focusRef}>
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-1 cursor-pointer select-none"
                  onClick={onCollapse}
                >
                  <span className="text-lg">
                    {!collapse ? <HiChevronRight /> : <HiChevronDown />}
                  </span>
                  <h6>{t("global.filters")}</h6>
                  <HiOutlineFilter />
                  <span>({tableFiltersData.length})</span>
                </div>
                <hr className="ml-3 w-full" />
                {/* {!!Object.keys(tableFilters).length && (
              <Tooltip title={t("global.resetAllFilters")}>
                <Button
                  shape="circle"
                  variant="plain"
                  size="xs"
                  icon={<HiX color={"red"} />}
                  onClick={handleResetAllFilters}
                />
              </Tooltip>
            )} */}
              </div>
              <motion.div
                ref={heightRef}
                className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-2 gap-y-0.5 mb-1"
                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                animate={{
                  opacity: !collapse ? 0 : 1,
                  height: !collapse ? 0 : "auto",
                  overflow: !collapse ? "hidden" : "visible",
                }}
                transition={{ duration: 0.15 }}
                onAnimationComplete={handleAnimationComplete}
              >
                {tableFiltersData.map((elm, i) => {
                  const options =
                    elm?.options?.length > 0
                      ? elm.options.filter(
                          (option: Option) =>
                            option.value !== null && option.value !== "",
                        )
                      : [];
                  options.unshift({ value: "all", label: "Все" });

                  const dropdownCheckboxVal = options.filter((el: any) =>
                    elm.type === "dropdown-checkbox"
                      ? elm.value?.includes(el.value)
                      : elm.value == el.value,
                  );

                  const singleDropDownCheckBoxVal =
                    elm?.options?.length > 0
                      ? elm?.options?.find(
                          (el: Option) => elm.value === el.value,
                        )
                      : null;

                  return (
                    <React.Fragment key={i}>
                      {elm.type === TypeFilter.DATE && (
                        <>
                          <div key={`${elm.name}-start-${i}`}>
                            <h6 style={{ fontSize: "12px" }}>{elm.label}</h6>
                            <div className="flex items-center gap-1">
                              <DatePicker.DateTimepicker
                                initialTime={{ hours: 0, minutes: 0 }}
                                amPm={false}
                                inputPrefix={"с:"}
                                noConfirmBtn
                                inputFormat={"DD.MM.YYYY HH:mm"}
                                size={"xs"}
                                value={
                                  dateTimeFilters.start ||
                                  dayjs().startOf("day").toDate()
                                }
                                maxDate={dayjs(new Date())
                                  .add(0, "day")
                                  .toDate()}
                                placeholder={"__.__.__"}
                                onChange={(e) => {
                                  if (e != null) {
                                    setDateTimeFilters((prev) => {
                                      prev.start = e;
                                      return prev;
                                    });
                                    handleFiltersChange(elm.name, e, "start");
                                  } else {
                                    setDateTimeFilters((prev) => {
                                      prev.start = null;
                                      return prev;
                                    });
                                    handleFiltersChange(elm.name, "");
                                  }
                                }}
                                onClear={() => {
                                  setDateTimeFilters((prev) => {
                                    prev.start = null;
                                    return prev;
                                  });
                                  handleFiltersChange(elm.name, "");
                                }}
                              />
                            </div>
                          </div>
                          <div key={`${elm.name}-end-${i}`} className="flex">
                            <div className={"flex items-end gap-1 w-full"}>
                              <DatePicker.DateTimepicker
                                amPm={false}
                                inputPrefix={"по:"}
                                noConfirmBtn
                                inputFormat={"DD.MM.YYYY HH:mm"}
                                size={"xs"}
                                initialTime={{ hours: 23, minutes: 59 }}
                                value={dateTimeFilters.end}
                                maxDate={dayjs(new Date())
                                  .add(0, "day")
                                  .toDate()}
                                placeholder={"__.__.__"}
                                onChange={(e) => {
                                  if (e != null) {
                                    setDateTimeFilters((prev) => {
                                      prev.end = e;
                                      return prev;
                                    });
                                    handleFiltersChange(elm.name, e, "end");
                                  } else {
                                    setDateTimeFilters((prev) => {
                                      prev.end = null;
                                      return prev;
                                    });
                                    handleFiltersChange(elm.name, "");
                                  }
                                }}
                                onClear={() => {
                                  setDateTimeFilters((prev) => {
                                    prev.end = null;
                                    return prev;
                                  });
                                  handleFiltersChange(elm.name, "");
                                }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {elm.type === TypeFilter.INPUT && (
                        <div key={`${elm.name}-${i}`}>
                          <h6 style={{ fontSize: "12px" }}>{elm.label}</h6>
                          <Input
                            size="xs"
                            value={elm.value}
                            placeholder={elm.placeholder || ""}
                            onChange={(e) => {
                              handleFiltersChange(elm.name, e.target.value);
                            }}
                          />
                        </div>
                      )}
                      {elm.type === TypeFilter.NUMBER && (
                        <div key={`${elm.name}-${i}`}>
                          <h6 style={{ fontSize: "12px" }}>{elm.label}</h6>
                          <Input
                            size="xs"
                            value={elm.value}
                            type="number"
                            placeholder={elm.placeholder || ""}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              handleFiltersChange(elm.name, e.target.value);
                            }}
                          />
                        </div>
                      )}
                      {elm.type === TypeFilter.SELECT && (
                        <div key={`${elm.name}-${i}`}>
                          <h6 style={{ fontSize: "12px" }}>{elm.label}</h6>
                          <Select
                            size="xs"
                            value={singleDropDownCheckBoxVal as any}
                            options={options as any}
                            placeholder={elm.label || ""}
                            closeMenuOnSelect={true}
                            hideSelectedOptions={false}
                            noOptionsMessage={() => t(`select.noOptions`)}
                            onChange={(item) => {
                              elm.value = item?.value;
                              handleFiltersChange(elm.name, item?.value);
                            }}
                          />
                        </div>
                      )}
                      {elm.type === TypeFilter.CHECKBOX && (
                        <div key={`${elm.name}-${i}`}>
                          <h6 style={{ fontSize: "12px" }}>{elm.label}</h6>
                          <Select
                            size="xs"
                            menuPlacement={"auto"}
                            isMulti
                            value={dropdownCheckboxVal}
                            menuPortalTarget={document.body}
                            options={options}
                            placeholder={elm.placeholder || ""}
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            noOptionsMessage={() => t(`select.noOptions`)}
                            components={{
                              ValueContainer,
                            }}
                            onChange={(items, value) => {
                              if (value.action === "clear") {
                                handleFiltersChange(elm.name, "all");
                              }
                              if (
                                value.action === "select-option" &&
                                value.option?.value === "all"
                              ) {
                                handleFiltersChange(
                                  elm.name,
                                  transformOptionsToString(
                                    options.filter((el) => el.value !== "all"),
                                  ),
                                );
                              } else {
                                let sendedVal = "";
                                for (let i = 0; i < items.length; i++) {
                                  if (items[i].value === "all") {
                                    continue;
                                  }
                                  if (i === 0 && items[i].value !== "all") {
                                    sendedVal = `${items[i].value}`;
                                  } else {
                                    sendedVal = `${sendedVal},${items[i].value}`;
                                  }
                                }
                                handleFiltersChange(
                                  elm.name,
                                  items.map((el) => el.value).join(","),
                                );
                              }
                            }}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
                <div className="xl:col-span-4 lg:col-span-3 md:col-span-2 col-span-1">
                  {textConst === TableTextConst.TRANSFER &&
                    permissions[reportKey] && (
                      <Button
                        size="xs"
                        loading={loadingReport || reportLinkLoading}
                        variant="solid"
                        className="float-right ml-2"
                        onClick={fetchCreateReport}
                      >
                        {t("global.requestReport")}
                      </Button>
                    )}
                  {/* {collapse &&
                  textConst === TableTextConst.TRANSFER &&
                  !isVisibleElement && (
                    <div
                      aria-disabled={true}
                      className="flex items-center float-left"
                    >
                      <Pagination
                        pageSize={tableData.pageSize}
                        currentPage={tableData.pageIndex}
                        total={data?.paginate?.total || 0}
                        onChange={handlePaginationChange}
                      />
                      <p>Всего записей: {data?.paginate?.total || 0}</p>
                    </div>
                  )} */}
                  <Button
                    size="xs"
                    className="float-right ml-2"
                    onClick={applyFilters}
                  >
                    {t("global.applyFilters")}
                  </Button>
                  <Button
                    size="xs"
                    className="float-right"
                    onClick={handleResetAllFilters}
                  >
                    {t("global.resetAllFilters")}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {noTab ? (
          <DataTable<T>
            collapseHeight={activeHeight || 0}
            totalEntity={data?.paginate?.total || 0}
            transaction={textConst === TableTextConst.TRANSFER}
            noCheckBoxes={noCheckBoxes}
            setSelectedRowsData={setSelectedRowsData}
            columns={currentColumns}
            selectable
            data={data?.data || []}
            loading={loading}
            pagingData={{
              total: tableData.total,
              pageIndex: tableData.pageIndex,
              pageSize: tableData.pageSize,
            }}
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={onRowSelect}
          />
        ) : (
          <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}>
            <TabList>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <>
                    <TabNav value={TypeTab.ACTIVE}>
                      {t("tabsText.active")}
                    </TabNav>
                    <TabNav value={TypeTab.BASKET}>
                      {t("tabsText.basket")}
                    </TabNav>
                  </>
                  {!noBtn && (
                    <div className="flex justify-between py-2 w-full">
                      <Input
                        size="xs"
                        style={{ maxWidth: "320px" }}
                        placeholder={t("global.search")}
                        className="max-w-80"
                        onChange={debounce(async (e) => {
                          setInputSearch(e.target.value);
                        }, 500)}
                      />

                      {/* {permissions[createKey] && ( */}
                      <Button
                        size="xs"
                        className="float-right"
                        icon={<HiPlus />}
                        onClick={() => {
                          //@ts-ignore
                          handleOpenDrawer("create");
                          dispatch(setDrawerState(true));
                          // navigate(`${routePrefix[textConst]}/creat-new`);
                        }}
                      >
                        {t(`${textConst}Page.buttons.createNew`)}
                      </Button>
                      {/* )} */}
                    </div>
                  )}
                </div>
                {currentTab === TypeTab.ACTIVE &&
                  selectedRowsData.length > 0 && (
                    <Tooltip title={t(`tooltip.${textConst}.delete`)}>
                      <Button
                        shape="circle"
                        variant="plain"
                        size="xs"
                        icon={
                          <HiTrash style={{ width: "30px", height: "30px" }} />
                        }
                        onClick={() => handleDeleteMass(selectedRowsData)}
                      />
                    </Tooltip>
                  )}
                {currentTab === TypeTab.BASKET &&
                  selectedRowsData.length > 0 && (
                    <Tooltip title={t(`tooltip.${textConst}.recovery`)}>
                      <Button
                        shape="circle"
                        variant="plain"
                        size="xs"
                        icon={<RestoreMassSvg />}
                        onClick={() => handleRecoveryMass(selectedRowsData)}
                      />
                    </Tooltip>
                  )}
              </div>
            </TabList>
            <div className="py-4">
              <TabContent value={TypeTab.ACTIVE}>
                <DataTable<T>
                  collapseHeight={activeHeight || 0}
                  totalEntity={data?.paginate?.total || 0}
                  transaction={textConst === TableTextConst.TRANSFER}
                  noCheckBoxes={noCheckBoxes}
                  setSelectedRowsData={setSelectedRowsData}
                  columns={currentColumns}
                  selectable
                  data={data?.data || []}
                  loading={loading}
                  pagingData={{
                    total: tableData.total,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                  }}
                  onPaginationChange={handlePaginationChange}
                  onSelectChange={handleSelectChange}
                  onSort={handleSort}
                  onCheckBoxChange={onRowSelect}
                />
              </TabContent>
              <TabContent value={TypeTab.BASKET}>
                <DataTable<T>
                  collapseHeight={activeHeight || 0}
                  totalEntity={data?.paginate?.total || 0}
                  transaction={textConst === TableTextConst.TRANSFER}
                  noCheckBoxes={noCheckBoxes}
                  setSelectedRowsData={setSelectedRowsData}
                  columns={currentColumns}
                  selectable
                  data={data?.data || []}
                  loading={loading}
                  pagingData={{
                    total: tableData.total,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                  }}
                  onPaginationChange={handlePaginationChange}
                  onSelectChange={handleSelectChange}
                  onSort={handleSort}
                  onCheckBoxChange={onRowSelect}
                />
              </TabContent>
            </div>
          </Tabs>
        )}

        <Drawer
          title={
            drawerType === "card"
              ? `Информация`
              : t(`${textConst}Page.buttons.createNew`)
          }
          isOpen={isOpenDrawer}
          placement={direction === "rtl" ? "left" : "right"}
          width={
            textConst === TableTextConst.REALESTATEBUILDING ||
            textConst === TableTextConst.OFFER ||
            textConst === TableTextConst.SCRIPT
              ? 775
              : 575
          }
          onClose={() => dispatch(setDrawerState(false))}
          onRequestClose={() => dispatch(setDrawerState(false))}
        >
          <div>
            <DrawerContent
              item={selectedId}
              onClose={() => dispatch(setDrawerState(false))}
            />
          </div>
        </Drawer>
      </div>
    </Card>
  );
}

const TablePage = _TablePage as <T>(
  props: TablePageProps<T>,
) => ReturnType<typeof _TablePage>;

export default TablePage;
