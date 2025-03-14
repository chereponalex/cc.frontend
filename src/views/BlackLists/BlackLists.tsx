import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useHardDeleteBlackListByIdMutation,
  useLazyGetBlackListsQuery,
  useRecoveryBlackListMassMutation,
  useRecoveryCityMassMutation,
  useSoftDeleteBlackListMassMutation,
  // useRecoveryBlackListByIdMutation,
  // useSoftDeleteBlackListByIdMutation,
} from "@/services/RtkQueryService";
import { BlackList, TableTextConst } from "@/@types";
import { useTranslation } from "react-i18next";
import TablePage from "@/components/shared/TablePage";
import formatDate from "@/utils/formatDate";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import { ActionLink } from "@/components/shared";

const BlackLists = () => {
  const { t } = useTranslation();

  const [getBlackLists, { data: blackLists = null, isLoading, isFetching }] =
    useLazyGetBlackListsQuery();
  // const [SoftDeleteDeveloper] = useSoftDeleteBlackListByIdMutation();
  const [HardDeleteBlackList] = useHardDeleteBlackListByIdMutation();
  // const [RecoveryDeveloper] = useRecoveryBlackListByIdMutation();
  const [softDeleteBlackListMass] = useSoftDeleteBlackListMassMutation();
  const [RecoveryBlackListMass] = useRecoveryBlackListMassMutation();

  const columns: ColumnDef<BlackList>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.subscriberNumber"),
        accessorKey: "phone",
      },
      {
        header: t("table.columnsHeader.dateOfAddition"),
        accessorKey: "updated_at",
        cell: (props: any) => (
          <div>
            {/*@ts-ignore*/}
            <span>{`${
              formatDate(props.getValue()) || t("global.noDataAvailable")
            }`}</span>
          </div>
        ),
      },
      {
        header: t("table.columnsHeader.addedByUser"),
        accessorKey: "employee.full_name",
        cell: (props) => {
          return (
            <ActionLink
              target="_blank"
              to={`${routePrefix?.employee}/${props.row.original?.employee?.id}`}
            >
              {props.row.original?.employee?.full_name}
            </ActionLink>
          );
          // return useCustomLink(
          //   routePrefix.employee,
          //   props.row.original.employee,
          //   40,
          // );
        },
        // <div>
        //   {/*@ts-ignore*/}
        //   <span>{`${props.getValue() || t("global.noDataAvailable")}`}</span>
        // </div>
      },
    ];
  }, []);

  return (
    <>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <TablePage<BlackList>
        columns={columns}
        textConst={TableTextConst.BLACK_LIST}
        data={blackLists}
        loading={isFetching}
        getData={(req) => getBlackLists(req)}
        HardDelete={(req) => HardDeleteBlackList(req)}
      />
    </>
  );
};

export default BlackLists;
