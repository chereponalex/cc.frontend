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
import staticDataDaily from "@/views/Rating/staticDataDaily";
import { Filter, TypeFilter } from "@/@types";
import { DatePicker, Select, toast } from "../ui";
import { ValueContainerProps, components } from "react-select";
import { ToastType } from "@/@types/toast";
import Notification from "@/components/ui/Notification";
import { useLazyGetRatingQuery } from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import getColumnStyles from "@/utils/getColumnsWidth";
import timezoneClient from "@/utils/timezone";
import { RequestFilterType } from "@/@types/requestRtk";
import { HiPhoneArrowUpRight } from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "@/store";
import Card from "@/components/ui/Card";
import { setEntityRating, setValueFilterLead } from "@/store/slices/entities";
import cutString from "@/utils/cutString";
import dayjs from "dayjs";

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
      return (
        <>
          <h6 style={{ fontSize: "12px" }}>{element.label}</h6>
          <DatePicker
            size="xs"
            inputFormat={"DD-MM-YYYY"}
            maxDate={dayjs(new Date()).add(0, "day").toDate()}
            value={value || (new Date() as any)}
            placeholder={element.placeholder || ""}
            onChange={(e) => {
              onChange(element.name, e);
            }}
          />
        </>
      );
    default:
      return null;
  }
};

const TableRatingDaily = () => {
  const dispatch = useAppDispatch();
  const dataRedux = useAppSelector((state) => state.entities.rating);
  const myCountRedux = useAppSelector((state) => state.entities.rating.myCount);
  const { t } = useTranslation();
  const [dataArray, setDataArray] = useState<any>([]);
  const [filterData, setFilterData] = useState<FilterData[]>([]);
  const [selectedFilterData, setSelectedFilterData] = useState<{
    [key: string]: string;
  }>({});
  const filtersRef = useRef({} as { [key: string]: string });
  const [getRating, { data: rating = null, isLoading, isFetching }] =
    useLazyGetRatingQuery();

  useEffect(() => {
    dispatch(setEntityRating(rating));
  }, [rating]);

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  useEffect(() => {
    const groupsById: any = {};
    staticDataDaily.forEach((group) => {
      groupsById[group.id] = { ...group, managers: [] };
    });
    setFilterData((prev) => {
      if (!Array.isArray(dataRedux?.filters)) {
        return prev;
      }
      return dataRedux?.filters?.map((el: any) => ({ ...el, value: "" })) || [];
    });
    if (dataRedux.data?.length > 0) {
      const result = Object.values(groupsById)
        .map((group: any) => {
          const matchingManagers = dataRedux.data
            ?.filter((manager: any) => {
              // if (group.id === 21) {
              //   return manager.count > 20;
              // } else if (group.id === 20) {
              //   return manager.count === 20;
              // }
              if (group.id === 15) {
                return manager.count >= 15;
              } else if (group.id === 10) {
                return manager.count >= 10 && manager.count < 15;
              } else if (group.id === 5) {
                return manager.count >= 5 && manager.count < 10;
              } else if (group.id === 4) {
                return manager.count >= 1 && manager.count < 5;
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
  }, [dataRedux.data]);

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

  const dynamicColors = (count: number) => {
    if (count >= 0 && count < 5) {
      return "#FFFF";
    } else if (count >= 5 && count < 10) {
      return "#ff8f9d";
    } else if (count >= 10 && count < 15) {
      return "#8fff9a";
    } else if (count >= 15) {
      return "#de8ffa";
    }

    // else if (myCountRedux === 20) {
    //   return "#8fff9a";
    // } else if (myCountRedux >= 20) {
    //   return "#de8ffa";
    // }
  };

  const fetchData = async (
    filters: { [key: string]: string },
    reqType: RequestFilterType = "GET",
  ) => {
    try {
      const transformedParams: { [key: string]: any } = {};
      for (const [key, value] of Object.entries(filters || {})) {
        if (filters.hasOwnProperty(key)) {
          if (!value || value === "all") continue;
          if (key === "date") {
            transformedParams[key] = timezoneClient(filters[key]);
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
      const result = await getRating({
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
        dispatch(setValueFilterLead([value]));
      } else {
        dispatch(
          setValueFilterLead(value.split(",").filter((el: string) => el)),
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
      // {
      //   header: t("table.columnsHeader.accruals"),
      //   accessorKey: "accruals",
      //   cell: (props) => {
      //     return (
      //       <div key={props.row.id} className="container">
      //         {props.row.original.accruals}
      //       </div>
      //     );
      //   },
      // },
      // {
      //   header: t("table.columnsHeader.summa_one_transfer"),
      //   accessorKey: "summa_one_transfer",
      //   cell: (props) => {
      //     return <>{props.row.original.summa_one_transfer}</>;
      //   },
      // },
      // {
      //   header: t("table.columnsHeader.summa_one_hour"),
      //   accessorKey: "summa_one_hour",
      //   cell: (props) => {
      //     return <>{props.row.original.summa_one_hour}</>;
      //   },
      // },
      // {
      //   header: t("table.columnsHeader.chances"),
      //   accessorKey: "chances",
      //   cell: (props) => {
      //     return <>{props.row.original.chances}</>;
      //   },
      // },
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
    [dataRedux.data, dataArray, myCountRedux],
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
                  <p className="whitespace-nowrap">Всего переводов за день:</p>
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
                  <p className="whitespace-nowrap">Мои переводы за день:</p>
                  <div style={{ width: "20px", height: "20px" }}>
                    <Loading loading={isFetching}>
                      <p
                        className="text-sm"
                        style={{ fontSize: "16px", fontWeight: 700 }}
                      >
                        {myCountRedux}
                      </p>
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

export default TableRatingDaily;
