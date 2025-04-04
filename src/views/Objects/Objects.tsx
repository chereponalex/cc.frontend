import { useMemo, useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useHardDeleteRealEstateObjectByIdMutation,
  useLazyGetRealEstateObjectsQuery,
  useRecoveryRealEstateObjectByIdMutation,
  useRecoveryRealEstateObjectMassMutation,
  useSoftDeleteRealEstateObjectByIdMutation,
  useSoftDeleteRealEstateObjectMassMutation,
  useUpdateRealEstateObjectByIdMutation,
} from "@/services/RtkQueryService";
import { BuildingObject, TableTextConst } from "@/@types";
import { useTranslation } from "react-i18next";
import TablePage from "@/components/shared/TablePage";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import { Button, Input, Tooltip, toast } from "@/components/ui";
import { FaCheck } from "react-icons/fa";
import { HiPencil } from "react-icons/hi";
import { ToastType } from "@/@types/toast";
import Notification from "@/components/ui/Notification";
import thousandSeparatorValue from "@/utils/thousandSeparator";
import CardObject from "./CardObject";
import CreatNewObject from "./CreatNewObject";
import formatDate from "@/utils/formatDate";

const Objects = () => {
  const { t } = useTranslation();
  const [isEditSquare, setIsEditSquare] = useState<Record<string, boolean>>({});
  const [isEditPrice, setIsEditPrice] = useState<Record<string, boolean>>({});
  const fetchLoading = useRef(false);
  const inputChangeObject = useRef<{
    [key: string]: { square: string | null; price: string | null };
  }>({});
  const [
    getRealEstateObjects,
    { data: realEstateObjects = null, isLoading, isFetching },
  ] = useLazyGetRealEstateObjectsQuery();
  const [SoftDeleteRealEstateObject] =
    useSoftDeleteRealEstateObjectByIdMutation();
  const [HardDeleteRealEstateObject] =
    useHardDeleteRealEstateObjectByIdMutation();
  const [RecoveryRealEstateObject] = useRecoveryRealEstateObjectByIdMutation();
  const [UpdateData] = useUpdateRealEstateObjectByIdMutation();
  const [SoftDeleteRealEstateObjectMass] =
    useSoftDeleteRealEstateObjectMassMutation();
  const [RecoveryRealEstateObjectMass] =
    useRecoveryRealEstateObjectMassMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleInputChange = (rowId: string, field: string, value: string) => {
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

  const updateInline = async (rowId: string, type: string) => {
    try {
      fetchLoading.current = true;
      const fieldToUpdate = type === "price" ? "price" : "square";
      const updatedValue = Number(
        inputChangeObject.current[rowId]?.[fieldToUpdate]?.replace(/\s/g, ""),
      );
      const res: any = await UpdateData({
        id: rowId,
        [fieldToUpdate]: updatedValue,
      });
      if (res?.data?.status === "success") {
        setIsEditSquare({});
        setIsEditPrice({});
        fetchLoading.current = false;
        openNotification(
          ToastType.SUCCESS,
          t(`toast.message.${TableTextConst.REAL_ESTATE_OBJECT}.update`),
        );
      }
    } catch (error) {
      console.log(error, "error");
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };
  const columns: ColumnDef<BuildingObject>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.nameObject"),
        accessorKey: "name",
        cell: function (props) {
          return useCustomLink(
            routePrefix.building,
            props.row.original.building as any,
          );
        },
      },
      {
        header: t("table.columnsHeader.roominess"),
        accessorKey: "roominess",
        cell: (props) => {
          const { label }: any = props.getValue();
          return <span>{label}</span>;
        },
      },
      {
        header: t("table.columnsHeader.type"),
        accessorKey: "type",
        cell: (props) => {
          const { label }: any = props.getValue();
          return <span>{label}</span>;
        },
      },
      {
        header: t("table.columnsHeader.finishing"),
        accessorKey: "finishing",
        cell: (props) => {
          const { label }: any = props.getValue();
          return <span>{label}</span>;
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
                        updateInline(props.row.original.id, "square")
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
                          ?.replace(/\D/g, ""),
                      ),
                    )}
                    onChange={(e) =>
                      handleInputChange(
                        props.row.original.id,
                        "square",
                        e.target.value,
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
                    {thousandSeparatorValue(props.row.original.square)}
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
                        updateInline(props.row.original.id, "price")
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
                        props.row.original?.price
                          ?.toString()
                          ?.replace(/\D/g, ""),
                      ),
                    )}
                    onChange={(e) =>
                      handleInputChange(
                        props.row.original.id,
                        "price",
                        e.target.value,
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
                    {thousandSeparatorValue(props.row.original.price)}
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
        cell: (props) => {
          const value: any = props.getValue();
          return (
            <span style={{ whiteSpace: "nowrap" }}>
              {thousandSeparatorValue(value)}
            </span>
          );
        },
      },
      {
        header: t("table.columnsHeader.deadline"),
        accessorKey: "deadline",
        cell: (props) => {
          const { label, value }: any = props.getValue();
          return <span style={{ whiteSpace: "nowrap" }}>{label}</span>;
        },
      },
    ];
  }, [isEditSquare, isEditPrice]);

  return (
    <>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <TablePage<BuildingObject>
        childrenDrawer={{
          card: CardObject,
          create: CreatNewObject,
        }}
        columns={columns}
        textConst={TableTextConst.REAL_ESTATE_OBJECT}
        data={realEstateObjects}
        loading={isFetching}
        getData={(req) => getRealEstateObjects(req)}
        SoftDelete={(req) => SoftDeleteRealEstateObject(req)}
        HardDelete={(req) => HardDeleteRealEstateObject(req)}
        Recovery={(req) => RecoveryRealEstateObject(req)}
        SoftDeleteMass={(req) => SoftDeleteRealEstateObjectMass(req)}
        RecoveryMass={(req) => RecoveryRealEstateObjectMass(req)}
      />
    </>
  );
};

export default Objects;
