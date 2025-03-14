import { useEffect, useState, memo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useCreateReportMutation,
  useHardDeleteTransferByIdMutation,
  useLazyGetTransfersQuery,
  useRecoveryTransferByIdMutation,
  useRecoveryTransferMassMutation,
  useSoftDeleteTransferByIdMutation,
  useSoftDeleteTransferMassMutation,
} from "@/services/RtkQueryService";
import {
  StatusReconnected,
  StatusTransfer,
  TableTextConst,
  Transfer,
} from "@/@types";
import { useTranslation } from "react-i18next";
import TablePage from "@/components/shared/TablePage";
import useCustomLink from "@/utils/hooks/useCustomLink";
import { Loading } from "@/components/shared";
import { ActionLink } from "@/components/shared";
import cutString from "@/utils/cutString";
import usePrefix from "@/utils/hooks/usePrefix";
import "./index.css";
import { useAppDispatch, useAppSelector } from "@/store";
import cs from "classnames";
import methodInsert from "@/utils/methodInsertBread";
import Dialog from "@/components/ui/Dialog";
import { Button, Radio, toast } from "@/components/ui";
import parse from "html-react-parser";
import routePrefix from "@/configs/routes.config/routePrefix";
import { ToastType } from "@/@types/toast";
import Notification from "@/components/ui/Notification";
import { setLoadingReport } from "@/store/slices/report";
import { setEntityTransfers } from "@/store/slices/entities";
import ModalTransfer from "@/components/shared/ModalTransfer";
import { HiEye } from "react-icons/hi";
import { IoCopy } from "react-icons/io5";
import { Tooltip } from "@/components/ui";

const { CALL_ONLINE, CALL_FAILED, TRANSFER_FAILED, CALL_SUCCESS } =
  StatusTransfer;

const { NO, YES } = StatusReconnected;

