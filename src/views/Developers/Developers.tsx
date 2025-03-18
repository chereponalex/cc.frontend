import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useHardDeleteDeveloperByIdMutation,
  useLazyGetDevelopersQuery,
  useRecoveryDeveloperByIdMutation,
  useRecoveryDeveloperMassMutation,
  useSoftDeleteDeveloperByIdMutation,
  useSoftDeleteDeveloperMassMutation,
} from "@/services/RtkQueryService";
import { Developer, TableTextConst } from "@/@types";
import { useTranslation } from "react-i18next";
import TablePage from "@/components/shared/TablePage";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import CreatNewDevelopers from "./CreatNewDevelopers";
import CardDeveloper from "./CardDevelopers/CardDevelopers";

const Developers = () => {
  const { t } = useTranslation();

  const [getDevelopers, { data: developers = null, isLoading, isFetching }] =
    useLazyGetDevelopersQuery();
  const [SoftDeleteDeveloper] = useSoftDeleteDeveloperByIdMutation();
  const [HardDeleteDeveloper] = useHardDeleteDeveloperByIdMutation();
  const [RecoveryDeveloper] = useRecoveryDeveloperByIdMutation();
  const [SoftDeleteDeveloperMass] = useSoftDeleteDeveloperMassMutation();
  const [RecoveryDeveloperMass] = useRecoveryDeveloperMassMutation();
  const columns: ColumnDef<Developer>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.developerName"),
        accessorKey: "name",
        cell: function (props) {
          return useCustomLink(routePrefix.developer, props.row.original);
        },
      },
    ];
  }, []);

  return (
    <>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <TablePage<Developer>
        childrenDrawer={{
          card: CardDeveloper,
          create: CreatNewDevelopers,
        }}
        columns={columns}
        textConst={TableTextConst.DEVELOPERS}
        data={developers}
        loading={isFetching}
        getData={(req) => getDevelopers(req)}
        SoftDelete={(req) => SoftDeleteDeveloper(req)}
        HardDelete={(req) => HardDeleteDeveloper(req)}
        Recovery={(req) => RecoveryDeveloper(req)}
        SoftDeleteMass={(req) => SoftDeleteDeveloperMass(req)}
        RecoveryMass={(req) => RecoveryDeveloperMass(req)}
      />
    </>
  );
};

export default Developers;
