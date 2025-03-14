import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useHardDeleteSettingByIdMutation,
  useLazyGetSettingsQuery,
  useRecoverySettingByIdMutation,
  useRecoverySettingMassMutation,
  useSoftDeleteSettingByIdMutation,
  useSoftDeleteSettingMassMutation,
} from "@/services/RtkQueryService";
import { Setting, TableTextConst } from "@/@types";
import { useTranslation } from "react-i18next";
import TablePage from "@/components/shared/TablePage";
import methodInsert from "@/utils/methodInsertBread";

const Settings = () => {
  const { t } = useTranslation();

  const [getSettings, { data: settings = null, isLoading, isFetching }] =
    useLazyGetSettingsQuery();
  const [SoftDeleteSettings] = useSoftDeleteSettingByIdMutation();
  const [HardDeleteSettings] = useHardDeleteSettingByIdMutation();
  const [RecoverySettings] = useRecoverySettingByIdMutation();
  const [SoftDeleteSettingMass] = useSoftDeleteSettingMassMutation();
  const [RecoverySettingMass] = useRecoverySettingMassMutation();

  const columns: ColumnDef<Setting>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "id",
      },
      {
        header: t("table.columnsHeader.name"),
        accessorKey: "name",
      },
      {
        header: t("table.columnsHeader.key"),
        accessorKey: "key",
      },
      {
        header: t("table.columnsHeader.value"),
        accessorKey: "value",
      },
    ];
  }, []);

  return (
    <>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <TablePage<Setting>
        columns={columns}
        textConst={TableTextConst.SETTINGS}
        data={settings}
        loading={isFetching}
        getData={(req) => getSettings(req)}
        SoftDelete={(req) => SoftDeleteSettings(req)}
        HardDelete={(req) => HardDeleteSettings(req)}
        Recovery={(req) => RecoverySettings(req)}
        SoftDeleteMass={(req) => SoftDeleteSettingMass(req)}
        RecoveryMass={(req) => RecoverySettingMass(req)}
      />
    </>
  );
};

export default Settings;
