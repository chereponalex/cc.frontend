import Table from "@/components/ui/Table";
import { ColumnDef } from "@tanstack/react-table";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import "../../views/Offers/index.css";
import { HiPencil } from "react-icons/hi";
import { Button, Input, toast } from "@/components/ui";
import InputMask from "react-input-mask";
import { useMask } from "@react-input/mask";
import { IoClose } from "react-icons/io5";
import { AiOutlineCheck } from "react-icons/ai";
import { useUpdateWorkTimeByIdMutation } from "@/services/RtkQueryService";
import { useParams } from "react-router-dom";
import { ToastType } from "@/@types/toast";
import { TableTextConst } from "@/@types";
import Notification from "@/components/ui/Notification";

const { Tr, Th, Td, THead, TBody } = Table;

interface OfferWorkHoursEditProps {
  startValue: string;
  setStartValue: Dispatch<SetStateAction<string>>;
  endValue: string;
  setEndValue: Dispatch<SetStateAction<string>>;
}

const OfferWorkHoursEdit = ({
  startValue,
  setStartValue,
  endValue,
  setEndValue,
}: OfferWorkHoursEditProps) => {
  const startTimeInputRef = useMask({
    mask: "чч:мм",
    replacement: { ч: /\d/, м: /\d/ },
  });
  const endTimeInputRef = useMask({
    mask: "чч:мм",
    replacement: { ч: /\d/, м: /\d/ },
  });
  const handleStartChange = (e) => {
    const value = e.target.value;
    setStartValue(value);
  };

  const handleEndChange = (e) => {
    const value = e.target.value;
    setEndValue(value);
  };
  return (
    <div className={"flex gap-[3px] items-center"}>
      <span className={"text-[11px]"}>с</span>
      <Input
        ref={startTimeInputRef}
        autoFocus={true}
        onChange={handleStartChange}
        value={startValue}
        className={"px-[5px]"}
        placeholder={"00:00"}
        size={"xxs"}
        style={{ maxWidth: "50px", borderWidth: 0 }}
      />
      <span>до</span>
      <Input
        ref={endTimeInputRef}
        value={endValue}
        onChange={handleEndChange}
        className={"px-[5px]"}
        size={"xxs"}
        placeholder={"00:00"}
        style={{ maxWidth: "50px", borderWidth: 0 }}
      />
    </div>
  );
};
const TableWorkHoursBindOffer = ({ data, refetch }: any) => {
  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };
  const { t } = useTranslation();
  const [dataArray, setDataArray] = useState<any>([]);
  const [workHoursItemEdit, setWorkHoursItemEdit] = useState("");
  const [startValue, setStartValue] = useState("");
  const [endValue, setEndValue] = useState("");
  const [updateWorkTime] = useUpdateWorkTimeByIdMutation();
  const { id } = useParams();
  useEffect(() => {
    if (workHoursItemEdit) {
      const currentDay = table
        .getRowModel()
        .rows.find((el) => +el.id === +workHoursItemEdit[0])?.original.time[0];
      if (currentDay) {
        setStartValue(currentDay.start);
        setEndValue(currentDay.end);
      }
    }
  }, [workHoursItemEdit]);
  const saveWorkTimeHandler = async () => {
    if (workHoursItemEdit && startValue && endValue) {
      const dayNumber = +workHoursItemEdit[0] + 1;
      const currentDay = table
        .getRowModel()
        .rows.find((el) => +el.id === dayNumber - 1).original;
      const daysList = table
        .getRowModel()
        .rows.map((el) => el.original)
        .map((day, idx) => {
          return {
            day: idx + 1,
            start: idx + 1 != dayNumber ? day.time[0].start : startValue,
            end: idx + 1 != dayNumber ? day.time[0].end : endValue,
          };
        });
      const workTimeData = {
        offer_id: id,
        days: daysList,
      };
      const workTimeId = data[currentDay.day][0].id;

      try {
        await updateWorkTime({
          id: workTimeId,
          ...workTimeData,
        }).unwrap();
        openNotification(
          ToastType.SUCCESS,
          t(`toast.message.${TableTextConst.WORK_TIME}.update`),
        );
        refetch().then(() => setWorkHoursItemEdit(""));
      } catch (error) {
        openNotification(
          ToastType.WARNING,
          (error as { message: string }).message,
        );
      }
    }
  };
  const onWorkTimeEdit = (id: string) => {
    setWorkHoursItemEdit(id);
  };
  useEffect(() => {
    const result = [];

    for (const day in data) {
      result.push({
        day: day,
        time: data[day].map((item: any) => ({
          start: item.start,
          end: item.end,
        })),
      });
    }
    setDataArray(result);
  }, [data]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: t("table.columnsHeader.daysOfTheWeek"),
        accessorKey: "day",
        cell: (props) => {
          return <>{props.row.original.day}</>;
        },
      },
      {
        header: t("table.columnsHeader.workTime"),
        accessorKey: "time",
        cell: (props) => {
          // console.log(props.row.id ,'props.row.original.id')
          return (
            <div key={props.row.id} className="container_work_time">
              {props.row.original.time?.map((time: any, index: number) => {
                return (
                  <div key={index} className="card_work_time">
                    <p className="mr-1">c {time.start}</p>
                    <p>до {time.end}</p>
                  </div>
                );
              })}
            </div>
          );
        },
      },
    ],
    [],
  );
  const table: any = useReactTable({
    columns,
    data: dataArray,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      style={{ display: "flex", maxWidth: "800px", justifyContent: "center" }}
    >
      <Table noScrolling>
        <THead
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            paddingBottom: "5px",
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
        <TBody className="text-start">
          {table.getRowModel().rows.map((row: any) => {
            return (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell: any) => {
                  if (cell.id.includes("time")) {
                    return (
                      <>
                        <Td key={cell.id}>
                          <div className={"flex justify-between items-center"}>
                            {workHoursItemEdit !== cell.id ? (
                              flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )
                            ) : (
                              <OfferWorkHoursEdit
                                startValue={startValue}
                                endValue={endValue}
                                setStartValue={setStartValue}
                                setEndValue={setEndValue}
                                key={cell.id}
                              />
                            )}
                            {workHoursItemEdit === cell.id ? (
                              <div className={"flex gap-1 items-center"}>
                                <Button
                                  shape="circle"
                                  variant="plain"
                                  size="md"
                                  icon={<IoClose size={15} />}
                                  onClick={() => setWorkHoursItemEdit("")}
                                />
                                <Button
                                  shape="circle"
                                  variant="plain"
                                  size="md"
                                  icon={<AiOutlineCheck size={15} />}
                                  onClick={saveWorkTimeHandler}
                                />
                              </div>
                            ) : (
                              <Button
                                shape="circle"
                                variant="plain"
                                size="md"
                                icon={<HiPencil size={15} />}
                                onClick={() => onWorkTimeEdit(cell.id)}
                              />
                            )}
                          </div>
                        </Td>
                      </>
                    );
                  }
                  return (
                    <Td key={cell.id}>
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
    </div>
  );
};

export default TableWorkHoursBindOffer;
