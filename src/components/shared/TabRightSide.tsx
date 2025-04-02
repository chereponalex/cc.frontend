import { useTranslation } from "react-i18next";
import Tabs from "../ui/Tabs";
import TabContent from "../ui/Tabs/TabContent";
import TabList from "../ui/Tabs/TabList";
import TabNav from "../ui/Tabs/TabNav";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TypeRightSideTab } from "@/@types/tabs";
import { Button, FormItem, Input, Select, toast } from "../ui";
import "../../views/ManagerPage/index.css";
import { CallInfo, Question } from "@/@types";
import Radio from "@/components/ui/Radio";
import { useSearchParams } from "react-router-dom";
import accordanceParams from "@/utils/accordanceParams";
import parse from "html-react-parser";
import useDarkMode from "@/utils/hooks/useDarkmode";
import compareAnswers from "@/utils/compareAnswers";
import cs from "classnames";
import { useAppDispatch, sendMapWSMessage, useAppSelector } from "@/store";
import useStorage from "@/utils/hooks/useStorage";
import { transFormToOrigin } from "@/utils/transformQuestion";
import "../../views/ManagerPage/index.css";
import Loading from "./Loading";
import {
  setActiveTransfer,
  setClearUisInfo,
  setUisInfo,
} from "@/store/slices/uis";
import { ToastType } from "@/@types/toast";
import Notification from "@/components/ui/Notification";
import CustomCollapse from "./CustomCollapse";
import infoScriptFunc from "@/utils/infoScriptFunc";
import CoinsUp from "./CoinsUp";
import { DURATION_ANIMATION } from "@/constants/map.constant";

type ButtonState = {
  hold: "hold";
  unhold: "unhold";
};

const RadioComponent = ({
  setCurQuestion,
  reply,
  index,
  setClientInformation,
  value,
  onNextHandle,
}: any) => {
  const [alert, setAlert] = useState<string | null>(null);
  const [isDark] = useDarkMode();

  useEffect(() => {
    if (reply) {
      if (reply === value) {
        setCurQuestion(index + 1);
        setAlert(null);
      } else if (reply !== value && value) {
        setAlert("Неверный ответ");
        setCurQuestion(index);
      } else if (!value) {
        setAlert(null);
      }
    }
  }, [value]);

  const onChangeRadio = (val: string) => {
    setClientInformation(val, index);
    onNextHandle(val, index);
  };

  return (
    <div key={value || "null"} className="flex items-center mt-1">
      <Radio.Group value={value} onChange={onChangeRadio}>
        <Radio value="Да">Да</Radio>
        <Radio value="Нет">Нет</Radio>
      </Radio.Group>
      {alert && (
        <p
          style={{
            textAlign: "center",
            // marginTop: "5px",
            // marginLeft: "5px",
            // color: !isDark ? "black" : "white",
            color: "rgb(228, 106, 118)",
            // background: "rgb(228, 106, 118)",
            // boxShadow: "rgb(228, 106, 118) 0px 0px 2px 2px",
            fontSize: "10px",
            fontWeight: 900,
          }}
        >
          {alert}
        </p>
      )}
    </div>
  );
};

