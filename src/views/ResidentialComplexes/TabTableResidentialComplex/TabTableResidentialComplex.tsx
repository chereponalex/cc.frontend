import { OnSortParam } from "@/components/shared";
import { useEffect, useMemo, useState, useRef } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import DataTable from "@/components/shared/DataTable";
import { Entity, Response, TableTextConst } from "@/@types";
import { useTranslation } from "react-i18next";
import { HiEye, HiPencil, HiTrash, HiDuplicate } from "react-icons/hi";
import { Tooltip } from "@/components/ui/Tooltip";
import { ToastType } from "@/@types/toast";
import { toast } from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { UseQueryStateResult } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { useNavigate, useParams } from "react-router-dom";
import routePrefix from "@/configs/routes.config/routePrefix";
import { FormBindToBuilding } from "./FormBindToBuilding/FormBindToBuilding";
import { TypeTabTableResidentialComplex } from "@/@types/tabs";
import { useAppSelector } from "@/store";
import { idea } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Dialog from "@/components/ui/Dialog";

type TableColumnSort = {
  order: "" | "asc" | "desc";
  key: string | number;
};

type Props<T> = {
  setParamCache?: (request: {
    [key: string]: any;
  }) => UseQueryStateResult<any, any>;
  setBindMode?: any;
  bindMode?: boolean;
  cityId?: string;
  type: string;
  info?: any;
  onNext: any;
  onBack?: any;
  columns: ColumnDef<T>[];
  textConst: TableTextConst;
  data: any[] | null;
  loading?: boolean;
  update?: (request: { [key: string]: any }) => UseQueryStateResult<any, any>;
  getData: (request: { [key: string]: any }) => UseQueryStateResult<any, any>;
  SoftDelete: (request: string) => UseQueryStateResult<any, any>;
  isMetroStationTableBind?: boolean;
  itemId?: string;
};

