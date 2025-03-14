import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useHardDeleteRealEstateBuildingByIdMutation,
  useLazyGetRealEstateBuildingsQuery,
  useRecoveryRealEstateBuildingByIdMutation,
  useRecoveryRealEstateBuildingMassMutation,
  useSoftDeleteRealEstateBuildingByIdMutation,
  useSoftDeleteRealEstateBuildingMassMutation,
} from "@/services/RtkQueryService";
import { RealEstateBuilding, TableTextConst } from "@/@types";
import { useTranslation } from "react-i18next";
import TablePage from "@/components/shared/TablePage";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import { ActionLink } from "@/components/shared";
import cutString from "@/utils/cutString";

const ResidentialComplexes = () => {
  const { t } = useTranslation();

  const [
    getRealEstateBuildings,
    { data: realEstateBuildings = null, isLoading, isFetching },
  ] = useLazyGetRealEstateBuildingsQuery();
  const [SoftDeleteRealEstateBuilding] =
    useSoftDeleteRealEstateBuildingByIdMutation();
  const [HardDeleteRealEstateBuilding] =
    useHardDeleteRealEstateBuildingByIdMutation();
  const [RecoveryRealEstateBuilding, { isLoading: isLoadingRecovery }] =
    useRecoveryRealEstateBuildingByIdMutation();
  const [SoftDeleteRealEstateBuildingMass] =
    useSoftDeleteRealEstateBuildingMassMutation();
  const [RecoveryRealEstateBuildingMass] =
    useRecoveryRealEstateBuildingMassMutation();

  const columns: ColumnDef<RealEstateBuilding>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.name"),
        accessorKey: "name",
        cell: function (props) {
          return useCustomLink(
            routePrefix.real_estate_building,
            props.row.original,
          );
        },
      },
      {
        header: t("table.columnsHeader.developer"),
        accessorKey: "developer",
        cell: function (props) {
          return useCustomLink(
            routePrefix.developer,
            props.row.original.developer,
          );
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
      {
        header: t("table.columnsHeader.website"),
        accessorKey: "site",
        cell: (props) => {
          console.log(props.row.original.site, "site");
          return (
            props.row.original.site && (
              <ActionLink target="_blank" to={props.row.original.site}>
                {cutString(props.row.original.site, 15)}
              </ActionLink>
            )
          );
        },
      },
      {
        header: t("table.columnsHeader.photo"),
        accessorKey: "images",
        cell: (props) => {
          console.log(props.getValue(), "photo");
          return (
            <div>
              {props.getValue() && (props.getValue() as string[]).length ? (
                <div>
                  <img
                    src={(props.getValue() as string[])[0]}
                    alt="image"
                    className="w-8 h-8 rounded-full border-solid border-2 border-gray-400 object-cover"
                  />
                </div>
              ) : (
                <span>{t("global.noDataAvailable")}</span>
              )}
            </div>
          );
        },
      },
    ];
  }, []);

  return (
    <>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <TablePage<RealEstateBuilding>
        columns={columns}
        textConst={TableTextConst.REALESTATEBUILDING}
        data={realEstateBuildings}
        loading={isLoadingRecovery || isFetching}
        getData={(req) => getRealEstateBuildings(req)}
        SoftDelete={(req) => SoftDeleteRealEstateBuilding(req)}
        HardDelete={(req) => HardDeleteRealEstateBuilding(req)}
        Recovery={(req) => RecoveryRealEstateBuilding(req)}
        SoftDeleteMass={(req) => SoftDeleteRealEstateBuildingMass(req)}
        RecoveryMass={(req) => RecoveryRealEstateBuildingMass(req)}
      />
    </>
  );
};

export default ResidentialComplexes;
