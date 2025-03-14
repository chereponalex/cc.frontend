import { useCallback, useEffect, useMemo, useState } from "react";
import Table from "@/components/ui/Table";
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { HiOutlinePlusCircle, HiOutlineMinusCircle } from "react-icons/hi";
import { FaQuestion } from "react-icons/fa";
import type { ColumnDef, ExpandedState } from "@tanstack/react-table";
import { Checkbox, Tooltip } from "../ui";
import navigationConfig from "@/configs/navigation.config";
import { useTranslation } from "react-i18next";
import { ScrollBar } from "@/components/ui/ScrollBar";

const { Tr, Th, Td, THead, TBody } = Table;

const TablePermissions = ({
  setPermissionsValues,
  isEdit,
  isEditPage,
  permissionsValues,
  routes,
}: any) => {
  const { t } = useTranslation();
  const [data, setData] = useState(
    navigationConfig.filter((nav) => nav.permissionKey !== "home"),
  );

  useEffect(() => {
    const permissionHost = "api.v1.crm";

    if (permissionsValues && Object.keys(permissionsValues).length > 0) {
      setData((prev: any) => {
        return [...prev].map((navElement) => {
          const hasSubMenu =
            Array.isArray(navElement.subMenu) && navElement.subMenu.length > 0;
          let parentValues: any = hasSubMenu
            ? {
                create: true,
                view: true,
                update: true,
                delete_soft: true,
                // action_info: true,
              }
            : {};

          const newSubMenu = navElement.subMenu.map((subMenuEl: any) => {
            const newValue: any = {};
            Object.keys(permissionsValues).forEach((key) => {
              if (
                key.includes(`${permissionHost}.${subMenuEl.permissionKey}`)
              ) {
                const parsedString = key.split(".");
                newValue[parsedString[parsedString.length - 1]] =
                  permissionsValues[key];
              }
            });
            return { ...subMenuEl, ...newValue };
          });

          hasSubMenu &&
            newSubMenu.forEach((subMenuEl: any) => {
              parentValues = {
                create: parentValues.create && !!subMenuEl["create"],
                view: parentValues.view && !!subMenuEl["view"],
                update: parentValues.update && !!subMenuEl["update"],
                delete_soft:
                  parentValues.delete_soft && !!subMenuEl["delete_soft"],
                // action_info:
                //   parentValues.action_info && !!subMenuEl["action_info"],
              };
            });

          return {
            ...navElement,
            ...parentValues,
            subMenu: newSubMenu,
          };
        });
      });
    }
  }, [permissionsValues]);

  const onPermissionChange = (
    props: any,
    typeField: string,
    nextValue: any,
    permissionKey: string,
  ) => {
    const hasSubMenu =
      Array.isArray(props.cell.row.original.subMenu) &&
      props.cell.row.original.subMenu.length > 0;
    const permissionHost = "api.v1.crm";
    setPermissionsValues((prevPermissions: any) => {
      const newValue: any = hasSubMenu
        ? {}
        : { [`${permissionHost}.${permissionKey}.${typeField}`]: nextValue };

      props.cell.row.original.subMenu?.forEach((menu: any) => {
        newValue[`${permissionHost}.${menu.permissionKey}.${typeField}`] =
          nextValue;
        newValue[`${permissionHost}.${menu.permissionKey}.get.action_info`] =
          true;
      });

      return {
        ...prevPermissions,
        ...newValue,
      };
    });
  };

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "expander",
        header: ({ table }) => {
          return (
            <button
              type="button"
              className="text-xl"
              {...{
                onClick: table.getToggleAllRowsExpandedHandler(),
              }}
            >
              {table.getIsAllRowsExpanded() ? (
                <HiOutlineMinusCircle />
              ) : (
                <HiOutlinePlusCircle />
              )}
            </button>
          );
        },
        cell: ({ row, getValue }) => {
          return (
            <>
              {row.getCanExpand() ? (
                <button
                  type="button"
                  className="text-xl"
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                  }}
                >
                  {row.getIsExpanded() ? (
                    <HiOutlineMinusCircle />
                  ) : (
                    <HiOutlinePlusCircle />
                  )}
                </button>
              ) : null}
              {getValue()}
            </>
          );
        },
      },
      {
        header: t("table.columnsHeader.chapter"),
        accessorKey: "chapter",
        cell: (props) => {
          return t(props.row.original.translateKey);
        },
      },
      {
        header: t("table.columnsHeader.view"),
        accessorKey: "view",
        cell: (props) => {
          const currentCellValue: any = props.getValue();
          const nextValue = !currentCellValue;
          let { permissionKey } = props.cell.row.original;
          // if (permissionKey === "script") {
          //   permissionKey = "scripts";
          // }
          return (
            <Checkbox
              // disabled={isEdit}
              checked={!!currentCellValue}
              onChange={() =>
                onPermissionChange(props, "view", nextValue, permissionKey)
              }
            />
          );
        },
      },
      {
        header: t("table.columnsHeader.create"),
        accessorKey: "create",
        cell: (props) => {
          const currentCellValue: any = props.getValue();
          const nextValue = !currentCellValue;
          const { permissionKey } = props.cell.row.original;
          return (
            <div className="flex flex-row items-center">
              <Checkbox
                // disabled={isEdit}
                checked={!!currentCellValue}
                onChange={() =>
                  onPermissionChange(props, "create", nextValue, permissionKey)
                }
              />
              {props.row.original.permissionKey === "transfer" &&
                props.row.index !== 0 && (
                  <Tooltip title={"Права на получение отчета"}>
                    <FaQuestion className="cursor-pointer" size={12} />
                  </Tooltip>
                )}
            </div>
          );
        },
      },
      {
        header: t("table.columnsHeader.edit"),
        accessorKey: "update",
        cell: (props) => {
          const currentCellValue: any = props.getValue();
          const nextValue = !currentCellValue;
          const { permissionKey } = props.cell.row.original;

          return props.row.original.permissionKey !== "transfer" ? (
            <Checkbox
              // disabled={isEdit}
              checked={!!currentCellValue}
              onChange={() =>
                onPermissionChange(props, "update", nextValue, permissionKey)
              }
            />
          ) : null;
        },
      },
      {
        header: t("table.columnsHeader.delete"),
        accessorKey: "delete_soft",
        cell: (props) => {
          const currentCellValue: any = props.getValue();
          const nextValue = !currentCellValue;
          const { permissionKey } = props.cell.row.original;
          return props.row.original.permissionKey !== "transfer" ? (
            <Checkbox
              // disabled={isEdit}
              checked={!!currentCellValue}
              onChange={() =>
                onPermissionChange(
                  props,
                  "delete_soft",
                  nextValue,
                  permissionKey,
                )
              }
            />
          ) : null;
        },
      },
    ],
    [],
  );

  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subMenu,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="overflow-y-auto">
      <ScrollBar
        autoHeight
        autoHeightMin={expanded === true ? "50vh" : "370px"}
      >
        <Table
          style={{ minWidth: "auto", width: "100%", maxWidth: "800px" }}
          noScrolling
        >
          <THead style={{ position: "sticky", top: 0 }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ textAlign: "start", fontSize: "10px" }}
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
          <TBody style={{ minHeight: "auto", maxHeight: "100vh" }}>
            {table.getRowModel().rows.map((row) => {
              return (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Td key={cell.id} style={{ textAlign: "start" }}>
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
      </ScrollBar>
    </div>
  );
};

export default TablePermissions;
