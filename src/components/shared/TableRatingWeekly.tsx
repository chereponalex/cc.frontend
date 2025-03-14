import Table from "@/components/ui/Table";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import "../../views/Rating/index.css";
import staticDataWeekly from "@/views/Rating/staticDataWeekly";
import { Filter, TypeFilter } from "@/@types";
import { DatePicker, Select, toast } from "../ui";
import { ValueContainerProps, components } from "react-select";
import { ToastType } from "@/@types/toast";
import Notification from "@/components/ui/Notification";
import { useLazyGetRatingWeeklyQuery } from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import getColumnStyles from "@/utils/getColumnsWidth";
import { RequestFilterType } from "@/@types/requestRtk";
import { HiPhoneArrowUpRight } from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "@/store";
import Card from "@/components/ui/Card";
import cutString from "@/utils/cutString";
import getWeekRange from "@/utils/getWeekRange";
import {
  setEntityRatingWeekly,
  setValueFilterLeadWeekly,
} from "@/store/slices/entities/ratingWeeklySlice";

const { Tr, Th, Td, THead, TBody } = Table;
interface FilterData extends Filter {
  value: string;
  name: string;
}

const ValueContainer = ({
  children,
  ...props
}: ValueContainerProps<{
  value: string;
  label: string;
}>) => {
  if (!Array.isArray(children)) {
    return null;
  }
  const [values, input] = children as any[];
  let displayedValue;
  if (values.length === 1) {
    displayedValue = values[0].props.data.label;
  } else {
    const pluralEnding = values.length === 2 ? "а" : "о";
    displayedValue = `${values.length} выбран${pluralEnding}`;
  }
  return (
    <>
      <components.ValueContainer {...props}>
        <p style={{ fontSize: "13px" }}>{cutString(displayedValue, 25)}</p>
        <div className="">{input}</div>
      </components.ValueContainer>
    </>
  );
};

const ElementTypeComponent = ({
  element,
  value,
  onChange,
}: {
  element: any /* {
    name: string;
    type: string;
    options: { value: string; label: string }[] | any;
    label: string;
    placeholder?: string;
  } */;
  value: string | null;
  onChange: (key: string, value: any) => void;
}) => {
  const { t } = useTranslation();
  switch (element.type) {
    case TypeFilter.CHECKBOX:
      const options = element.options.filter(
        (option: { value: string; label: string }) => option.value,
      );
      options.unshift({ value: "all", label: "Все" });
      const dropdownCheckboxVal = options.filter(
        (el: { value: string; label: string }) => value?.includes(el.value),
      );
      return (
        <div style={{ width: "100%" }}>
          <h6 style={{ fontSize: "12px" }}>{element.label}</h6>
          <Select
            size="xs"
            placeholder=""
            isMulti
            value={
              dropdownCheckboxVal.length > 0
                ? dropdownCheckboxVal
                : [{ value: "all", label: "Все" }]
            }
            options={options}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            noOptionsMessage={() => t(`select.noOptions`)}
            components={{ ValueContainer }}
            onChange={(items, value) => {
              if (items.length === 0) {
                onChange(element.name, "all");
              }
              if (
                value.action === "select-option" &&
                value.option?.value === "all"
              ) {
                onChange(element.name, "all");
              } else {
                let sendedVal = "";
                for (let i = 0; i < items.length; i++) {
                  if (items[i].value === "all") {
                    continue;
                  }
                  if (i === 0) {
                    sendedVal = `${items[i].value}`;
                  } else {
                    sendedVal = `${sendedVal},${items[i].value}`;
                  }
                }
                onChange(element.name, sendedVal);
              }
            }}
          />
        </div>
      );

    case TypeFilter.DATE_PICKER:
      const weekRange = getWeekRange(new Date());
      return (
        <>
          <h6 style={{ fontSize: "12px" }}>{element.label}</h6>
          <DatePicker.DatePickerRange
            allWeekSelected
            size="xs"
            singleDate={true}
            inputFormat={"DD.MM.YYYY"}
            value={
              (value && value[0] != null ? value : weekRange) as [Date, Date]
            }
            placeholder={element.placeholder || ""}
            onChange={(e) => {
              const dateArray = e[0] ? e : weekRange;
              onChange(element.name, dateArray);
            }}
          />
        </>
      );
    default:
      return null;
  }
};