const Transfers = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [getTransfers, { data: transfers = null, isLoading, isFetching }] =
    useLazyGetTransfersQuery();
  const [columns, setColumns] = useState<ColumnDef<Transfer>[]>([]);
  const [isOpen, setIsOpen] = useState<Record<string, any> | null>(null);

  const { mode } = useAppSelector((state) => state.theme);
  const dataRedux = useAppSelector((state) => state.entities.transfers.data);

  useEffect(() => {
    return () => {
      dispatch(setEntityTransfers({ data: null, filters: [] }));
    };
  }, []);

  useEffect(() => {
    setColumns(columnsDynamic(transfers?.data));
    dispatch(setEntityTransfers(transfers));
  }, [transfers]);

  const [createReport, { data: report = null, isLoading: isLoadingreport }] =
    useCreateReportMutation();
  const [SoftDeleteTransfer] = useSoftDeleteTransferByIdMutation();
  const [HardDeleteTransfer] = useHardDeleteTransferByIdMutation();
  const [RecoveryTransfer] = useRecoveryTransferByIdMutation();
  const [SoftDeleteTransferMass] = useSoftDeleteTransferMassMutation();
  const [RecoveryTransferMass] = useRecoveryTransferMassMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };
  const handleCreateReport = async (req: { [key: string]: string }) => {
    try {
      const report = await createReport(req);
      //@ts-ignore
      if (report?.data?.success) {
        dispatch(setLoadingReport(true));
      }
    } catch (error) {
      console.log(error);
      // @ts-ignore
      openNotification(ToastType.WARNING, error.message);
    }
  };

  const openDialog = (row: { [key: string]: any }, type: string) => {
    setIsOpen({ ...row, type });
  };

  const columnsDynamic = (restData: any): ColumnDef<Transfer>[] => {
    const uniqueKeys = new Map();
    restData?.forEach((item: any) => {
      Object.keys(item).forEach((key) => {
        if (key !== "id" && key !== "int_id" && key !== "links") {
          if (
            typeof item[key] === "object" &&
            !Array.isArray(item[key]) &&
            item[key] !== null
          ) {
            uniqueKeys.set(key, item[key]);
          } else uniqueKeys.set(key, false);
        }
      });
    });
    return Array.from(uniqueKeys, ([header, accessorKey]) => {
      let resultStr = "";
      if (accessorKey && accessorKey.hasOwnProperty("name")) {
        resultStr = `${header}.name`;
      } else if (accessorKey && accessorKey.hasOwnProperty("value")) {
        resultStr = `${header}.value`;
      }

      return {
        header: t(`table.columnsHeader.${header}`),
        accessorKey: accessorKey ? resultStr : `${header}`,
        cell: (props: any) => {
          // @ts-ignore
          let data = props.row.original[header];
          let prefix = usePrefix(header);

          if (
            (typeof data === "object" &&
              data?.hasOwnProperty("PRESENTATION")) ||
            data?.hasOwnProperty("QUESTION") ||
            data?.hasOwnProperty("TRANSFER")
          ) {
            return (
              <div className="flex justify-center">
                <Button
                  size="xs"
                  style={{ padding: "4px" }}
                  variant="plain"
                  onClick={() => openDialog(props.row, "scripts")}
                  icon={<HiEye size={17} />}
                >
                  {/* <p style={{ textDecoration: "underline" }}>Посмотреть12312</p> */}
                </Button>
              </div>
            );
          } else if (
            typeof data === "object" &&
            data?.hasOwnProperty("location") &&
            !data?.hasOwnProperty("PRESENTATION")
          ) {
            return <>{t("global.noDataAvailable")}</>;
          }
          if (Array.isArray(data)) {
            return (
              <>
                {data.length > 0 &&
                  data?.map((audio: string, index: number) => {
                    return (
                      <div key={index}>
                        <audio
                          className={cs({
                            "dark-mode": mode === "dark",
                          })}
                          // type="audio/mp3"
                          preload="metadata"
                          style={{
                            height: "15px",
                            width: "250px",
                            marginBottom: "2px",
                          }}
                          controls
                          src={`${audio?.link}`}
                        ></audio>
                      </div>
                    );
                  })}
              </>
            );
          }
          if (data?.full_name) {
            return (
              <ActionLink
                target="_blank"
                to={`${routePrefix.employee}/${data?.id}`}
              >
                {data?.full_name}
              </ActionLink>
            );
          }
          if (data?.links && prefix) {
            return useCustomLink(prefix, data);
          }

          if (typeof data !== "object") {
            const regexRusPhone = /^7\d{10}$/;
            if (regexRusPhone.test(data)) {
              const handleCopy = () => {
                navigator.clipboard
                  .writeText(data)
                  .then(() => {
                    openNotification(ToastType.SUCCESS, "Номер скопирован");
                  })
                  .catch((err) => {
                    openNotification(
                      ToastType.DANGER,
                      `Ошибка при копировании:${err}`,
                    );
                  });
              };
              return (
                <Tooltip title={"Скопировать номер"} wrapperClass="block">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={handleCopy}
                  >
                    {data} <IoCopy size={12} />
                  </div>
                </Tooltip>
              );
            }
            return data;
          }

          if (data?.value) {
            const backGroundColor = (data: any) => {
              switch (data?.value) {
                case CALL_ONLINE:
                  return "#01a9f4";
                case CALL_FAILED:
                  return "#e46a76";
                case TRANSFER_FAILED:
                  return "#ffc10e";
                case CALL_SUCCESS:
                  return "#00c292";
                case YES:
                  return "#00c292";
                case NO:
                  return "#e46a76";
                default:
                  return "";
              }
            };

            return (
              <div className="flex items-center justify-center">
                <span
                  style={{
                    marginRight: "5px",
                    minWidth: "5px",
                    minHeight: "5px",
                    borderRadius: "50%",
                    background: backGroundColor(data)
                      ? backGroundColor(data)
                      : "",
                    boxShadow: backGroundColor(data)
                      ? `0px 0px 2px 2px ${backGroundColor(data)}`
                      : "",
                  }}
                ></span>
                <span style={{ color: backGroundColor(data) }}>
                  {data.value}
                </span>
              </div>
            );
          }

          if (data?.start) {
            return data.start;
          }

          return data;
        },
      };
    });
  };

  return (
    <>
      <Loading loading={isLoading}></Loading>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <ModalTransfer openData={isOpen} setIsOpen={setIsOpen} />
      <TablePage<Transfer>
        noActions
        noCheckBoxes
        noTab
        noBtn
        columns={columns}
        textConst={TableTextConst.TRANSFER}
        data={dataRedux}
        loading={isFetching}
        loadingReport={isLoadingreport}
        createReport={(req) => handleCreateReport(req)}
        getData={(req) => getTransfers(req)}
        SoftDelete={(req) => SoftDeleteTransfer(req)}
        HardDelete={(req) => HardDeleteTransfer(req)}
        Recovery={(req) => RecoveryTransfer(req)}
        SoftDeleteMass={(req) => SoftDeleteTransferMass(req)}
        RecoveryMass={(req) => RecoveryTransferMass(req)}
      />
    </>
  );
};

export default Transfers;
