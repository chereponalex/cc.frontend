import Table from "@/components/ui/Table";
import {
  ColumnDef,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import { HiBarsArrowDown, HiBarsArrowUp } from "react-icons/hi2";
import Checkbox from "@/components/ui/Checkbox";
import "../../views/ManagerPage/index.css";
import { useSearchParams } from "react-router-dom";
import { TypeRightSideTab } from "@/@types/tabs";
import { Tooltip } from "@/components/ui/Tooltip";
import sortPrices from "@/utils/sortPrices";
import { useAppSelector } from "@/store";
// import { TypeObject } from "@/@types/manager";

const { Tr, Th, Td, THead, TBody } = Table;

const TableELement = memo(
  ({
    elements,
    checked,
    setChecked,
    setInfoScript,
    setClientInformation,
  }: any) => {
    const { t } = useTranslation();
    const [queryParams, _] = useSearchParams();
    const roominess = queryParams.get("roominess")?.split(",");
    const getRowData = (rowId: string) => {
      if (!checked[rowId]) {
        setInfoScript(
          elements?.find((object: FlatOrApartment) => object.id === rowId),
        );
      } else {
        setInfoScript(null);
        setClientInformation((prev: any) => {
          prev.object = {};
          return prev;
        });
      }
      setChecked((prev: any) => {
        return { [rowId]: !prev[rowId] };
      });
    };

    const columns = useMemo<ColumnDef<any>[]>(
      () => [
        {
          header: t("table.columnsHeader.check"),
          accessorKey: "check",
          cell: (props) => {
            return (
              <div className="flex">
                <Checkbox
                  style={{
                    width: "14px",
                    height: "14px",
                    borderColor: "#9ca3af",
                  }}
                  checked={!!checked[props.row.original.id]}
                />
              </div>
            );
          },
        },
        {
          header: t("table.columnsHeader.roominess"),
          accessorKey: "roominess",
          cell: (props) => {
            const copyData = JSON.parse(JSON.stringify(props.row.original));
            if (
              copyData?.type.key === "APARTMENTS" &&
              copyData?.roominess?.key !== "C"
            ) {
              copyData.roominess.value = copyData.roominess.value.replace(
                "комнатная",
                "комнатные",
              );
            }
            return (
              <div style={{ fontSize: "14px" }}>
                {copyData?.roominess.value}
              </div>
            );
          },
        },
        {
          header: t("table.columnsHeader.price"),
          accessorKey: "price",
          cell: (props) => {
            return (
              <div style={{ fontSize: "14px", whiteSpace: "nowrap" }}>
                от {props.row.original.price} ₽
              </div>
            );
          },
        },
        {
          header: t("table.columnsHeader.per_meters"),
          accessorKey: "price_per_meter",
          cell: (props) => {
            return (
              <Tooltip title={`${props.row.original.price_per_meter} ₽/м²`}>
                <div style={{ fontSize: "14px", whiteSpace: "nowrap" }}>
                  от {props.row.original.square} м²
                </div>
              </Tooltip>
            );
          },
        },
      ],
      [checked],
    );

    const table: any = useReactTable({
      columns,
      data: elements?.sort(sortPrices),
      getCoreRowModel: getCoreRowModel(),
    });

    return (
      <Table noScrolling>
        <THead
          style={{
            display: "none",
          }}
        >
          {table.getHeaderGroups().map((headerGroup: any) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => {
                return (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ textAlign: "start" }}
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
        <TBody className="text-center">
          {table.getRowModel().rows.map((row: any) => {
            return (
              <Tr
                key={row.id}
                className={`cursor-pointer`}
                style={{
                  borderLeft: checked[row.original.id] && "0.1px solid #0a880a",
                  borderRight:
                    checked[row.original.id] && "0.1px solid #0a880a",
                  borderRadius: checked[row.original.id] && "2px",
                  background: roominess?.includes(row.original.roominess.key)
                    ? "rgba(202, 197, 197, 0.3)"
                    : "transparent",
                  outline: checked[row.original.id] && "1px solid #0a880a",
                }}
                onClick={() => getRowData(row.original.id)}
              >
                {row.getVisibleCells().map((cell: any) => {
                  return (
                    <Td
                      key={cell.id}
                      style={{
                        padding: "2px",
                        textAlign: "start",
                        // whiteSpace: "nowrap"
                      }}
                    >
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
    );
  },
);

export const TableObjectsMap = ({
  data,
  setInfoScript,
  setClientInformation,
  currentTab,
  checked,
  setChecked,
}: any) => {
  const [isOpenTable, setIsOpenTable] = useState<Record<string, boolean>>({});
  const [queryParams, _] = useSearchParams();
  const deadlineFilterKey = queryParams.get("deadline");
  const sessionCallId = useAppSelector(
    (state) => state.uis?.uisInfo?.call_session_id,
  );
  const callBegin = useAppSelector((state) => state.uis?.uisEvent);

  const convertArrToTable = (apiData: any) => {
    const group = apiData?.map((el: any) => {
      return {
        ...el,
        group: `${el.deadline.value}/${el.finishing.value}/${el.type.value}`,
      };
    });

    let result: any = {};
    group?.forEach((el: any) => {
      if (result[el.group]) {
        result[el.group].push(el);
      } else {
        result[el.group] = [el];
      }
    });

    return Object.entries(result).map(([key, value]: any) => {
      const [deadlineKey, finishingKey, typeKey] = key.split("/");
      return {
        deadlineKey,
        finishingKey,
        typeKey,
        items: value,
      };
    });
  };

  const memoData = useMemo(() => {
    return convertArrToTable(data);
  }, [data, deadlineFilterKey]);

  useEffect(() => {
    setChecked({});
  }, [queryParams]);

  useEffect(() => {
    const newState: any = {};
    memoData.forEach((el, index) => {
      newState[index] = true;
    });
    setIsOpenTable(newState);
  }, []);

  const openTable = (deadLineId: number) => {
    setIsOpenTable((prev: any) => ({
      ...prev,
      [deadLineId]: !prev[deadLineId],
    }));
  };

  return (
    <div
      style={{
        display: currentTab === TypeRightSideTab.TRANSFER ? "none" : "block",
      }}
      className="mb-2"
    >
      {memoData
        // ?.filter((deadline: any) => {
        //   if (deadlineFilterKey !== null) {
        //     return (
        //       new Date(deadline.deadLineKey) <= new Date(deadlineFilterKey)
        //     );
        //   } else {
        //     return deadline;
        //   }
        // })
        ?.map((el: any, index: number) => {
          return (
            <div>
              <div key={index} className={`mt-3`}>
                <h6
                  className="flex items-center justify-between cursor-pointer mb-1"
                  style={{ fontSize: "12px", flexWrap: "wrap" }}
                  onClick={() => openTable(index)}
                >
                  <div className="mr-1 flex items-center">
                    {isOpenTable[index] ? (
                      <HiBarsArrowDown size={16} />
                    ) : (
                      <HiBarsArrowUp size={16} />
                    )}
                    <p
                      style={{ fontSize: "14px", whiteSpace: "nowrap" }}
                      className="ml-1"
                    >
                      {el.deadlineKey}
                    </p>
                  </div>
                  <div className="flex">
                    <div
                      style={{
                        fontSize: "14px",
                        border: `1px solid ${
                          el.typeKey === "Квартира" ? "#0a880a" : "#d73d3d"
                        }`,
                        color: `${
                          el.typeKey === "Квартира" ? "#0a880a" : "#d73d3d"
                        }`,
                        borderRadius: "5px",
                        padding: "0 5px 0 5px",
                        marginRight: "5px",
                      }}
                    >
                      {el.typeKey}
                    </div>
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        fontSize: "14px",
                        color: `${
                          el.finishingKey === "С ремонтом"
                            ? "#7c3aed"
                            : el.finishingKey === "Предчистовая отделка"
                              ? "#ffda49"
                              : el.finishingKey === "Без отделки"
                                ? "rgba(202, 197, 197)"
                                : "none"
                        }`,
                        border: `1px solid ${
                          el.finishingKey === "С ремонтом"
                            ? "#7c3aed"
                            : el.finishingKey === "Предчистовая отделка"
                              ? "#ffda49"
                              : el.finishingKey === "Без отделки"
                                ? "rgba(202, 197, 197)"
                                : "none"
                        }`,
                        borderRadius: "5px",
                        padding: "0 5px 0 5px",
                      }}
                    >
                      {el.finishingKey}
                    </span>
                  </div>
                </h6>
                <div>
                  {isOpenTable[index] && (
                    <TableELement
                      index={index}
                      checked={checked}
                      setChecked={setChecked}
                      elements={el.items}
                      setInfoScript={setInfoScript}
                      setClientInformation={setClientInformation}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
