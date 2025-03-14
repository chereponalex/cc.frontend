import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useHardDeleteMetroLineByIdMutation,
  useLazyGetMetroLinesQuery,
  useRecoveryMetroLineByIdMutation,
  useRecoveryMetroLineMassMutation,
  useSoftDeleteMetroLineByIdMutation,
  useSoftDeleteMetroLineMassMutation,
} from "@/services/RtkQueryService";
import { MetroLine, TableTextConst } from "@/@types";
import { useTranslation } from "react-i18next";
import TablePage from "@/components/shared/TablePage";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";

const LineMeter = () => {
  const { t } = useTranslation();

  const [getMetroLines, { data: metroLines = null, isLoading, isFetching }] =
    useLazyGetMetroLinesQuery();
  const [SoftDeleteMetroLine] = useSoftDeleteMetroLineByIdMutation();
  const [HardDeleteMetroLine] = useHardDeleteMetroLineByIdMutation();
  const [RecoveryMetroLine] = useRecoveryMetroLineByIdMutation();
  const [SoftDeleteMetroLineMass] = useSoftDeleteMetroLineMassMutation();
  const [RecoveryMetroLineMass] = useRecoveryMetroLineMassMutation();

  const columns: ColumnDef<MetroLine>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.city"),
        accessorKey: "city",
        cell: function (props) {
          return useCustomLink(routePrefix.city, props.row.original.city);
        },
      },
      {
        header: t("table.columnsHeader.color"),
        accessorKey: "color",
        cell: function (props) {
          const original = props.row.original;
          return (
            <div
              style={{
                backgroundColor: original.color,
                height: "6px",
                width: "100%",
              }}
            ></div>
          );
        },
      },
      {
        header: t("table.columnsHeader.designation"),
        accessorKey: "line",
        cell: function (props) {
          return useCustomLink(routePrefix.metro_line, props.row.original);
        },
      },
      {
        header: t("table.columnsHeader.typeLine"),
        accessorKey: "typeLine",
        cell: function (props) {
          return <span>{props.row.original.line_type.value}</span>;
        },
      },
    ];
  }, []);

  return (
    <>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <TablePage<MetroLine>
        columns={columns}
        textConst={TableTextConst.METRO_LINE}
        data={metroLines}
        loading={isFetching}
        getData={(req) => getMetroLines(req)}
        SoftDelete={(req) => SoftDeleteMetroLine(req)}
        HardDelete={(req) => HardDeleteMetroLine(req)}
        Recovery={(req) => RecoveryMetroLine(req)}
        SoftDeleteMass={(req) => SoftDeleteMetroLineMass(req)}
        RecoveryMass={(req) => RecoveryMetroLineMass(req)}
      />
    </>
  );
};

export default LineMeter;