const TabRightSide = ({
  offers,
  payment,
  location,
  description,
  infoScript,
  setClientInformation,
  clientInformation,
  collectStatFransfer,
  createTransferLoading,
  currentTab,
  setCurrentTab,
  object,
  inputValue,
  setInputValue,
  real_estate_building,
  unHoldCall,
  endCall,
  transferCall,
  setChecked,
  setInfoScript,
  setPhone,
  disabled,
  setIsAnimation,
  isAnimation,
  developer
}: any) => {
  const fetchLoading = useRef(false);
  const dispatch = useAppDispatch();
  const sessionCallId = useAppSelector(
    (state) => state.uis?.uisInfo?.call_session_id,
  );
  const legIDClient = useAppSelector((state) => state.uis?.legIDClient);
  const activeTransfer = useAppSelector((state) => state.uis?.active_transfer);
  const clientNumber = useAppSelector(
    (state) => state?.uis?.uisInfo?.contact_info?.contact_phone_number,
  );
  const communicationId = useAppSelector(
    (state) => state.uis?.uisInfo?.communication_id,
  );
  const callBegin = useAppSelector((state) => state.uis?.uisEvent);
  const engineerMode = useAppSelector((state) => state.map.engineerMode);

  const user = useStorage().getItem("user");
  const [emptyFields, setEmptyFields] = useState<{
    [key: string]: boolean;
  }>({});
  const [queryParams, _] = useSearchParams();
  const [curQuestion, setCurQuestion] = useState<any>({
    ["PRESENTATION"]: 0,
    ["QUESTION"]: 0,
    ["TRANSFER"]: 0,
  });
  const [btnState, setBtnState] =
    useState<ButtonState["hold" | "unhold"]>("unhold");

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification
        duration={7000}
        title={t(`toast.title.${type}`)}
        type={type}
      >
        {text}
      </Notification>,
    );
  };

  const questionsOrder = {
    ["PRESENTATION"]:
      offers?.scripts?.PRESENTATION?.questions.map(
        (el: { id: string }) => el.id,
      ) || [],
    ["QUESTION"]:
      offers?.scripts?.QUESTION?.questions.map((el: { id: string }) => el.id) ||
      [],
    ["TRANSFER"]:
      offers?.scripts?.TRANSFER?.questions.map((el: { id: string }) => el.id) ||
      [],
  };

  const { t } = useTranslation();
  const [isDark] = useDarkMode();
  const onNext = (collectInfo: any, type: string) => {
    const allParams = Object.fromEntries(queryParams);
    const filteredData = Object.fromEntries(
      Object.entries(allParams).filter(
        ([key, value]) => value !== "" && value !== "false",
      ),
    );
    const textScriptData = {
      ["PRESENTATION"]: {
        ...collectInfo["PRESENTATION"],
        questions: transFormToOrigin(
          collectInfo["PRESENTATION"]?.questions || {},
          offers?.scripts
            ? offers?.scripts["PRESENTATION"]?.questions || []
            : [],
          {
            ...object,
            developer: developer?.name,
            name: inputValue?.name,
            payment_method: inputValue?.payment,
            real_estate_building,
            uniqueness_period: offers?.uniqueness_period,
          },
        ),
      },
      ["QUESTION"]: {
        ...collectInfo["QUESTION"],
        questions: transFormToOrigin(
          collectInfo["QUESTION"]?.questions || {},
          offers?.scripts ? offers?.scripts["QUESTION"].questions || [] : [],
          {
            ...object,
            developer: developer?.name,
            name: inputValue?.name,
            payment_method: inputValue?.payment,
            real_estate_building,
            uniqueness_period: offers?.uniqueness_period,
          },
        ),
      },
      ["TRANSFER"]: {
        ...collectInfo["TRANSFER"],
        questions: transFormToOrigin(
          collectInfo["TRANSFER"]?.questions || {},
          offers?.scripts ? offers?.scripts["TRANSFER"]?.questions || [] : [],
          {
            ...object,
            developer: developer?.name,
            name: inputValue?.name,
            payment_method: inputValue?.payment,
            real_estate_building,
            uniqueness_period: offers?.uniqueness_period,
          },
        ),
      },
    };

    collectStatFransfer(
      {
        filters: filteredData,
        scripts: textScriptData,
        original_scripts: collectInfo,
        object: collectInfo.object.hasOwnProperty("reply")
          ? collectInfo.object
          : [{}],
        hooks: [{}],
        offer: offers,
        employee: user && JSON.parse(user),
        call_info: {
          client_phone_number: clientNumber?.toString(),
          call_id: sessionCallId?.toString(),
          communication_id: communicationId?.toString(),
        },
        "rest-data": [{}],
        client_name: inputValue?.name || "",
      },
      type,
    );
  };

  const handleHoldCall = async (
    sessionID: number,
    legIDClient: number,
    addExternalNumber: string,
  ) => {
    handleTransferCall(sessionID, legIDClient, addExternalNumber);
  };

  const handleTransferCall = async (
    sessionID: number,
    legIDClient: number,
    addExternalNumber: string,
  ) => {
    try {
      if (btnState === "unhold") {
        fetchLoading.current = true;
        const transfer = await transferCall({
          call_session_id: sessionID.toString(),
          add_external_number: addExternalNumber.toString(),
        });
        if (!transfer?.data?.success) {
          throw transfer;
        }
        if (
          transfer?.data?.success &&
          offers.scripts.TRANSFER.type.key === "SILENT_TRANSLATION"
        ) {
          handleEndCall(sessionID, legIDClient);
          setTimeout(() => {
            setCurrentTab(TypeRightSideTab.PRESENTATION);
          }, DURATION_ANIMATION);
        } else if (transfer?.data?.success) {
          setBtnState("hold");
          fetchLoading.current = false;
          setCurrentTab(TypeRightSideTab.TRANSFER);
        } else {
          setCurrentTab(TypeRightSideTab.TRANSFER);
        }
      }
      if (btnState === "hold") {
        try {
          fetchLoading.current = true;
          const unhold = await unHoldCall({
            call_session_id: sessionID.toString(),
          }).unwrap();
          if (!unhold?.success) {
            throw unhold;
          } else if (unhold?.success) {
            fetchLoading.current = false;
            setBtnState("unhold");
          }
        } catch (error) {
          openNotification(
            ToastType.DANGER,
            //@ts-ignore
            t(`toast.message.system.unHoldError`),
          );
        }
      }
    } catch (error) {
      console.error(error);
      openNotification(
        ToastType.DANGER,
        //@ts-ignore
        error?.message || t(`toast.message.system.transferError`),
      );
    } finally {
      fetchLoading.current = false;
    }
  };

  const handleEndCall = async (sessionID: number, legID: number) => {
    try {
      const end = await endCall({
        call_session_id: sessionID.toString(),
        leg_id: legID.toString(),
      });
      if (end?.data?.success) {
        setIsAnimation(true);
        setTimeout(() => {
          dispatch(setActiveTransfer(null));
          dispatch(setClearUisInfo());
          setClientInformation({
            PRESENTATION: { questions: {} },
            QUESTION: { questions: {} },
            TRANSFER: { questions: {} },
            object: {},
          });
          setChecked({});
          setInfoScript(null);
          setInputValue("");
          // setPhone("");
          setIsAnimation(false);
        }, DURATION_ANIMATION);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (activeTransfer === null) {
      setClientInformation({
        PRESENTATION: { questions: {} },
        QUESTION: { questions: {} },
        TRANSFER: { questions: {} },
        object: {},
      });
      setChecked({});
      setInfoScript(null);
      setInputValue("");
      setCurQuestion({
        ["PRESENTATION"]: 0,
        ["QUESTION"]: 0,
        ["TRANSFER"]: 0,
      });
      setBtnState("unhold");
      if (!engineerMode && isAnimation) {
        setTimeout(() => {
          setCurrentTab(TypeRightSideTab.PRESENTATION);
        }, DURATION_ANIMATION);
      } else {
        setCurrentTab(TypeRightSideTab.PRESENTATION);
      }
    }
  }, [activeTransfer]);

  useEffect(() => {
    setClientInformation({
      PRESENTATION: { questions: {} },
      QUESTION: { questions: {} },
      TRANSFER: { questions: {} },
      object: {},
    });
  }, [queryParams]);

  useEffect(() => {
    setEmptyFields({
      name: !inputValue.name,
      payment: !inputValue.payment,
    });
  }, [inputValue]);

  useEffect(() => {
    if (infoScript === null) {
      clientInformation["object"] = {};
    } else if (
      compareAnswers(
        offers?.scripts?.PRESENTATION?.questions,
        clientInformation["PRESENTATION"]?.questions,
      ) &&
      clientInformation["object"].reply === "Да" &&
      currentTab === TypeRightSideTab.PRESENTATION
    ) {
      setCurrentTab(TypeRightSideTab.QUESTIONS);
    }
  }, [clientInformation, infoScript]);

  const onNextHandle = (BLOCK: string, value: any, question?: Question) => {
    if (
      sessionCallId &&
      clientNumber &&
      offers &&
      callBegin === "STARTING_A_CONVERSATION"
    ) {
      let newQuestions = { ...(clientInformation[BLOCK]?.questions || {}) };
      if (question) {
        newQuestions[question?.id] = value;
      }
      let nextState = {};
      if (BLOCK === "object") {
        nextState = {
          ...clientInformation,
          object: { objectInfo: infoScript, reply: value },
        };
      } else {
        nextState = {
          ...clientInformation,
          [BLOCK]: {
            ...clientInformation[BLOCK],
            questions: {
              ...newQuestions,
            },
            script_text: offers?.scripts?.[BLOCK]?.text,
          },
        };
      }

      const type =
        Object.keys(clientInformation["PRESENTATION"].questions).length === 0 &&
        activeTransfer === null
          ? "create"
          : "update";
      onNext(nextState, type);
    }
  };

  const options = useMemo(() => {
    return payment?.map((el: any) => ({
      label: el.name,
      value: el.id,
    }));
  }, [payment]);

  return (
    <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}>
      <TabList
        className="pl-1 pr-1"
        style={{
          fontSize: "14px",
          justifyContent: "space-around",
        }}
      >
        <TabNav value={TypeRightSideTab.PRESENTATION}>
          {t("tabsText.presentation")}
        </TabNav>
        <TabNav
          value={TypeRightSideTab.QUESTIONS}
          disabled={
            !engineerMode &&
            (!compareAnswers(
              offers?.scripts?.PRESENTATION?.questions,
              clientInformation["PRESENTATION"]?.questions,
            ) ||
              !clientInformation["object"].hasOwnProperty("reply") ||
              clientInformation["object"].reply === "Нет" ||
              infoScript === null)
          }
        >
          {t("tabsText.questions")}
        </TabNav>
        <TabNav
          value={TypeRightSideTab.TRANSFER}
          disabled={
            !engineerMode &&
            (!inputValue.name ||
              !inputValue.payment ||
              !compareAnswers(
                offers?.scripts?.QUESTION?.questions,
                clientInformation["QUESTION"]?.questions,
              ) ||
              !clientInformation["object"].hasOwnProperty("reply") ||
              clientInformation["object"].reply === "Нет" ||
              infoScript === null)
          }
        >
          {t("tabsText.transfer")}
        </TabNav>
      </TabList>
      <div className="py-4 mb-4">
        <Loading loading={createTransferLoading}>
          <TabContent value={TypeRightSideTab.PRESENTATION}>
            <div>
              <div className={`container_presentation`}>
                <div className="mb-3">
                  <h6 style={{ fontSize: "14px", fontWeight: 900 }}>
                    Расположение:
                  </h6>
                  <p
                    style={{
                      fontSize: "14px",
                      color: !isDark ? "black" : "white",
                    }}
                  >
                    {location && parse(location)}
                  </p>
                </div>
                {offers?.scripts?.PRESENTATION?.questions?.length > 0 && (
                  <div className="mt-1">
                    {offers?.scripts?.PRESENTATION?.text && (
                      <p
                        style={{
                          fontSize: "14px",
                          padding: "2px 0px 7px",
                          color: !isDark ? "black" : "white",
                        }}
                      >
                        {parse(offers?.scripts?.PRESENTATION?.text)}
                      </p>
                    )}
                    {offers?.scripts?.PRESENTATION?.questions.map(
                      (question: Question, index: number) => {
                        return (
                          <div
                            key={question.id}
                            className={`item_question ${
                              index > curQuestion["PRESENTATION"] &&
                              !disabled &&
                              "disabled_question"
                            }`}
                          >
                            <h6
                              style={{
                                fontSize: "14px",
                                lineHeight: "16px",
                              }}
                            >
                              {/* {index + 1}.{" "} */}
                              {question?.text &&
                                parse(
                                  accordanceParams(question?.text, {
                                    ...object,
                                    developer: developer.name,
                                    uniqueness_period:
                                      offers?.uniqueness_period,
                                    name: inputValue?.name,
                                    payment_method: inputValue?.payment || "__",
                                    real_estate_building,
                                  }),
                                )}
                            </h6>
                            <div>
                              <RadioComponent
                                onNextHandle={(value: any) =>
                                  onNextHandle("PRESENTATION", value, question)
                                }
                                value={
                                  clientInformation["PRESENTATION"]?.questions[
                                    question?.id
                                  ]
                                }
                                setClientInformation={(value: string) => {
                                  if (index < curQuestion["PRESENTATION"]) {
                                    setClientInformation((prev: any) => {
                                      let newQuestions: {
                                        [key: string]: string;
                                      } = {};
                                      questionsOrder["PRESENTATION"].forEach(
                                        (id: string, i: number) => {
                                          if (index === i) {
                                            newQuestions[id] =
                                              prev["PRESENTATION"].questions[
                                                id
                                              ];
                                          }
                                        },
                                      );
                                      newQuestions[question.id] = value;
                                      return {
                                        ...prev,
                                        ["PRESENTATION"]: {
                                          ...prev["PRESENTATION"],
                                          questions: {
                                            ...newQuestions,
                                          },
                                          script_text:
                                            offers?.scripts?.PRESENTATION?.text,
                                        },
                                      };
                                    });
                                  } else {
                                    setClientInformation((prev: any) => ({
                                      ...prev,
                                      ["PRESENTATION"]: {
                                        ...prev["PRESENTATION"],
                                        questions: {
                                          ...prev["PRESENTATION"]?.questions,
                                          [question.id]: value,
                                        },
                                        script_text:
                                          offers?.scripts?.PRESENTATION?.text,
                                      },
                                    }));
                                  }
                                }}
                                setCurQuestion={(value: number) => {
                                  setCurQuestion((prev: any) => ({
                                    ...prev,
                                    ["PRESENTATION"]: value,
                                  }));
                                }}
                                reply={question.reply}
                                index={index}
                              />
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
                <div className="mb-3">
                  <CustomCollapse text={description && parse(description)} />
                  {/* <h6 style={{ fontSize: "14px", fontWeight: 900 }}>
                    Описание:
                  </h6>
                  <p
                    style={{
                      fontSize: "14px",
                      color: !isDark ? "black" : "white",
                    }}
                  >
                    {description && parse(description)}
                  </p> */}
                </div>
                <div
                  className={`${
                    !compareAnswers(
                      offers?.scripts?.PRESENTATION?.questions,
                      clientInformation["PRESENTATION"]?.questions,
                    ) && "cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`h-32 ${
                      !compareAnswers(
                        offers?.scripts?.PRESENTATION?.questions,
                        clientInformation["PRESENTATION"]?.questions,
                      ) &&
                      !disabled &&
                      "disabled_question"
                    }`}
                  >
                    <h6 style={{ fontSize: "14px", fontWeight: 900 }}>
                      Подбор квартиры:
                    </h6>
                    <p
                      style={{
                        fontSize: "14px",
                        color: !isDark ? "black" : "white",
                      }}
                    >
                      {parse(infoScriptFunc(infoScript))}
                    </p>
                    {infoScript && (
                      <RadioComponent
                        onNextHandle={(value: any) =>
                          onNextHandle("object", value)
                        }
                        value={clientInformation.object?.reply}
                        setClientInformation={(value: string) => {
                          setClientInformation((prev: any) => ({
                            ...prev,
                            object: { objectInfo: infoScript, reply: value },
                          }));
                        }}
                        setCurQuestion={(value: number) => {
                          setCurQuestion((prev: any) => ({
                            ...prev,
                            ["object"]: value,
                          }));
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabContent>
        </Loading>
        <TabContent value={TypeRightSideTab.QUESTIONS}>
          <div
            className={`${
              callBegin === null &&
              callBegin !== "STARTING_A_CONVERSATION" &&
              !engineerMode &&
              !isAnimation &&
              "cursor-not-allowed"
            }`}
          >
            <div
              className={`${
                callBegin === null &&
                callBegin !== "STARTING_A_CONVERSATION" &&
                !engineerMode &&
                !isAnimation &&
                "disabled_question"
              }`}
            >
              <>
                <FormItem
                  label="Как Вас зовут?"
                  layout="horizontal"
                  style={{ fontSize: "13px", padding: 0, textAlign: "start" }}
                >
                  <Input
                    size="xs"
                    className={cs({
                      "invalid-input": emptyFields.name,
                    })}
                    placeholder="Введите имя клиента"
                    value={inputValue.name}
                    onChange={(e) =>
                      setInputValue((prev: any) => {
                        return { ...prev, name: e.target.value };
                      })
                    }
                  />
                </FormItem>
                <FormItem
                  label="Какой способ оплаты у Вас?"
                  layout="horizontal"
                  style={{ fontSize: "13px", padding: 0, textAlign: "start" }}
                >
                  <Select
                    size="xs"
                    className={cs({
                      "invalid-input": emptyFields.payment,
                    })}
                    style={{ width: "00px" }}
                    options={payment?.length > 0 ? options : []}
                    placeholder=""
                    value={options?.filter(
                      (el: { label: string; value: string }) => {
                        return el.label === inputValue.payment;
                      },
                    )}
                    onChange={(e: any) =>
                      setInputValue((prev: any) => {
                        return { ...prev, payment: e.label };
                      })
                    }
                  />
                </FormItem>
              </>

              {offers?.scripts?.QUESTION?.questions.length > 0 && (
                <div className="container_questions">
                  {offers?.scripts?.QUESTION?.text && (
                    <p
                      style={{
                        fontSize: "14px",
                        padding: "2px 0px 7px",
                        color: !isDark ? "black" : "white",
                      }}
                    >
                      {parse(offers?.scripts?.QUESTION?.text)}
                    </p>
                  )}
                  {offers?.scripts?.QUESTION?.questions.map(
                    (question: Question, index: number) => {
                      return (
                        <div
                          key={question.id}
                          className={`item_question ${
                            index > curQuestion["QUESTION"] &&
                            !engineerMode &&
                            "disabled_question"
                          }`}
                        >
                          <h6
                            style={{
                              fontSize: "14px",
                              lineHeight: "16px",
                              marginRight: "5px",
                            }}
                          >
                            {/* {index + 1}.{" "} */}
                            {question?.text &&
                              parse(
                                accordanceParams(question?.text, {
                                  ...object,
                                  developer: developer.name,
                                  uniqueness_period: offers?.uniqueness_period,
                                  name: inputValue?.name,
                                  payment_method: inputValue?.payment || "__",
                                  real_estate_building,
                                }),
                              )}
                          </h6>
                          <div>
                            <RadioComponent
                              onNextHandle={(value: any) =>
                                onNextHandle("QUESTION", value, question)
                              }
                              value={
                                clientInformation["QUESTION"]?.questions[
                                  question.id
                                ]
                              }
                              setClientInformation={(value: string) => {
                                if (index < curQuestion["QUESTION"]) {
                                  setClientInformation((prev: any) => {
                                    let newQuestions: {
                                      [key: string]: string;
                                    } = {};
                                    questionsOrder["QUESTION"].forEach(
                                      (id: string, i: number) => {
                                        if (index === i) {
                                          newQuestions[id] =
                                            prev["QUESTION"].questions[id];
                                        }
                                      },
                                    );
                                    newQuestions[question.id] = value;
                                    return {
                                      ...prev,
                                      ["QUESTION"]: {
                                        ...prev["QUESTION"],
                                        questions: {
                                          ...newQuestions,
                                        },
                                        script_text:
                                          offers?.scripts?.QUESTION?.text,
                                      },
                                    };
                                  });
                                } else {
                                  setClientInformation((prev: any) => ({
                                    ...prev,
                                    ["QUESTION"]: {
                                      ...prev["QUESTION"],
                                      questions: {
                                        ...prev["QUESTION"].questions,
                                        [question.id]: value,
                                      },
                                      script_text:
                                        offers?.scripts?.QUESTION?.text,
                                    },
                                  }));
                                }
                              }}
                              setCurQuestion={(value: number) => {
                                setCurQuestion((prev: any) => ({
                                  ...prev,
                                  ["QUESTION"]: value,
                                }));
                              }}
                              reply={question.reply}
                              index={index}
                            />
                          </div>
                        </div>
                      );
                    },
                  )}
                  <div
                    style={{ width: "100%" }}
                    className="flex justify-center"
                  >
                    <div
                      style={{ width: "50%" }}
                      className="flex flex-col justify-center mt-5 relative"
                    >
                      <CoinsUp value={isAnimation} />
                      <Button
                        loading={fetchLoading.current}
                        variant="solid"
                        size="xs"
                        type="button"
                        disabled={
                          !inputValue.name ||
                          !inputValue.payment ||
                          !compareAnswers(
                            offers?.scripts?.QUESTION?.questions,
                            clientInformation["QUESTION"]?.questions,
                          ) ||
                          !clientInformation["object"].hasOwnProperty(
                            "reply",
                          ) ||
                          clientInformation["object"].reply === "Нет" ||
                          infoScript === null ||
                          !sessionCallId
                        }
                        onClick={() => {
                          sessionCallId &&
                            legIDClient &&
                            handleHoldCall(
                              sessionCallId,
                              legIDClient,
                              offers?.add_external_number,
                            );
                        }}
                      >
                        {btnState === "unhold"
                          ? "Начать перевод"
                          : "Вернуться к клиенту"}
                      </Button>
                    </div>
                  </div>
                  <p
                    className="mt-1"
                    style={{ fontSize: "10px", textAlign: "center" }}
                  >
                    Перевод возможен во время разговора с клиентом
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabContent>
        <TabContent value={TypeRightSideTab.TRANSFER}>
          <div
            className={`container_transfer ${
              callBegin === null &&
              callBegin !== "STARTING_A_CONVERSATION" &&
              !engineerMode &&
              !isAnimation &&
              "cursor-not-allowed"
            }`}
          >
            <div
              className={`${
                callBegin === null &&
                callBegin !== "STARTING_A_CONVERSATION" &&
                !engineerMode &&
                !isAnimation &&
                "disabled_question"
              }`}
            >
              {/* {offers?.scripts?.TRANSFER?.text && (
              <>
                <h6 style={{ fontSize: "14px", fontWeight: 900 }}>Скрипт перевода:</h6>
                <p
                  style={{
                    fontSize: "14px",
                    color: !isDark ? "black" : "white",
                    padding: "2px 0px 7px",
                  }}
                >
                  {parse(offers?.scripts?.TRANSFER?.text)}
                </p>
              </>
            )} */}

              {offers?.scripts?.TRANSFER?.questions.map(
                (question: Question, index: number) => {
                  return (
                    <div
                      key={question.id}
                      className={`item_question ${
                        index > curQuestion["QUESTION"] &&
                        !engineerMode &&
                        "disabled_question"
                      }`}
                    >
                      <h6
                        style={{
                          fontSize: "14px",
                          lineHeight: "16px",
                          marginRight: "5px",
                        }}
                      >
                        {/* {index + 1}.{" "} */}
                        {question?.text &&
                          parse(
                            accordanceParams(question?.text, {
                              ...object,
                              developer: developer.name,
                              uniqueness_period: offers?.uniqueness_period,
                              name: inputValue?.name,
                              payment_method: inputValue?.payment || "__",
                              real_estate_building,
                            }),
                          )}
                      </h6>
                      <div>
                        {/* <p
                          style={{
                            color: !isDark ? "black" : "white",
                            fontSize: "14px",
                          }}
                        >
                          Выберите ответ
                        </p> */}
                        <RadioComponent
                          onNextHandle={(value: any) =>
                            onNextHandle("TRANSFER", value, question)
                          }
                          value={
                            clientInformation["TRANSFER"]?.questions[
                              question?.id
                            ]
                          }
                          setClientInformation={(value: string) => {
                            if (index < curQuestion["TRANSFER"]) {
                              setClientInformation((prev: any) => {
                                let newQuestions: { [key: string]: string } =
                                  {};
                                questionsOrder["TRANSFER"].forEach(
                                  (id: string, i: number) => {
                                    if (index === i) {
                                      newQuestions[id] =
                                        prev["TRANSFER"].questions[id];
                                    }
                                  },
                                );
                                newQuestions[question.id] = value;
                                return {
                                  ...prev,
                                  ["TRANSFER"]: {
                                    ...prev["TRANSFER"],
                                    questions: {
                                      ...newQuestions,
                                    },
                                    script_text:
                                      offers?.scripts?.TRANSFER?.text,
                                  },
                                };
                              });
                            } else {
                              setClientInformation((prev: any) => ({
                                ...prev,
                                ["TRANSFER"]: {
                                  ...prev["TRANSFER"],
                                  questions: {
                                    ...prev["TRANSFER"].questions,
                                    [question.id]: value,
                                  },
                                  script_text: offers?.scripts?.TRANSFER?.text,
                                },
                              }));
                            }
                          }}
                          setCurQuestion={(value: number) => {
                            setCurQuestion((prev: any) => ({
                              ...prev,
                              ["TRANSFER"]: value,
                            }));
                          }}
                          reply={question.reply}
                          index={index}
                        />
                      </div>
                    </div>
                  );
                },
              )}
              {offers?.scripts?.TRANSFER?.text && (
                <>
                  <h6 style={{ fontSize: "14px" }}>Указания по переводу:</h6>
                  <p
                    style={{
                      fontSize: "12px",
                      color: !isDark ? "black" : "white",
                      padding: "0px 5px",
                    }}
                  >
                    {parse(offers?.scripts?.TRANSFER?.text)}
                  </p>
                </>
              )}

              <div style={{ width: "100%" }} className="flex justify-center">
                <div
                  style={{ width: "100%" }}
                  className="flex flex-row justify-around mt-5"
                >
                  <Button
                    style={{ width: "150px" }}
                    variant="solid"
                    size="xs"
                    loading={fetchLoading.current}
                    disabled={
                      btnState === "unhold" ||
                      !inputValue.name ||
                      !inputValue.payment ||
                      !compareAnswers(
                        offers?.scripts?.QUESTION?.questions,
                        clientInformation["QUESTION"]?.questions,
                      ) ||
                      !clientInformation["object"].hasOwnProperty("reply") ||
                      clientInformation["object"].reply === "Нет" ||
                      infoScript === null ||
                      !sessionCallId
                    }
                    type="button"
                    onClick={() => {
                      sessionCallId &&
                        legIDClient &&
                        handleHoldCall(
                          sessionCallId,
                          legIDClient,
                          offers?.add_external_number,
                        );
                      setCurrentTab(TypeRightSideTab.QUESTIONS);
                    }}
                  >
                    Вернуться к клиенту
                  </Button>
                  <div className="relative">
                    <CoinsUp value={isAnimation} />
                    <Button
                      style={{ width: "150px" }}
                      variant="solid"
                      size="xs"
                      disabled={
                        !compareAnswers(
                          offers?.scripts?.TRANSFER?.questions,
                          clientInformation["TRANSFER"]?.questions,
                        ) ||
                        !clientInformation["object"].hasOwnProperty("reply") ||
                        clientInformation["object"].reply === "Нет" ||
                        infoScript === null ||
                        !sessionCallId
                      }
                      type="button"
                      onClick={() => {
                        sessionCallId &&
                          legIDClient &&
                          handleEndCall(sessionCallId, legIDClient);
                        if (
                          offers.scripts.TRANSFER.type.key !==
                          "SILENT_TRANSLATION"
                        ) {
                          // openNotification(
                          //   ToastType.SUCCESS,
                          //   t(`toast.message.call.ordinary`)
                          // );
                        }
                        setTimeout(() => {
                          setCurrentTab(TypeRightSideTab.PRESENTATION);
                        }, DURATION_ANIMATION);
                      }}
                    >
                      Перевести
                    </Button>
                  </div>
                </div>
              </div>
              <p
                className="mt-1"
                style={{ fontSize: "10px", textAlign: "center" }}
              >
                Перевод возможен во время разговора с отделом продаж
              </p>
            </div>
          </div>
        </TabContent>
      </div>
    </Tabs>
  );
};

export default TabRightSide;

// const sendSocketMessage = async () => {
//   // const response = await callHold({ id: "123", name: "123" }).unwrap();
//   // if (response) {
//   dispatch(
//     sendMapWSMessage({
//       message: "test value",
//       channel: `${employee_id}` || "",
//     })
//   );
//   // }
// };
