import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useHardDeleteSaleByIdMutation,
  useLazyGetSalesQuery,
  useRecoverySaleByIdMutation,
  useSoftDeleteSaleByIdMutation,
} from "@/services/RtkQueryService";
import { Sale, TableTextConst } from "@/@types";
import { useTranslation } from "react-i18next";
import TablePage from "@/components/shared/TablePage";

const Stock = () => {
  const { t } = useTranslation();

  const [getSales, { data: sales = null, isLoading }] = useLazyGetSalesQuery();
  const [SoftDeleteSale] = useSoftDeleteSaleByIdMutation();
  const [HardDeleteSale] = useHardDeleteSaleByIdMutation();
  const [RecoverySale] = useRecoverySaleByIdMutation();

  const columns: ColumnDef<Sale>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.stockName"),
        accessorKey: "name",
      },
      {
        header: t("table.columnsHeader.stockLink"),
        accessorKey: "stockLink",
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
    <TablePage<Sale>
      columns={columns}
      textConst={TableTextConst.STOCK}
      data={sales}
      loading={isLoading}
      getData={(req) => getSales(req)}
      SoftDelete={(req) => SoftDeleteSale(req)}
      HardDelete={(req) => HardDeleteSale(req)}
      Recovery={(req) => RecoverySale(req)}
    />
  );
};

export default Stock;
