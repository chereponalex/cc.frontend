import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useHardDeleteQuestionByIdMutation,
  useLazyGetQuestionsQuery,
  useRecoveryQuestionByIdMutation,
  useRecoveryQuestionMassMutation,
  useSoftDeleteQuestionByIdMutation,
  useSoftDeleteQuestionMassMutation,
} from "@/services/RtkQueryService";
import { Question, TableTextConst } from "@/@types";
import { useTranslation } from "react-i18next";
import TablePage from "@/components/shared/TablePage";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import CreatNewQuestion from "./CreatNewQuestion";
import CardQuestion from "./CardQuestion";

const Questions = () => {
  const { t } = useTranslation();

  const [getQuestions, { data: questions = null, isLoading, isFetching }] =
    useLazyGetQuestionsQuery();
  const [SoftDelete] = useSoftDeleteQuestionByIdMutation();
  const [HardDelete] = useHardDeleteQuestionByIdMutation();
  const [Recovery] = useRecoveryQuestionByIdMutation();
  const [SoftDeleteQuestionMass] = useSoftDeleteQuestionMassMutation();
  const [RecoveryQuestionMass] = useRecoveryQuestionMassMutation();

  const columns: ColumnDef<Question>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.question"),
        accessorKey: "text",
        cell: function (props) {
          return useCustomLink(routePrefix.question, props.row.original, 90);
        },
      },
      {
        header: t("table.columnsHeader.answer"),
        accessorKey: "reply",
        cell: function (props) {
          return props.row.original.reply ? "Да" : "Нет";
        },
      },
    ];
  }, []);

  return (
    <>
      {methodInsert(document.getElementById("breadcrumbs"), "вопрос")}
      <TablePage<Question>
        childrenDrawer={{
          card: CardQuestion,
          create: CreatNewQuestion,
        }}
        columns={columns}
        textConst={TableTextConst.QUESTION}
        data={questions}
        loading={isFetching}
        getData={(req) => getQuestions(req)}
        SoftDelete={(req) => SoftDelete(req)}
        HardDelete={(req) => HardDelete(req)}
        Recovery={(req) => Recovery(req)}
        SoftDeleteMass={(req) => SoftDeleteQuestionMass(req)}
        RecoveryMass={(req) => RecoveryQuestionMass(req)}
      />
    </>
  );
};

export default Questions;
