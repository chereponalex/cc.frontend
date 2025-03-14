import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useHardDeleteGroupByIdMutation,
  useLazyGetGroupsQuery,
  useRecoveryGroupByIdMutation,
  useRecoveryGroupMassMutation,
  useSoftDeleteGroupByIdMutation,
  useSoftDeleteGroupMassMutation,
} from "@/services/RtkQueryService";
import { TableTextConst } from "@/@types";
import { useTranslation } from "react-i18next";
import TablePage from "@/components/shared/TablePage";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";

const Groups = () => {
  const { t } = useTranslation();

  const [getGroups, { data: groups = null, isLoading }] =
    useLazyGetGroupsQuery();
  const [SoftDeleteGroup] = useSoftDeleteGroupByIdMutation();
  const [HardDeleteGroup] = useHardDeleteGroupByIdMutation();
  const [RecoveryGroup] = useRecoveryGroupByIdMutation();
  const [SoftDeleteGroupMass] = useSoftDeleteGroupMassMutation();
  const [RecoveryGroupMass] = useRecoveryGroupMassMutation();

  const columns: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.groups"),
        accessorKey: "name",
        cell: function (props) {
          return useCustomLink(routePrefix.groups, props.row.original);
        },
      },
      {
        header: t("table.columnsHeader.count_group"),
        // accessorKey: "employees.name",
        accessorKey: "count",
        cell: (props) => {
          return <span>{props.row.original.employees.length}</span>;
        },
      },
    ];
  }, []);

  return (
    <>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <TablePage<any>
        columns={columns}
        textConst={TableTextConst.GROUPS}
        data={groups}
        loading={isLoading}
        getData={(req) => getGroups(req)}
        SoftDelete={(req) => SoftDeleteGroup(req)}
        HardDelete={(req) => HardDeleteGroup(req)}
        Recovery={(req) => RecoveryGroup(req)}
        SoftDeleteMass={(req) => SoftDeleteGroupMass(req)}
        RecoveryMass={(req) => RecoveryGroupMass(req)}
      />
    </>
  );
};

export default Groups;
