import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useHardDeletePaymentMethodByIdMutation,
  useLazyGetPaymentMethodsQuery,
  useRecoveryPaymentMethodByIdMutation,
  useRecoveryPaymentMethodMassMutation,
  useSoftDeletePaymentMethodByIdMutation,
  useSoftDeletePaymentMethodMassMutation,
} from "@/services/RtkQueryService";
import { PaymentMethod, TableTextConst } from "@/@types";
import { useTranslation } from "react-i18next";
import TablePage from "@/components/shared/TablePage";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";

const PaymentMethods = () => {
  const { t } = useTranslation();

  const [
    getPaymentMethods,
    { data: paymentMethods = null, isLoading, isFetching },
  ] = useLazyGetPaymentMethodsQuery();
  const [SoftDeletePaymentMethod] = useSoftDeletePaymentMethodByIdMutation();
  const [HardDeletePaymentMethod] = useHardDeletePaymentMethodByIdMutation();
  const [RecoveryPaymentMethod] = useRecoveryPaymentMethodByIdMutation();
  const [SoftDeletePaymentMethodMass] =
    useSoftDeletePaymentMethodMassMutation();
  const [RecoveryPaymentMethodMass] = useRecoveryPaymentMethodMassMutation();

  const columns: ColumnDef<PaymentMethod>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.service"),
        accessorKey: "name",
        cell: function (props) {
          return useCustomLink(routePrefix.payment_method, props.row.original);
        },
      },
    ];
  }, []);

  return (
    <>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <TablePage<PaymentMethod>
        columns={columns}
        textConst={TableTextConst.PAYMENT_METHOD}
        data={paymentMethods}
        loading={isFetching}
        getData={(req) => getPaymentMethods(req)}
        SoftDelete={(req) => SoftDeletePaymentMethod(req)}
        HardDelete={(req) => HardDeletePaymentMethod(req)}
        Recovery={(req) => RecoveryPaymentMethod(req)}
        SoftDeleteMass={(req) => SoftDeletePaymentMethodMass(req)}
        RecoveryMass={(req) => RecoveryPaymentMethodMass(req)}
      />
    </>
  );
};

export default PaymentMethods;
