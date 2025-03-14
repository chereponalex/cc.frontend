import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useGetRouterListQuery,
  useHardDeleteEmployeeByIdMutation,
  useLazyGetEmployeesQuery,
  useRecoveryEmployeeByIdMutation,
  useRecoveryEmployeeMassMutation,
  useSoftDeleteEmployeeByIdMutation,
  useSoftDeleteEmployeeMassMutation,
  useUpdateEmployeeIdMutation,
} from "@/services/RtkQueryService";
import { Employee, TableTextConst } from "@/@types";
import { useTranslation } from "react-i18next";
import TablePage from "@/components/shared/TablePage";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import { ActionLink } from "@/components/shared";
import formatDate from "@/utils/formatDate";

const Users = () => {
  const { t } = useTranslation();

  const [getEmployees, { data: employees = null, isLoading, isFetching }] =
    useLazyGetEmployeesQuery();
  const [UpdateEmployee] = useUpdateEmployeeIdMutation();
  const [SoftDeleteEmployee] = useSoftDeleteEmployeeByIdMutation();
  const [SoftDeleteEmployeeMass] = useSoftDeleteEmployeeMassMutation();
  const [HardDeleteEmployee] = useHardDeleteEmployeeByIdMutation();
  const [RecoveryEmployee] = useRecoveryEmployeeByIdMutation();
  const [RecoveryEmployeeMass] = useRecoveryEmployeeMassMutation();
  const columns: ColumnDef<Employee>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.fio"),
        accessorKey: "name",
        cell: function (props) {
          return (
            <ActionLink
              target="_blank"
              to={`${routePrefix.employee}/${props.row.original.id}`}
            >
              {props.row.original.full_name}
            </ActionLink>
          );
          // return useCustomLink(routePrefix.employee, props.row.original);
        },
      },
      {
        header: t("table.columnsHeader.date_of_birth"),
        accessorKey: "date_of_birth",
        cell: function (props) {
          return (
            <span>
              {props.row.original.date_of_birth
                ? formatDate(props.row.original.date_of_birth, true)
                : ""}
            </span>
          );
          // return useCustomLink(routePrefix.employee, props.row.original);
        },
      },
      {
        header: t("table.columnsHeader.email"),
        accessorKey: "email",
      },
      {
        header: t("table.columnsHeader.role"),
        accessorKey: "role",
        cell: function (props) {
          return useCustomLink(routePrefix.role, props.row.original.role);
        },
      },
      {
        header: t("table.columnsHeader.country"),
        accessorKey: "country.name",
        cell: function (props) {
          return useCustomLink(routePrefix.country, props.row.original.country);
        },
      },
      {
        header: t("table.columnsHeader.city"),
        accessorKey: "city",
        cell: function (props) {
          return useCustomLink(
            routePrefix.city,
            props.row.original.city as any,
          );
        },
      },
    ];
  }, []);

  return (
    <>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <TablePage<Employee>
        columns={columns}
        textConst={TableTextConst.EMPLOYEE}
        data={employees}
        loading={isFetching}
        getData={(req) => getEmployees(req)}
        SoftDelete={(req) => SoftDeleteEmployee(req)}
        SoftDeleteMass={(req) => SoftDeleteEmployeeMass(req)}
        HardDelete={(req) => HardDeleteEmployee(req)}
        Recovery={(req) => RecoveryEmployee(req)}
        RecoveryMass={(req) => RecoveryEmployeeMass(req)}
      />
    </>
  );
};

export default Users;
