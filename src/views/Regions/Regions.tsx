import TablePage from "@/components/shared/TablePage";
import { Region, TableTextConst } from "@/@types";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import {
  useHardDeleteRegionByIdMutation,
  useLazyGetRegionsQuery,
  useRecoveryRegionByIdMutation,
  useRecoveryRegionMassMutation,
  useSoftDeleteRegionByIdMutation,
  useSoftDeleteRegionMassMutation,
} from "@/services/RtkQueryService";
import usePermissionLink from "@/utils/hooks/usePermissionLink";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";

const Regions = () => {
  const { t } = useTranslation();

  const columns: ColumnDef<Region>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.country"),
        accessorKey: "country",
        cell: function (props) {
          return useCustomLink(routePrefix.country, props.row.original.country);
        },
      },
      {
        header: t("table.columnsHeader.region"),
        accessorKey: "region",
        cell: function (props) {
          return useCustomLink(routePrefix.region, props.row.original);
        },
      },
    ];
  }, []);

  const [getRegions, { data: regions = null, isLoading, isFetching }] =
    useLazyGetRegionsQuery();

  const [SoftDeleteRegion] = useSoftDeleteRegionByIdMutation();
  const [HardDeleteRegion] = useHardDeleteRegionByIdMutation();
  const [RecoveryRegion] = useRecoveryRegionByIdMutation();
  const [SoftDeleteRegionMass] = useSoftDeleteRegionMassMutation();
  const [RecoveryRegionMass] = useRecoveryRegionMassMutation();

  return (
    <>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <TablePage<Region>
        columns={columns}
        textConst={TableTextConst.REGION}
        data={regions}
        loading={isFetching}
        getData={(req) => getRegions(req)}
        SoftDelete={(req) => SoftDeleteRegion(req)}
        HardDelete={(req) => HardDeleteRegion(req)}
        Recovery={(req) => RecoveryRegion(req)}
        SoftDeleteMass={(req) => SoftDeleteRegionMass(req)}
        RecoveryMass={(req) => RecoveryRegionMass(req)}
      />
    </>
  );
};

export default Regions;
