import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useHardDeleteRoleByIdMutation,
  useLazyGetRolesQuery,
  useRecoveryRoleByIdMutation,
  useRecoveryRoleMassMutation,
  useSoftDeleteRoleByIdMutation,
  useSoftDeleteRoleMassMutation,
} from "@/services/RtkQueryService";
import { Role, TableTextConst } from "@/@types";
import { useTranslation } from "react-i18next";
import TablePage from "@/components/shared/TablePage";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";

const Roles = () => {
  const { t } = useTranslation();

  const [getRoles, { data: roles = null, isLoading, isFetching }] =
    useLazyGetRolesQuery();
  const [SoftDeleteRole] = useSoftDeleteRoleByIdMutation();
  const [HardDeleteRole] = useHardDeleteRoleByIdMutation();
  const [RecoveryRole] = useRecoveryRoleByIdMutation();
  const [SoftDeleteRoleMass] = useSoftDeleteRoleMassMutation();
  const [RecoveryRoleMass] = useRecoveryRoleMassMutation();

  const columns: ColumnDef<Role>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.role"),
        accessorKey: "name",
        cell: function (props) {
          return useCustomLink(routePrefix.role, props.row.original);
        },
      },
      {
        header: t("table.columnsHeader.status"),
        accessorKey: "status",
        cell: (props: any) => (
          <div>
            <span>
              {props.getValue()?.deleted
                ? t("global.deleted")
                : t("global.active")}
            </span>
          </div>
        ),
      },
      {
        header: t("table.columnsHeader.state"),
        accessorKey: "state",
        cell: (props: any) => (
          <div>
            <span>
              {props.getValue()?.updated
                ? t("global.changed")
                : t("global.created")}
            </span>
          </div>
        ),
      },
    ];
  }, []);

  return (
    <>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <TablePage<Role>
        columns={columns}
        textConst={TableTextConst.ROLE}
        data={roles}
        loading={isFetching}
        getData={(req) => getRoles(req)}
        SoftDelete={(req) => SoftDeleteRole(req)}
        HardDelete={(req) => HardDeleteRole(req)}
        Recovery={(req) => RecoveryRole(req)}
        SoftDeleteMass={(req) => SoftDeleteRoleMass(req)}
        RecoveryMass={(req) => RecoveryRoleMass(req)}
      />
    </>
  );
};

export default Roles;
