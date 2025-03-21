import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useHardDeleteTagByIdMutation,
  useLazyGetTagsQuery,
  useRecoveryTagByIdMutation,
  useRecoveryTagMassMutation,
  useSoftDeleteTagByIdMutation,
  useSoftDeleteTagMassMutation,
} from "@/services/RtkQueryService";
import { TableTextConst, Tag } from "@/@types";
import { useTranslation } from "react-i18next";
import TablePage from "@/components/shared/TablePage";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import CardTag from "./CardTag";
import CreatNewTag from "./CreatNewTag";

const Tags = () => {
  const { t } = useTranslation();

  const [getTags, { data: tags = null, isLoading, isFetching }] =
    useLazyGetTagsQuery();
  const [SoftDeleteTag] = useSoftDeleteTagByIdMutation();
  const [HardDeleteTag] = useHardDeleteTagByIdMutation();
  const [RecoveryTag] = useRecoveryTagByIdMutation();
  const [RecoveryTagMass] = useRecoveryTagMassMutation();
  const [SoftDeleteTagMass] = useSoftDeleteTagMassMutation();

  const columns: ColumnDef<Tag>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.name"),
        accessorKey: "name",
        cell: function (props) {
          return useCustomLink(routePrefix.tag, props.row.original);
        },
      },
    ];
  }, []);

  return (
    <>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <TablePage<Tag>
        childrenDrawer={{
          card: CardTag,
          create: CreatNewTag,
        }}
        columns={columns}
        textConst={TableTextConst.TAG}
        data={tags}
        loading={isFetching}
        getData={(req) => getTags(req)}
        SoftDelete={(req) => SoftDeleteTag(req)}
        HardDelete={(req) => HardDeleteTag(req)}
        Recovery={(req) => RecoveryTag(req)}
        SoftDeleteMass={(req) => SoftDeleteTagMass(req)}
        RecoveryMass={(req) => RecoveryTagMass(req)}
      />
    </>
  );
};

export default Tags;
