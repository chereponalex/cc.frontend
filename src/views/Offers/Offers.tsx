import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import {
  useHardDeleteOfferByIdMutation,
  useLazyGetOffersQuery,
  useRecoveryOfferByIdMutation,
  useRecoveryOfferMassMutation,
  useSoftDeleteOfferByIdMutation,
  useSoftDeleteOfferMassMutation,
  useUpdateOfferByIdMutation,
} from "@/services/RtkQueryService";
import { Offer, TableTextConst } from "@/@types";
import { useTranslation } from "react-i18next";
import TablePage from "@/components/shared/TablePage";
import useCustomLink from "@/utils/hooks/useCustomLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import { Button, Switcher, toast } from "@/components/ui";
import { ToastType } from "@/@types/toast";
import Notification from "@/components/ui/Notification";
import Dialog from "@/components/ui/Dialog";
import TableWorkHoursBindOffer from "@/components/shared/TableWorkHoursBindOffer";
import methodInsert from "@/utils/methodInsertBread";
import { useAppSelector } from "@/store";
import CardOffer from "./CardOffer";
import CreatNewOffer from "./CreatNewOffer";

const SwitcherComponent = ({ value, onClick }: any) => {
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions,
  );
  const updateKey = `api.v1.crm.${TableTextConst.OFFER}.update`;
  const onSwitcherToggle = () => {
    onClick(!value);
  };

  return (
    <div>
      <Switcher
        // disabled={!permissions[updateKey]}
        checked={value}
        color="green-500"
        onChange={onSwitcherToggle}
      />
    </div>
  );
};

