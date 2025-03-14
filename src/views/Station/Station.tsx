import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useHardDeleteMetroStationByIdMutation,
  useLazyGetMetroStationsQuery,
  useRecoveryMetroStationByIdMutation,
  useRecoveryMetroStationMassMutation,
  useSoftDeleteMetroStationByIdMutation,
  useSoftDeleteMetroStationMassMutation,
} from "@/services/RtkQueryService";
import { TableTextConst, MetroStation } from "@/@types";
import { useTranslation } from "react-i18next";
import TablePage from "@/components/shared/TablePage";
import usePermissionLink from "@/utils/hooks/usePermissionLink";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";

const Station = () => {
  const { t } = useTranslation();

  const [
    getMetroStations,
    { data: metroStations = null, isLoading, isFetching },
  ] = useLazyGetMetroStationsQuery();
  const [SoftDeleteMetroStation] = useSoftDeleteMetroStationByIdMutation();
  const [HardDeleteMetroStation] = useHardDeleteMetroStationByIdMutation();
  const [RecoveryMetroStation] = useRecoveryMetroStationByIdMutation();
  const [SoftDeleteMetroStationMass] = useSoftDeleteMetroStationMassMutation();
  const [RecoveryMetroStationMass] = useRecoveryMetroStationMassMutation();

  const columns: ColumnDef<MetroStation>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.name"),
        accessorKey: "name",
        cell: function (props) {
          return useCustomLink(routePrefix.metro_station, props.row.original);
        },
      },
      {
        header: t("table.columnsHeader.city"),
        accessorKey: "city",
        cell: function (props) {
          return useCustomLink(routePrefix.city, props.row.original.city);
        },
      },
      {
        header: t("table.columnsHeader.metroLine"),
        accessorKey: "line",
        cell: function (props) {
          return useCustomLink(routePrefix.metro_line, props.row.original.line);
        },
      },
    ];
  }, []);

  return (
    <>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <TablePage<MetroStation>
        columns={columns}
        textConst={TableTextConst.METRO_STATION}
        data={metroStations}
        loading={isFetching}
        getData={(req) => getMetroStations(req)}
        SoftDelete={(req) => SoftDeleteMetroStation(req)}
        HardDelete={(req) => HardDeleteMetroStation(req)}
        Recovery={(req) => RecoveryMetroStation(req)}
        SoftDeleteMass={(req) => SoftDeleteMetroStationMass(req)}
        RecoveryMass={(req) => RecoveryMetroStationMass(req)}
      />
    </>
  );
};

export default Station;