function _TabTableResidentialComplex<T>(props: Props<T>) {
  const {
    cityId,
    type,
    info,
    onNext,
    onBack,
    columns = [],
    textConst,
    data = null,
    loading = false,
    getData,
    SoftDelete,
    update,
    setBindMode,
    bindMode,
    setParamCache,
    isMetroStationTableBind,
    itemId,
  } = props;
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedRowsData, setSelectedRowsData] = useState<string[]>([]);
  // console.log(selectedRowsData, "selectedRowsData");
  const newTableData = useRef({
    total: 0,
    pageIndex: 1,
    pageSize: 100,
    selectedRows: [],
    selectedRow: "",
    query: "",
    sort: [],
  });
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
    pageSize: isMetroStationTableBind ? 500 : 25,
    selectedRows: [],
    selectedRow: "",
    query: "",
    sort: [],
  });
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions
  );
  const [isOpen, setIsOpen] = useState<Record<string, any>>({});

  const createKey = `api.v1.crm.${textConst}.create`;
  const updateKey = `api.v1.crm.${textConst}.update`;
  const deleteSoftKey = `api.v1.crm.${textConst}.delete_soft`;

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>
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
      newTableData.current = {
        ...newTableData.current,
        ...{
          selectedRows: [
            ...newTableData.current.selectedRows,
            ...[(row as { id: string }).id],
          ],
        },
      };
    } else {
      setTableData((prevData) => ({
        ...prevData,
        ...{
          selectedRows: [
            ...prevData.selectedRows.filter(
              (id) => id !== (row as { id: string }).id
            ),
          ],
        },
      }));
      newTableData.current = {
        ...newTableData.current,
        selectedRows: [
          ...newTableData.current.selectedRows.filter(
            (id) => id !== (row as { id: string }).id
          ),
        ],
      };
    }
  };

  const handleDelete = (id: string) => {
    try {
      if (
        type === TypeTabTableResidentialComplex.PAYMENT_METHODS ||
        type === TypeTabTableResidentialComplex.METRO_STATIONS ||
        type === TypeTabTableResidentialComplex.TAGS
      ) {
        if (!bindMode) {
          // console.log("unpin");
          onBack({ [type]: id });
        }
        if (bindMode) {
          // console.log("delete");
          SoftDelete(id).unwrap();
          openNotification(
            ToastType.SUCCESS,
            t(`toast.message.${textConst}.addInBasket`)
          );
        }
      } else {
        SoftDelete(id).then((res: any) => {
          if (res?.data.success) {
            fetchData();
          }
        });
        openNotification(
          ToastType.SUCCESS,
          t(`toast.message.${textConst}.addInBasket`)
        );
      }
    } catch (error) {
      console.log(error);
      // @ts-ignore
      openNotification(ToastType.WARNING, error.message);
    }
  };

  const currentColumns: ColumnDef<T>[] = useMemo(() => {
    return [
      ...columns,
      {
        header: t("table.columnsHeader.action"),
        id: "action",
        cell: (props) => (
          <div className="flex justify-end">
            {/* <Tooltip title={t(`tooltip.${textConst}.view`)}>
              <Button
                shape="circle"
                variant="plain"
                size="xs"
                icon={<HiEye />}
                onClick={() => {
                  navigate(
                    //@ts-ignore
                    `${routePrefix[textConst]}/${
                      (props.row.original as { id: string }).id
                    }`
                  );
                }}
              />
            </Tooltip> */}
            {/* {permissions[updateKey] && ( */}
            {/* <Tooltip title={t(`tooltip.${textConst}.edit`)}>
                <Button
                  shape="circle"
                  variant="plain"
                  size="xs"
                  icon={<HiPencil />}
                  onClick={() => {
                    navigate(
                      //@ts-ignore
                      `${routePrefix[textConst]}/${
                        (props.row.original as { id: string }).id
                      }/?editPage=true`,
                    );
                  }}
                />
              </Tooltip> */}
            {/* )} */}
            {/* {permissions[createKey] && ( */}
            {/* <Tooltip
                title={t(`tooltip.${textConst}.duplicateAndCreatElement`)}
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
                      }/?duplicate=true`,
                    )
                  }
                />
              </Tooltip> */}
            {/* )} */}
            {/* {permissions[deleteSoftKey] && ( */}
            <Tooltip
              title={t(
                //TODO
                `tooltip.${textConst}.${
                  (type === TypeTabTableResidentialComplex.PAYMENT_METHODS ||
                    type === TypeTabTableResidentialComplex.METRO_STATIONS ||
                    type === TypeTabTableResidentialComplex.TAGS) &&
                  !bindMode
                    ? "unPin"
                    : "sendToCart"
                }`
              )}
            >
              <Button
                shape="circle"
                variant="plain"
                size="xs"
                style={{marginRight: "30px"}}
                icon={<HiTrash />}
                onClick={() =>
                  handleDelete((props.row.original as { id: string }).id)
                }
              />
            </Tooltip>
            {/* )} */}
          </div>
        ),
      },
    ];
  }, [columns]);

  const handlePaginationChange = (pageIndex: number) => {
    setTableData((prevData) => ({ ...prevData, ...{ pageIndex } }));
    newTableData.current = { ...newTableData.current, ...{ pageIndex } };
    fetchData();
  };

  const handleSelectChange = (pageSize: number) => {
    setTableData((prevData) => ({ ...prevData, ...{ pageSize } }));
    newTableData.current = { ...newTableData.current, ...{ pageSize } };
    fetchData();
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

      return {
        ...prevData,
        sort: sortArray,
      };
    });

    if (!newTableData.current.sort.length) {
      newTableData.current = {
        ...newTableData.current,
        sort: [{ order, key }],
      };
    }
    let sortArray: TableColumnSort[] = [];

    if (order) {
      sortArray = newTableData.current.sort.map((el) => {
        return el.key === key ? { ...el, order: order } : { order, key };
      });
    }

    newTableData.current = {
      ...newTableData.current,
      sort: sortArray,
    };
    fetchData();
  };

  const CamelCaseRefactoring = (text: string) => {
    return text
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str)
      .toLowerCase()
      .split(" ")
      .join("-");
  };

  const fetchData = async () => {
    const require: { [key: string]: any } = {
      page: newTableData.current.pageIndex,
      per_page: newTableData.current.pageSize,
      // page: tableData.pageIndex,
      // per_page: tableData.pageSize,
    };

    if (newTableData.current.sort.length) {
      newTableData.current.sort.map((el) => {
        require[`sort[${el.key}]`] = el.order;
      });
    }

    if (!isEdit) {
      // require["id"] = [itemId];
      require["type"] = textConst;
    }

    try {
      // setParamCache && setParamCache(require);
      const result = await getData(
        !bindMode
          ? require
          : {
              body: {
                page: newTableData.current.pageIndex,
                per_page: newTableData.current.pageSize,
              },
              method: "PUT"
            }
      );
      if (result) {
        setTableData((prevData) => ({
          ...prevData,
          ...{ total: result.paginate?.total || 0 },
          ...{ pageIndex: result.paginate?.current_page || 1 },
          ...{ pageSize: result.paginate?.per_page || 25 },
        }));
        newTableData.current = {
          ...newTableData.current,
          ...{ total: result.paginate?.total || 0 },
          ...{ pageIndex: result.paginate?.current_page || 1 },
          ...{ pageSize: result.paginate?.per_page || 25 },
        };
      }
    } catch (error) {
      console.log(error);
      // @ts-ignore
      openNotification(ToastType.WARNING, error.message);
    }
  };

  useEffect(() => {
    setSelectedRowsData([]);
  }, [bindMode]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData.pageIndex, tableData.sort, tableData.pageSize, bindMode]);

  return (
    <>
      <DataTable<T>
        isMetroStationTableBind={isMetroStationTableBind}
        selectedRowsData={selectedRowsData}
        setSelectedRowsData={setSelectedRowsData}
        textConst={textConst}
        noScrolling
        columns={currentColumns}
        selectable
        bindMode={bindMode}
        noCheckBoxes={!bindMode}
        data={data || []}
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
      <div className="py-2">
        <FormBindToBuilding
          selectedRowsData={selectedRowsData}
          setBindMode={setBindMode}
          bindMode={bindMode}
          cityId={cityId}
          textConst={textConst}
          onNext={onNext}
          info={info}
          type={type}
        />
      </div>
      <Dialog
        width={580}
        isOpen={false}
        // onClose={() => onDialogClose(props.row.original.id, "script")}
        // onRequestClose={() => onDialogClose(props.row.original.id, "script")}
      >
        <div className="flex flex-col h-full justify-between">
          {/*   {" "}
          <ul>
            {Object.entries(props.row.original.scripts || {}).map(
              ([key, script]: any) => (
                <li key={script?.id} className="mb-2">
                  <h6>Название: {script?.name}</h6>
                  <p>
                    Относится к:{" "}
                    {script?.script_location?.value || "Не указано"}
                  </p>
                </li>
              )
            )}
          </ul> */}
        </div>
      </Dialog>
    </>
  );
}

const TabTableResidentialComplex = _TabTableResidentialComplex as <T>(
  props: Props<T>
) => ReturnType<typeof _TabTableResidentialComplex>;

export default TabTableResidentialComplex;