const Offers = () => {
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions,
  );
  const viewKeyWorkTime = `api.v1.crm.${TableTextConst.WORK_TIME}.view`;
  const viewKeyScript = `api.v1.crm.${TableTextConst.SCRIPT}.view`;
  const [softDeleteOfferMass] = useSoftDeleteOfferMassMutation();
  const [recoveryOfferMassMutation] = useRecoveryOfferMassMutation();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<Record<string, any>>({});
  const openDialog = (rowId: string, type: string) => {
    setIsOpen((prev) => ({
      ...prev,
      [type]: { [rowId]: true },
    }));
  };

  const onDialogClose = (rowId: string, type: string) => {
    setIsOpen((prev) => ({
      ...prev,
      [type]: { [rowId]: false },
    }));
  };

  const maxLength = 40;
  const [getOffers, { data: offers = null, isLoading, isFetching }, refetch] =
    useLazyGetOffersQuery();
  const [SoftDeleteOffer] = useSoftDeleteOfferByIdMutation();
  const [HardDeleteOffer] = useHardDeleteOfferByIdMutation();
  const [RecoveryOffer] = useRecoveryOfferByIdMutation();
  const [UpdateData, { data: offer = null, isLoading: isLoadingUpdate }] =
    useUpdateOfferByIdMutation();
  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleUpdate = async (value: boolean, id: string) => {
    try {
      await UpdateData({
        id,
        is_active: value,
      }).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.OFFER}.update`),
      );
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  const columns: ColumnDef<Offer>[] = useMemo(() => {
    return [
      {
        header: t("table.columnsHeader.id"),
        accessorKey: "int_id",
      },
      {
        header: t("table.columnsHeader.offeractive"),
        accessorKey: "isActive",
        cell: (props) => {
          const value: any = props.getValue();
          const rowId = props.row.original.id;
          return (
            <SwitcherComponent
              value={value}
              onClick={(v: any) => handleUpdate(v, rowId)}
            />
          );
        },
      },
      {
        header: t("table.columnsHeader.priority"),
        accessorKey: "priority",
        cell: (props) => {
          return <>{props.row.original.priority}</>;
        },
      },
      {
        header: t("table.columnsHeader.name"),
        accessorKey: "name",
        cell: function (props) {
          return (
            <div style={{ whiteSpace: "nowrap" }}>
              {useCustomLink(routePrefix.offer, props.row.original, 20)}
            </div>
          );
        },
      },
      {
        header: t("table.columnsHeader.expertOffers"),
        accessorKey: "expert_mode",
        cell: (props) => {
          const is_expert = props.row.original.expert_mode;
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {is_expert ? (
                <IoIosCheckmarkCircleOutline color="green" size={"24"} />
              ) : (
                <MdOutlineCancel color="#ef4444" size={"24"} />
              )}
            </div>
          );
        },
      },
      {
        header: t("table.columnsHeader.marketplace"),
        accessorKey: "marketplace.name",
        cell: function (props) {
          return useCustomLink(
            routePrefix.marketplace,
            props.row.original.marketplace,
            maxLength,
          );
        },
      },
      {
        header: t("table.columnsHeader.city"),
        accessorKey: "city.name",
        cell: function (props) {
          return useCustomLink(
            routePrefix.city,
            props.row.original.city,
            maxLength,
          );
        },
      },
      {
        header: t("table.columnsHeader.developer"),
        accessorKey: "developer.name",
        cell: function (props) {
          return useCustomLink(
            routePrefix.developer,
            props.row.original.developer,
            maxLength,
          );
        },
      },
      {
        header: t("table.columnsHeader.nameObject"),
        accessorKey: "realEstateBuilding.name",
        cell: function (props) {
          return useCustomLink(
            routePrefix.real_estate_building,
            props.row.original.realEstateBuilding,
            maxLength,
          );
        },
      },
      {
        header: t("table.columnsHeader.script"),
        accessorKey: "script.name",
        cell: function (props) {
          return (
            <>
              {
                Object.entries(props.row.original.scripts || {}).length > 0 && (
                  // permissions[viewKeyScript] ? (
                  <Button
                    size="xs"
                    style={{ padding: "4px" }}
                    variant="plain"
                    onClick={() => openDialog(props.row.original.id, "script")}
                  >
                    <p style={{ textDecoration: "underline" }}>Посмотреть</p>
                  </Button>
                )
                // ) : (
                //   "-"
                // )
              }

              <Dialog
                width={580}
                isOpen={isOpen?.script?.[props.row.original.id]}
                onClose={() => onDialogClose(props.row.original.id, "script")}
                onRequestClose={() =>
                  onDialogClose(props.row.original.id, "script")
                }
              >
                <div className="flex flex-col h-full justify-between">
                  {" "}
                  <ul>
                    {Object.entries(props.row.original.scripts || {}).map(
                      ([key, script]: any) => (
                        <li key={script?.id} className="mb-2">
                          <h6>Название: {script?.name}</h6>
                          <p>
                            Относится к:{" "}
                            {script?.script_location?.value || "Не указано"}
                          </p>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </Dialog>
            </>
          );
          // return useCustomLink(
          //   routePrefix.script,
          //   props.row.original.script,
          //   maxLength,
          // );
        },
      },
      {
        header: t("table.columnsHeader.price"),
        accessorKey: "price",
      },
      {
        header: t("table.columnsHeader.reward"),
        accessorKey: "operator_award",
      },
      {
        header: t("table.columnsHeader.sipUri"),
        accessorKey: "sip_uri",
      },
      {
        header: t("table.columnsHeader.workTime"),
        accessorKey: "work_time",
        cell: (props) => {
          return (
            <>
              {/* {permissions[viewKeyWorkTime] ? ( */}
              <Button
                size="xs"
                style={{ padding: "4px" }}
                variant="plain"
                onClick={() => openDialog(props.row.original.id, "work_time")}
              >
                <p style={{ textDecoration: "underline" }}>Посмотреть</p>
              </Button>
              {/* ) : (
                "-"
              )} */}
              <Dialog
                width={580}
                isOpen={isOpen?.work_time?.[props.row.original.id]}
                onClose={() =>
                  onDialogClose(props.row.original.id, "work_time")
                }
                onRequestClose={() =>
                  onDialogClose(props.row.original.id, "work_time")
                }
              >
                <div className="flex flex-col h-full justify-between">
                  <TableWorkHoursBindOffer
                    data={props.row.original.work_time}
                  />
                </div>
              </Dialog>
            </>
          );
        },
      },
      {
        header: t("table.columnsHeader.period_of_uniqueness"),
        accessorKey: "uniqueness_period",
      },
      {
        header: t("table.columnsHeader.limit_call"),
        accessorKey: "limit",
      },
      {
        header: t("table.columnsHeader.findFor"),
        accessorKey: "not_looking_for_himself",
        cell: (props) => {
          const not_looking_for_himself = props.getValue();
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {not_looking_for_himself ? (
                <IoIosCheckmarkCircleOutline color="green" size={"24"} />
              ) : (
                <MdOutlineCancel color="#ef4444" size={"24"} />
              )}
            </div>
          );
        },
      },
      {
        header: t("table.columnsHeader.outsideCity"),
        accessorKey: "client_is_out_of_town",
        cell: (props) => {
          const client_is_out_of_town = props.getValue();
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {client_is_out_of_town ? (
                <IoIosCheckmarkCircleOutline color="green" size={"24"} />
              ) : (
                <MdOutlineCancel color="#ef4444" size={"24"} />
              )}
            </div>
          );
        },
        // cell: function (props) {
        //   return useCustomLink(routePrefix.offer, props.row.original);
        // },
      },
    ];
  }, [isOpen]);

  return (
    <>
      {methodInsert(document.getElementById("breadcrumbs"))}
      <TablePage<Offer>
        childrenDrawer={{
          card: CardOffer,
          create: CreatNewOffer,
        }}
        columns={columns}
        textConst={TableTextConst.OFFER}
        data={offers}
        loading={isFetching || isLoadingUpdate}
        SoftDeleteMass={(req) => softDeleteOfferMass(req)}
        RecoveryMass={(req) => recoveryOfferMassMutation(req)}
        getData={(req) => getOffers(req)}
        SoftDelete={(req) => SoftDeleteOffer(req)}
        HardDelete={(req) => HardDeleteOffer(req)}
        Recovery={(req) => RecoveryOffer(req)}
      />
    </>
  );
};

export default Offers;
