import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useHardDeleteMarketplaceByIdMutation,
  useLazyGetMarketplacesQuery,
  useRecoveryMarketplaceByIdMutation,
  useRecoveryMarketplaceMassMutation,
  useSoftDeleteMarketplaceByIdMutation,
  useSoftDeleteMarketplaceMassMutation,
} from "@/services/RtkQueryService";
import { Marketplace, TableTextConst } from "@/@types";
import { useTranslation } from "react-i18next";

import TablePage from "@/components/shared/TablePage";
import XCircleSvg from "@/assets/svg/XCircleSvg";
import CheckCircleSvg from "@/assets/svg/CheckCircleSvg";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import CardVenue from "./CardVenue";
import CreatNewVenue from "./CreatNewVenue";

const Venues = () => {
  const { t } = useTranslation();

  const [
    getMarketplaces,
    { data: marketplaces = null, isLoading, isFetching },
  ] = useLazyGetMarketplacesQuery();
  const [SoftDeleteMarketplace] = useSoftDeleteMarketplaceByIdMutation();
  const [HardDeleteMarketplace] = useHardDeleteMarketplaceByIdMutation();
  const [RecoveryMarketplace] = useRecoveryMarketplaceByIdMutation();
  const [SoftDeleteMarketplaceMass] = useSoftDeleteMarketplaceMassMutation();
  const [RecoveryMarketplaceMass] = useRecoveryMarketplaceMassMutation();

  const columns: ColumnDef<Marketplace>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.marketplace"),
        accessorKey: "name",
        cell: function (props) {
          return useCustomLink(routePrefix.marketplace, props.row.original);
        },
      },
      // {
      //   header: t("table.columnsHeader.expertOffer"),
      //   id: "expert_mode",
      //   cell: (props) => (
      //     <div style={{ display: "flex", justifyContent: "start" }}>
      //       {props.row.original.expert_mode ? (
      //         <CheckCircleSvg color="#22c55e" />
      //       ) : (
      //         <XCircleSvg color="#ef4444" />
      //       )}
      //     </div>
      //   ),
      // },
    ];
  }, []);

  return (
    <>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <TablePage<Marketplace>
        childrenDrawer={{
          card: CardVenue,
          create: CreatNewVenue,
        }}
        columns={columns}
        textConst={TableTextConst.VENUE}
        data={marketplaces}
        loading={isFetching}
        getData={(req) => getMarketplaces(req)}
        SoftDelete={(req) => SoftDeleteMarketplace(req)}
        HardDelete={(req) => HardDeleteMarketplace(req)}
        Recovery={(req) => RecoveryMarketplace(req)}
        SoftDeleteMass={(req) => SoftDeleteMarketplaceMass(req)}
        RecoveryMass={(req) => RecoveryMarketplaceMass(req)}
      />
    </>
  );
};

export default Venues;
