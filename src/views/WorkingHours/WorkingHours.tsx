import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useHardDeleteWorkTimeByIdMutation,
  useLazyGetWorkTimesQuery,
  useRecoveryWorkTimeByIdMutation,
  useRecoveryWorkTimeMassMutation,
  useSoftDeleteWorkTimeByIdMutation,
  useSoftDeleteWorkTimeMassMutation,
} from "@/services/RtkQueryService";
import { WorkTime, TableTextConst } from "@/@types";
import { useTranslation } from "react-i18next";
import TablePage from "@/components/shared/TablePage";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";

const daysOfTheWeekOptions = [
  { label: "Все дни", value: 0 },
  { label: "Понедельник", value: 1 },
  { label: "Вторник", value: 2 },
  { label: "Среда", value: 3 },
  { label: "Четверг", value: 4 },
  { label: "Пятница", value: 5 },
  { label: "Суббота", value: 6 },
  { label: "Воскресенье", value: 7 },
];

const WorkingHours = () => {
  const { t } = useTranslation();

  const [getWorkTimes, { data: workTimes = null, isLoading, isFetching }] =
    useLazyGetWorkTimesQuery();
  const [SoftDeleteWorkTime] = useSoftDeleteWorkTimeByIdMutation();
  const [HardDeleteWorkTime] = useHardDeleteWorkTimeByIdMutation();
  const [RecoveryWorkTime] = useRecoveryWorkTimeByIdMutation();
  const [SoftDeleteWorkTimeMass] = useSoftDeleteWorkTimeMassMutation();
  const [RecoveryWorkTimeMass] = useRecoveryWorkTimeMassMutation();

  const columns: ColumnDef<WorkTime>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.offer"),
        accessorKey: "offer",
        cell: function (props) {
          return useCustomLink(routePrefix.offer, props.row.original.offer);
        },
      },
      {
        header: t("table.columnsHeader.daysOfTheWeek"),
        accessorKey: "day",
        cell: (props) => (
          <div>
            {/*@ts-ignore*/}
            <span>{`${
              daysOfTheWeekOptions.find((el) => el.value === props.getValue())
                ?.label || t("global.noDataAvailable")
            }`}</span>
          </div>
        ),
      },
      {
        header: t("table.columnsHeader.timeStart"),
        accessorKey: "start",
        cell: (props) => (
          <div>
            {/*@ts-ignore*/}
            <span>{`${props.getValue() || t("global.noDataAvailable")}`}</span>
          </div>
        ),
      },
      {
        header: t("table.columnsHeader.timeEnd"),
        accessorKey: "end",
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
    <>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <TablePage<WorkTime>
        columns={columns}
        textConst={TableTextConst.WORK_TIME}
        data={workTimes}
        loading={isFetching}
        getData={(req) => getWorkTimes(req)}
        SoftDelete={(req) => SoftDeleteWorkTime(req)}
        HardDelete={(req) => HardDeleteWorkTime(req)}
        Recovery={(req) => RecoveryWorkTime(req)}
        SoftDeleteMass={(req) => SoftDeleteWorkTimeMass(req)}
        RecoveryMass={(req) => RecoveryWorkTimeMass(req)}
      />
    </>
  );
};

export default WorkingHours;
