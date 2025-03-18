import TablePage from "@/components/shared/TablePage";
import { Country, TableTextConst } from "@/@types";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import {
  useHardDeleteCountryByIdMutation,
  useLazyGetCountriesQuery,
  useRecoveryCountryByIdMutation,
  useRecoveryCountryMassMutation,
  useSoftDeleteCountryByIdMutation,
  useSoftDeleteCountryMassMutation,
} from "@/services/RtkQueryService";
import usePermissionLink from "@/utils/hooks/usePermissionLink";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import CardCountry from "./CardCountry";
import CreatNewCountry from "./CreatNewCountry";

const Countries = () => {
  const { t } = useTranslation();
  const [SoftDeleteCountryMass] = useSoftDeleteCountryMassMutation();
  const [RecoveryCountryMass] = useRecoveryCountryMassMutation();
  const columns: ColumnDef<Country>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.name"),
        accessorKey: "name",
        cell: function (props) {
          return useCustomLink(routePrefix.country, props.row.original);
        },
      },
    ];
  }, []);

  const [getCountries, { data: countries = null, isLoading, isFetching }] =
    useLazyGetCountriesQuery();

  const [SoftDeleteCountry] = useSoftDeleteCountryByIdMutation();
  const [HardDeleteCountry] = useHardDeleteCountryByIdMutation();
  const [RecoveryCountry] = useRecoveryCountryByIdMutation();

  return (
    <>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <TablePage<Country>
        childrenDrawer={{
          card: CardCountry,
          create: CreatNewCountry,
        }}
        columns={columns}
        textConst={TableTextConst.COUNTRY}
        data={countries}
        loading={isFetching}
        getData={(req) => getCountries(req)}
        SoftDelete={(req) => SoftDeleteCountry(req)}
        HardDelete={(req) => HardDeleteCountry(req)}
        Recovery={(req) => RecoveryCountry(req)}
        SoftDeleteMass={(req) => SoftDeleteCountryMass(req)}
        RecoveryMass={(req) => RecoveryCountryMass(req)}
      />
    </>
  );
};

export default Countries;
