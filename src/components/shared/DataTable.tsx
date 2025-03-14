import {
  forwardRef,
  useMemo,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
} from "react";
import classNames from "classnames";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import Select from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import TableRowSkeleton from "./loaders/TableRowSkeleton";
import Loading from "./Loading";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  ColumnSort,
  Row,
  CellContext,
} from "@tanstack/react-table";
import type { SkeletonProps } from "@/components/ui/Skeleton";
import type { ForwardedRef, ChangeEvent, SetStateAction } from "react";
import type { CheckboxProps } from "@/components/ui/Checkbox";
import getColumnStyles from "@/utils/getColumnsWidth";
import { useTranslation } from "react-i18next";
import notSortedColumns from "@/utils/notSortedColumns";

export type OnSortParam = { order: "asc" | "desc" | ""; key: string | number };

type DataTableProps<T> = {
  bindMode?: boolean;
  textConst?: string;
  noScrolling?: boolean;
  transaction?: boolean;
  setSelectedRowsData: React.Dispatch<SetStateAction<string[]>>;
  selectedRowsData?: string[];
  noCheckBoxes?: boolean;
  columns: ColumnDef<T>[];
  data?: unknown[];
  loading?: boolean;
  onCheckBoxChange?: (checked: boolean, row: T) => void;
  onIndeterminateCheckBoxChange?: (checked: boolean, rows: Row<T>[]) => void;
  onPaginationChange?: (page: number) => void;
  onSelectChange?: (num: number) => void;
  onSort?: (sort: OnSortParam) => void;
  pageSizes?: number[];
  selectable?: boolean;
  skeletonAvatarColumns?: number[];
  skeletonAvatarProps?: SkeletonProps;
  pagingData?: {
    total: number;
    pageIndex: number;
    pageSize: number;
  };
  isMetroStationTableBind?: boolean;
  totalEntity: number;
  collapseHeight: number;
};

type CheckBoxChangeEvent = ChangeEvent<HTMLInputElement>;

