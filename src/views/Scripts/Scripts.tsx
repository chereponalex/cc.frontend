import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useHardDeleteScriptByIdMutation,
  useLazyGetScriptsQuery,
  useRecoveryScriptByIdMutation,
  useRecoveryScriptMassMutation,
  useSoftDeleteScriptByIdMutation,
  useSoftDeleteScriptMassMutation,
} from "@/services/RtkQueryService";
import { Script, TableTextConst } from "@/@types";
import { useTranslation } from "react-i18next";
import TablePage from "@/components/shared/TablePage";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import Dialog from "@/components/ui/Dialog";
import { Button } from "@/components/ui";
import methodInsert from "@/utils/methodInsertBread";

const Scripts = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});

  const openDialog = (rowId: string) => {
    setIsOpen((prev) => ({
      ...prev,
      [rowId]: true,
    }));
  };

  const onDialogClose = (rowId: string) => {
    setIsOpen((prev) => ({
      ...prev,
      [rowId]: false,
    }));
  };

  const [getScripts, { data: scripts = null, isLoading, isFetching }] =
    useLazyGetScriptsQuery();
  const [SoftDeleteScript] = useSoftDeleteScriptByIdMutation();
  const [HardDeleteScript] = useHardDeleteScriptByIdMutation();
  const [RecoveryScript] = useRecoveryScriptByIdMutation();
  const [SoftDeleteScriptMass] = useSoftDeleteScriptMassMutation();
  const [RecoveryScriptMass] = useRecoveryScriptMassMutation();

  const columns: ColumnDef<Script>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.name"),
        accessorKey: "name",
        cell: function (props) {
          return useCustomLink(routePrefix.script, props.row.original);
        },
      },
      {
        header: t("table.columnsHeader.script"),
        accessorKey: "text",
        cell: function (props) {
          return (
            <>
              {props.row.original?.text ? (
                <Button
                  size="xs"
                  style={{ padding: "4px" }}
                  variant="plain"
                  onClick={() => openDialog(props.row.original.id)}
                >
                  <p style={{ textDecoration: "underline" }}>Посмотреть</p>
                </Button>
              ) : (
                "-"
              )}

              <Dialog
                width={580}
                isOpen={isOpen[props.row.original.id]}
                onClose={() => onDialogClose(props.row.original.id)}
                onRequestClose={() => onDialogClose(props.row.original.id)}
              >
                <div className="flex flex-col h-full justify-between">
                  <h6>Скрипт:</h6>
                  {props.row.original?.text}
                </div>
              </Dialog>
            </>
          );
        },
      },
      {
        header: t("table.columnsHeader.script_location"),
        accessorKey: "script",
        cell: function (props) {
          return <>{props.row.original?.script_location?.value}</>;
        },
      },
    ];
  }, [isOpen]);

  return (
    <>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <TablePage<Script>
        columns={columns}
        textConst={TableTextConst.SCRIPT}
        data={scripts}
        loading={isFetching}
        getData={(req) => getScripts(req)}
        SoftDelete={(req) => SoftDeleteScript(req)}
        HardDelete={(req) => HardDeleteScript(req)}
        Recovery={(req) => RecoveryScript(req)}
        SoftDeleteMass={(req) => SoftDeleteScriptMass(req)}
        RecoveryMass={(req) => RecoveryScriptMass(req)}
      />
    </>
  );
};

export default Scripts;