const TableRatingWeekly = () => {
  const dispatch = useAppDispatch();
  const dataReduxWeekly = useAppSelector(
    (state) => state.entities.ratingWeekly,
  );
  const myCountRedux = useAppSelector(
    (state) => state.entities.ratingWeekly.myCount,
  );
  const { t } = useTranslation();
  const [dataArray, setDataArray] = useState<any>([]);
  const [filterData, setFilterData] = useState<FilterData[]>([]);
  const [selectedFilterData, setSelectedFilterData] = useState<{
    [key: string]: string;
  }>({});
  const filtersRef = useRef({} as { [key: string]: string });
  const [
    getRatingWeekly,
    { data: ratingWeekly = null, isLoading, isFetching },
  ] = useLazyGetRatingWeeklyQuery();

  useEffect(() => {
    dispatch(setEntityRatingWeekly(ratingWeekly));
  }, [ratingWeekly]);

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  useEffect(() => {
    const groupsById: any = {};
    staticDataWeekly.forEach((group) => {
      groupsById[group.id] = { ...group, managers: [] };
    });
    setFilterData((prev) => {
      if (!Array.isArray(dataReduxWeekly?.filters)) {
        return prev;
      }
      return (
        dataReduxWeekly?.filters?.map((el: any) => ({ ...el, value: "" })) || []
      );
    });
    if (dataReduxWeekly.data?.length > 0) {
      const result = Object.values(groupsById)
        .map((group: any) => {
          const matchingManagers = dataReduxWeekly.data
            ?.filter((manager: any) => {
              if (group.id === 75) {
                return manager.count >= 75;
              } else if (group.id === 50) {
                return manager.count >= 50 && manager.count < 75;
              } else if (group.id === 25) {
                return manager.count >= 25 && manager.count < 50;
              } else if (group.id === 24) {
                return manager.count >= 1 && manager.count < 25;
              } else {
                return false;
              }
            })
            .sort((a: any, b: any) => b.count - a.count);
          return { ...group, managers: matchingManagers };
        })
        .sort((a, b) => b.id - a.id);
      setDataArray(result);
    } else {
      setDataArray(
        Object.values(groupsById).sort((a: any, b: any) => b.id - a.id),
      );
    }
  }, [dataReduxWeekly.data]);

  const total = useMemo(() => {
    return dataArray.reduce((acc: number, current: any) => {
      if (current?.managers && current?.managers?.length > 0) {
        return (
          acc +
          current.managers.reduce(
            (innerAcc: number, manager: any) => innerAcc + manager.count,
            0,
          )
        );
      } else {
        return acc;
      }
    }, 0);
  }, [dataArray]);

  const coeffPayout = useMemo(() => {
    if (myCountRedux === 0) {
      return 0;
    }

    const foundItem = staticDataWeekly.find((item) => {
      const id = item.id;
      if (myCountRedux >= 1 && myCountRedux < 25) {
        return id >= 1 && id < 25;
      } else if (myCountRedux >= 25 && myCountRedux < 50) {
        return id >= 25 && id < 50;
      } else if (myCountRedux >= 50 && myCountRedux < 75) {
        return id >= 50 && id < 75;
      } else if (myCountRedux >= 75) {
        return id >= 75;
      } else {
        return false;
      }
    });

    if (foundItem) {
      const summa = foundItem.summa_one_transfer;
      if (typeof summa === "string") {
        const numericSummaString = summa.slice(0, -1);
        const numericSumma = Number(numericSummaString);
        if (!isNaN(numericSumma)) {
          return numericSumma;
        } else {
          console.error(
            "Не удалось преобразовать summa_one_transfer в число:",
            summa,
          );
          return 0;
        }
      } else {
        console.error(
          "summa_one_transfer не является строкой или пустая:",
          summa,
        );
        return 0;
      }
    } else {
      return 0;
    }
  }, [myCountRedux, dataReduxWeekly]);

  const dynamicColors = (count: number) => {
    if (count >= 0 && count < 25) {
      return "#FFFF";
    } else if (count >= 25 && count < 50) {
      return "#ff8f9d";
    } else if (count >= 50 && count < 75) {
      return "#8fff9a";
    } else if (count >= 75) {
      return "#de8ffa";
    }
  };

  const fetchData = async (
    filters: { [key: string]: string },
    reqType: RequestFilterType = "GET",
  ) => {
    try {
      const transformedParams: { [key: string]: any } = {};
      const weekRange = getWeekRange(new Date());
      transformedParams.date = {
        start: weekRange[0].toISOString(),
        end: weekRange[1].toISOString(),
      };
      for (const [key, value] of Object.entries(filters || {})) {
        if (filters.hasOwnProperty(key)) {
          if (!value || value === "all") continue;
          if (key === "date") {
            transformedParams.date = {
              start: new Date(value[0]).toISOString(),
              end: new Date(value[1]).toISOString(),
            };
          }
          if (key === "team_leader[]") {
            const values = filters[key].split(",");
            transformedParams[key] = [];
            values.forEach((value: any) => {
              transformedParams[key].push(value);
            });
          }
        }
      }
      const result = await getRatingWeekly({
        body: transformedParams,
        method: reqType,
      }).unwrap();
    } catch (error: any) {
      console.log(error);
      openNotification(ToastType.WARNING, error?.message);
    }
  };

  const prepareFilters = (filters: FilterData[]) => {
    let res: { [key: string]: string } = {};
    if (filters?.length) {
      filters.map((el: any) => {
        if (el.value !== "") {
          res[`${el.name}`] = el.value;
        }
      });
    }
    return res;
  };

  useEffect(() => {
    fetchData(filtersRef.current);
  }, []);
  const handleFiltersChange = (key: string, value: any) => {
    let updateFilters: { [key: string]: string } = {};
    setFilterData((prevData) => {
      updateFilters = prepareFilters([
        ...prevData.map((el) => {
          return el.name === key ? { ...el, value } : el;
        }),
      ]);
      return [
        ...prevData.map((el) => {
          return el.name === key ? { ...el, value } : el;
        }),
      ];
    });
    if (key === "team_leader[]") {
      if (value === "all") {
        dispatch(setValueFilterLeadWeekly([value]));
      } else {
        dispatch(
          setValueFilterLeadWeekly(value.split(",").filter((el: string) => el)),
        );
      }
    }
    filtersRef.current = { ...filtersRef.current, ...updateFilters };
    setSelectedFilterData(filtersRef.current);
    fetchData(filtersRef.current);
  };

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: `${t("table.columnsHeader.lead-up")}`,
        accessorKey: "teamLeader",
        cell: (props) => {
          return <>{props.row.original.title}</>;
        },
      },
      {
        header: t("table.columnsHeader.accruals"),
        accessorKey: "accruals",
        cell: (props) => {
          return (
            <div key={props.row.id} className="container">
              {props.row.original.accruals}
            </div>
          );
        },
      },
      {
        header: t("table.columnsHeader.summa_one_transfer"),
        accessorKey: "summa_one_transfer",
        cell: (props) => {
          return <>{props.row.original.summa_one_transfer}</>;
        },
      },
      // {
      //   header: t("table.columnsHeader.summa_one_hour"),
      //   accessorKey: "summa_one_hour",
      //   cell: (props) => {
      //     return <>{props.row.original.summa_one_hour}</>;
      //   },
      // },
      //   {
      //     header: t("table.columnsHeader.chances"),
      //     accessorKey: "chances",
      //     cell: (props) => {
      //       return <>{props.row.original.chances}</>;
      //     },
      //   },
      {
        header: t("table.columnsHeader.managers"),
        accessorKey: "managers",
        cell: (props) => {
          if (props.row.original?.managers?.length > 0) {
            return (
              <div className="container_managers">
                {props.row.original?.managers.map((manager: any) => {
                  return manager.employee ? (
                    <p>
                      {manager.employee?.int_id} - {manager.employee?.full_name}{" "}
                      ({manager.count})
                    </p>
                  ) : null;
                })}
              </div>
            );
          } else {
            return <>-</>;
          }
        },
      },
    ],
    [dataReduxWeekly.data, dataArray, myCountRedux],
  );
  const table: any = useReactTable({
    columns,
    data: dataArray,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex justify-center items-center">
      <div style={{ maxWidth: "720px", width: "100%" }}>
        <div className="flex flex-col justify-between sm:flex-row min-h-[120px]">
          <div className="grid grid-cols-1 gap-2 min-w-80">
            {filterData?.map((elm, i) => {
              return elm !== null ? (
                <div
                  key={`${elm.name}-${i}`}
                  className="mb-1 flex flex-col justify-end"
                >
                  <ElementTypeComponent
                    element={elm}
                    value={selectedFilterData[elm.name]}
                    onChange={(key: string, value: any) =>
                      handleFiltersChange(key, value)
                    }
                  />
                </div>
              ) : null;
            })}
          </div>
          <div className="flex flex-col justify-between min-w-[37%]">
            <Card bodyClass="card-body-padding">
              <div className="flex">
                <div className="flex items-center">
                  <Card bodyClass="card-body-padding">
                    <HiPhoneArrowUpRight size={25} />
                  </Card>
                </div>
                <div className="ml-3">
                  <p className="whitespace-nowrap">
                    Всего переводов за неделю:
                  </p>
                  <div style={{ width: "20px", height: "20px" }}>
                    <Loading loading={isFetching}>
                      <p
                        className="text-sm"
                        style={{ fontSize: "16px", fontWeight: 700 }}
                      >
                        {total}
                      </p>
                    </Loading>
                  </div>
                </div>
              </div>
            </Card>
            <Card bodyClass="card-body-padding">
              <div className="flex">
                <div className="flex items-center">
                  <Card
                    bodyClass="card-body-padding"
                    style={{
                      background: dynamicColors(myCountRedux),
                    }}
                  >
                    <HiPhoneArrowUpRight size={25} color="black" />
                  </Card>
                </div>
                <div className="ml-3">
                  <p className="whitespace-nowrap">Мои переводы за неделю:</p>
                  <div style={{ width: "20px", height: "20px" }}>
                    <Loading loading={isFetching}>
                      <p
                        className="text-sm whitespace-nowrap"
                        style={{ fontSize: "16px", fontWeight: 700 }}
                      >
                        {myCountRedux} ~ {myCountRedux * coeffPayout}₽
                      </p>
                      {/* {myCountRedux === 0
                          ? `${myCountRedux}`
                          : `${myCountRedux} от ${myCountRedux * coeffPayout}₽`} */}
                    </Loading>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <Loading loading={isFetching}>
          <Table noScrolling>
            <THead
              style={{
                whiteSpace: "nowrap",
                position: "sticky",
                top: 0,
                zIndex: 2,
                paddingBottom: "5px",
                border: "1px solid #1f2937",
              }}
            >
              {table.getHeaderGroups().map((headerGroup: any) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header: any) => {
                    return (
                      <Th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          textAlign: "center",
                          fontSize: "10px",
                          width: getColumnStyles(header.column.id),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </THead>
            <TBody className="text-start">
              {table.getRowModel().rows.map((row: any) => {
                return (
                  <Tr
                    key={row.id}
                    style={{
                      background: row.original.background,
                      color: "black",
                      border: "1px solid #1f2937",
                    }}
                  >
                    {row.getVisibleCells().map((cell: any) => {
                      return (
                        <Td key={cell.id} className="text-center">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
            </TBody>
          </Table>
        </Loading>
      </div>
    </div>
  );
};

export default TableRatingWeekly;