interface IndeterminateCheckboxProps extends Omit<CheckboxProps, "onChange"> {
  onChange: (event: CheckBoxChangeEvent) => void;
  indeterminate: boolean;
  onCheckBoxChange?: (event: CheckBoxChangeEvent) => void;
  onIndeterminateCheckBoxChange?: (event: CheckBoxChangeEvent) => void;
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

const IndeterminateCheckbox = (props: IndeterminateCheckboxProps) => {
  const {
    indeterminate,
    onChange,
    onCheckBoxChange,
    onIndeterminateCheckBoxChange,
    ...rest
  } = props;

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  const handleChange = (e: CheckBoxChangeEvent) => {
    onChange(e);
    onCheckBoxChange?.(e);
    onIndeterminateCheckBoxChange?.(e);
  };

  return (
    <Checkbox
      ref={ref}
      className="mb-0"
      onChange={(_, e) => handleChange(e)}
      {...rest}
    />
  );
};

export type DataTableResetHandle = {
  resetSorting: () => void;
  resetSelected: () => void;
};

function _DataTable<T>(
  props: DataTableProps<T>,
  ref: ForwardedRef<DataTableResetHandle>,
) {
  const {
    selectedRowsData,
    setSelectedRowsData,
    skeletonAvatarColumns,
    columns: columnsProp = [],
    data = [],
    loading = false,
    onCheckBoxChange,
    onIndeterminateCheckBoxChange,
    onPaginationChange,
    onSelectChange,
    onSort,
    pageSizes = [10, 25, 50, 100],
    selectable = false,
    skeletonAvatarProps,
    pagingData = {
      total: 0,
      pageIndex: 1,
      pageSize: 10,
    },
    noCheckBoxes,
    transaction,
    noScrolling,
    textConst,
    bindMode,
    isMetroStationTableBind,
    totalEntity,
    collapseHeight,
  } = props;
  useEffect(() => {
    table.toggleAllRowsSelected(false);
  }, [bindMode]);

  const { pageSize, pageIndex, total } = pagingData;

  const [sorting, setSorting] = useState<ColumnSort[] | null>(null);
  const { t } = useTranslation();
  // const pageSizeOption = useMemo(
  //   () =>
  //     pageSizes.map((number) => ({
  //       value: number,
  //       label: `${number} / ${t(`select.page`)}`,
  //     })),
  //   [pageSizes],
  // );

  const pageSizeOption = useMemo(() => {
    let options = pageSizes.map((number) => ({
      value: number,
      label: `${number} / ${t(`select.page`)}`,
    }));

    if (isMetroStationTableBind) {
      options.push({
        value: 500,
        label: `500 / ${t(`select.page`)}`,
      });
    }

    return options;
  }, [pageSizes, isMetroStationTableBind]);

  const handleCheckBoxChange = (checked: boolean, row: any) => {
    if (!loading) {
      onCheckBoxChange?.(checked, row);
    }

    if (checked) {
      setSelectedRowsData((prev) => [...prev, row.id]);
    } else {
      setSelectedRowsData((prev) => prev.filter((id) => id !== row.id));
    }
  };

  const handleIndeterminateCheckBoxChange = (
    checked: boolean,
    rows: Row<any>[],
  ) => {
    if (!loading) {
      onIndeterminateCheckBoxChange?.(checked, rows);
    }
    setSelectedRowsData(checked ? rows.map((row) => row.original.id) : []);
  };

  const handlePaginationChange = (page: number) => {
    if (!loading) {
      onPaginationChange?.(page);
    }
  };

  const handleSelectChange = (value?: number) => {
    if (!loading) {
      onSelectChange?.(Number(value));
    }
  };

  useEffect(() => {
    if (Array.isArray(sorting)) {
      const sortOrder =
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "";
      const id = sorting.length > 0 ? sorting[0].id : "";
      onSort?.({ order: sortOrder, key: id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  const finalColumns: ColumnDef<T>[] = useMemo(() => {
    const columns = columnsProp;

    if (selectable) {
      return [
        ...(!noCheckBoxes
          ? [
              {
                id: "select",
                header: ({ table }: any) => {
                  return (
                    <IndeterminateCheckbox
                      checked={table.getIsAllRowsSelected()}
                      indeterminate={table.getIsSomeRowsSelected()}
                      onChange={table.getToggleAllRowsSelectedHandler()}
                      onIndeterminateCheckBoxChange={(e) => {
                        handleIndeterminateCheckBoxChange(
                          e.target.checked,
                          table.getRowModel().rows,
                        );
                      }}
                    />
                  );
                },

                cell: ({ row }: any) => (
                  <IndeterminateCheckbox
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    indeterminate={row.getIsSomeSelected()}
                    onChange={row.getToggleSelectedHandler()}
                    onCheckBoxChange={(e) =>
                      handleCheckBoxChange(e.target.checked, row.original)
                    }
                  />
                ),
              },
            ]
          : []),
        ...columns,
      ];
    }
    return columns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnsProp, selectable, noCheckBoxes]);

  const table = useReactTable({
    data,
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    columns: finalColumns as ColumnDef<unknown | object | any[], any>[],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    onSortingChange: (sorter) => {
      setSorting(sorter as ColumnSort[]);
    },
    state: {
      sorting: sorting as ColumnSort[],
    },
  });

  const resetSorting = () => {
    table.resetSorting();
  };

  const resetSelected = () => {
    table.toggleAllRowsSelected(false);
  };

  useImperativeHandle(ref, () => ({
    resetSorting,
    resetSelected,
  }));

  return (
    <Loading loading={loading && data.length !== 0} type="cover">
      <div className="overflow-x-auto">
        <Table
          transaction={transaction}
          collapseHeight={collapseHeight}
          noScrolling={noScrolling}
          className="mb-3 overflow-y-none"
        >
          <THead
            style={{
              whiteSpace: "nowrap",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            {table.getHeaderGroups().map((headerGroup, index) => {
              return (
                <Tr key={index}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Th
                        colSpan={header.colSpan}
                        style={{
                          textAlign:
                            header.column.id === "action" ? "end" : "start",
                          fontSize: "10px",
                          padding:
                            header.column.id === "action"
                              ? "4px 30px 4px 4px"
                              : "4px 4px",
                          minWidth: transaction
                            ? getColumnStyles(header.column.id)
                            : "auto",
                          width: getColumnStyles(header.column.id),
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={classNames(
                              header.column.getCanSort() &&
                                !notSortedColumns[header.column.id] &&
                                "cursor-pointer select-none point",
                              loading && "pointer-events-none",
                            )}
                            onClick={
                              !notSortedColumns[header.column.id]
                                ? header.column.getToggleSortingHandler()
                                : undefined
                            }
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {header.column.getCanSort() &&
                              !notSortedColumns[header.column.id] && (
                                <Sorter sort={header.column.getIsSorted()} />
                              )}
                          </div>
                        )}
                      </Th>
                    );
                  })}
                </Tr>
              );
            })}
          </THead>
          {loading && data.length === 0 ? (
            <TableRowSkeleton
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
              columns={(finalColumns as Array<T>).length}
              rows={pagingData.pageSize}
              avatarInColumns={skeletonAvatarColumns}
              avatarProps={skeletonAvatarProps}
            />
          ) : (
            <TBody className="h-full">
              {table
                .getRowModel()
                .rows.slice(0, pageSize)
                .map((row) => {
                  return (
                    <Tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <Td
                            key={cell.id}
                            style={{
                              textAlign: "start",
                              fontSize: "12px",
                              padding: "5px 5px",
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
          )}
        </Table>
      </div>
      {data.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <Pagination
              pageSize={pageSize}
              currentPage={pageIndex}
              total={totalEntity}
              onChange={handlePaginationChange}
            />
            <p>Всего записей: {totalEntity}</p>
          </div>
          <div style={{ minWidth: 130 }}>
            <Select
              size="xs"
              menuPlacement="top"
              isSearchable={false}
              value={pageSizeOption.filter(
                (option) => option.value === pageSize,
              )}
              options={pageSizeOption}
              onChange={(option) => handleSelectChange(option?.value)}
            />
          </div>
        </div>
      )}
    </Loading>
  );
}

const DataTable = forwardRef(_DataTable) as <T>(
  props: DataTableProps<T> & {
    ref?: ForwardedRef<DataTableResetHandle>;
  },
) => ReturnType<typeof _DataTable>;

export type { ColumnDef, Row, CellContext };
export default DataTable;
