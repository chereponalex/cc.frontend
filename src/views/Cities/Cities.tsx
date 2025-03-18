import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useHardDeleteCityByIdMutation,
  useLazyGetCitiesQuery,
  useRecoveryCityByIdMutation,
  useRecoveryCityMassMutation,
  useSoftDeleteCityByIdMutation,
  useSoftDeleteCityMassMutation,
} from "@/services/RtkQueryService";
import { City, TableTextConst } from "@/@types";
import { useTranslation } from "react-i18next";
import TablePage from "@/components/shared/TablePage";
import usePermissionLink from "@/utils/hooks/usePermissionLink";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import CardCity from "./CardCity";
import CreatNewCity from "./CreatNewCity";

const Cities = () => {
  const { t } = useTranslation();

  const [getCities, { data: cities = null, isLoading, isFetching }] =
    useLazyGetCitiesQuery();
  const [SoftDeleteCity] = useSoftDeleteCityByIdMutation();
  const [HardDeleteCity] = useHardDeleteCityByIdMutation();
  const [RecoveryCity] = useRecoveryCityByIdMutation();
  const [RecoveryCityMass] = useRecoveryCityMassMutation();
  const [softDeleteCityMass] = useSoftDeleteCityMassMutation();

  const columns: ColumnDef<City>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
        // cell: (props) => {
        //   return props.row.original.int_id
        // }
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
          return useCustomLink(routePrefix.region, props.row.original.region);
        },
      },
      {
        header: t("table.columnsHeader.city"),
        accessorKey: "city",
        cell: function (props) {
          return useCustomLink(routePrefix.city, props.row.original);
        },
      },
      {
        header: t("table.columnsHeader.latitude"),
        accessorKey: "latitude",
        cell: (props) => (
          <div>
            {/*@ts-ignore*/}
            <span>{`${props.getValue() || t("global.noDataAvailable")}`}</span>
          </div>
        ),
      },
      {
        header: t("table.columnsHeader.longitude"),
        accessorKey: "longitude",
        cell: (props) => (
          <div>
            {/*@ts-ignore*/}
            <span>{`${props.getValue() || t("global.noDataAvailable")}`}</span>
          </div>
        ),
      },
    ];
  }, []);

  return (
    <>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <TablePage<City>
        childrenDrawer={{
          card: CardCity,
          create: CreatNewCity,
        }}
        columns={columns}
        textConst={TableTextConst.CITY}
        data={cities}
        loading={isFetching}
        getData={(req) => getCities(req)}
        SoftDelete={(req) => SoftDeleteCity(req)}
        HardDelete={(req) => HardDeleteCity(req)}
        Recovery={(req) => RecoveryCity(req)}
        SoftDeleteMass={(req) => softDeleteCityMass(req)}
        RecoveryMass={(req) => RecoveryCityMass(req)}
      />
    </>
  );
};

export default Cities;
