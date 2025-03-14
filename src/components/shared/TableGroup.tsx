import Table from "@/components/ui/Table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Button, Select } from "../ui";
import { HiPlus, HiTrash } from "react-icons/hi";
import { TableTextConst } from "@/@types";
import { Input } from "@/components/ui/Input";

const { Tr, Th, Td, THead, TBody } = Table;

const TableGroup = ({
  view,
  selectInfo,
  dataCollection,
  setDataColletion,
}: any) => {
  const selectEmployees = selectInfo?.employees || {};
  const selectStatuses = selectInfo?.statuses || {};

  const { t } = useTranslation();

  const addEmployee = () => {
    const newRow: any = {
      employee_id: "",
      status: "",
    };
    setDataColletion((prev: any) => {
      if (!prev) {
        return [newRow];
      } else return [...prev, newRow];
    });
  };

  const deleteEmployee = (index: number) => {
    setDataColletion((prev: any) => {
      return prev.filter((el: any, i: number) => index !== i);
    });
  };
  const optionsEmployees = useMemo(() => {
    const data = Object.entries(selectEmployees);
    return data.map(([id, value]) => ({
      label: value,
      value: id,
    }));
  }, [selectEmployees]);

  const optionsStatuses = useMemo(() => {
    const data = Object.entries(selectStatuses);
    return data.map(([id, value]) => ({
      label: value,
      value: id,
    }));
  }, [selectStatuses]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: t("table.columnsHeader.employees"),
        accessorKey: "employee_id",
        cell: (props) => {
          const label = selectEmployees[`${props.getValue()}`] || "";
          const valueObj = {
            value: props.getValue(),
            label: label,
          };
          return (
            <div style={{ width: "100%" }} className="flex justify-start">
              <Select
                size="xs"
                className="w-80"
                isDisabled={view}
                placeholder=""
                options={optionsEmployees as any}
                value={valueObj as any}
                onChange={(
                  employee: { value: string; label: string } | null,
                ) => {
                  if (employee) {
                    setDataColletion((prev: any) => {
                      let newState: any = [...prev];
                      newState[props.row.id] = {
                        ...newState[props.row.id],
                        employee_id: employee.value,
                      };
                      return newState;
                    });
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        header: t("table.columnsHeader.employee_role"),
        accessorKey: "role",
        cell: (props: any) => {
          return (
            <div style={{ width: "100%" }} className="flex justify-start">
              <Input
                className="w-64 disabled_question"
                size="xs"
                disabled={true}
                placeholder=""
                value={props.row.original?.role?.name}
              />
            </div>
          );
        },
      },
      {
        header: t("table.columnsHeader.employee_status"),
        accessorKey: "status",
        cell: (props) => {
          const label = selectStatuses[`${props.getValue()}`] || "";
          const statusInfo: any = props.getValue();
          const valueObj = {
            value: statusInfo?.key,
            label: label || statusInfo?.value,
          };
          return (
            <div style={{ width: "100%" }} className="flex justify-start">
              <Select
                className="w-64"
                size="xs"
                isDisabled={view}
                placeholder=""
                options={optionsStatuses as any}
                value={valueObj as any}
                onChange={(status: { value: string; label: string } | null) => {
                  if (status) {
                    setDataColletion((prev: any) => {
                      let newState: any = [...prev];
                      newState[props.row.id] = {
                        ...newState[props.row.id],
                        status: status.value,
                      };
                      return newState;
                    });
                  }
                }}
              />
            </div>
          );
        },
      },
      ...(!view
        ? [
            {
              header: "Удалить",
              accessorKey: "delete_employee",
              cell: (props: any) => {
                const rowIndex = props.row.index;
                return (
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      shape="circle"
                      variant="plain"
                      size="xs"
                      icon={<HiTrash />}
                      onClick={() => deleteEmployee(rowIndex)}
                    />
                  </div>
                );
              },
            },
          ]
        : []),
    ],
    [optionsEmployees, optionsStatuses, view],
  );

  const table: any = useReactTable({
    columns,
    data: dataCollection,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Table style={{ minWidth: "60%" }}>
        <THead
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            paddingBottom: "5px",
            // textAlign: "center"
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
        <TBody style={{ textAlign: "start" }}>
          {table.getRowModel().rows.map((row: any) => {
            return (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell: any) => {
                  return (
                    <Td
                      key={
                        cell.id
                      } /* style={{display: 'flex', justifyContent: "center"}} */ /* className="flex justify-center" */
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
        {!view && (
          <div
            style={{
              display: "flex",
              width: "100%",
              marginTop: "20px",
              borderTop: "0",
            }}
          >
            <Button
              size="xs"
              type="button"
              className="float-left"
              icon={<HiPlus />}
              onClick={() => addEmployee()}
            >
              {t(`${TableTextConst.GROUPS}Page.buttons.addNewEmployee`)}
            </Button>
          </div>
        )}
      </Table>
    </>
  );
};

export default TableGroup;
