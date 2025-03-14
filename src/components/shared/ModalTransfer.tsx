import Dialog from "@/components/ui/Dialog";
import { useTranslation } from "react-i18next";
import parse from "html-react-parser";
import { Radio } from "@/components/ui";
import { ScrollBar } from "../ui";

const RadioComponent = ({ value }: any) => {
  return (
    <div className="cursor-not-allowed">
      <Radio.Group
        className="custom_disabled"
        color="green-500"
        value={value}
        key={value}
      >
        <Radio value="Да">Да</Radio>
        <Radio value="Нет">Нет</Radio>
      </Radio.Group>
    </div>
  );
};

const ModalTransfer = ({ openData, setIsOpen }: any) => {
  const { t } = useTranslation();
  const scriptTypeTranslations: { [key: string]: string } = {
    PRESENTATION: t(`tabsText.presentation`),
    QUESTION: t(`tabsText.questions`),
    TRANSFER: t(`tabsText.transfer`),
  };

  const copiedScripts = { ...openData?.original?.scripts };
  delete copiedScripts.location;

  return (
    <Dialog
      width={580}
      isOpen={openData !== null}
      onClose={() => setIsOpen(null)}
      onRequestClose={() => setIsOpen(null)}
    >
      <ScrollBar autoHide autoHeight autoHeightMax="80vh" direction="ltr">
        <div className="flex flex-col justify-between pr-5">
          <div>
            {Object.keys(copiedScripts || {})?.map((blockType) => {
              return (
                <div key={blockType} className="mb-3">
                  <h6>{scriptTypeTranslations[blockType] || blockType}</h6>
                  <p className="flex flex-col">
                    <div className="flex flex-row">
                      <p className="mr-1">{t(`table.columnsHeader.script`)}:</p>
                      <p>
                        {copiedScripts[blockType]?.script_text
                          ? parse(copiedScripts[blockType]?.script_text)
                          : "Нет"}
                      </p>
                    </div>
                    {scriptTypeTranslations[blockType] === "PRESENTATION" ||
                      (blockType === "PRESENTATION" && (
                        <>
                          <p className="mr-1">
                            {t(`table.columnsHeader.location`)}:
                          </p>
                          <p>{openData?.original?.scripts?.location}</p>
                        </>
                      ))}
                  </p>
                  <ul>
                    {Object.entries(copiedScripts[blockType]?.questions)?.map(
                      ([question, answer], index: number) => (
                        <li key={question} className="mb-1">
                          <div className="flex flex-col">
                            <p>{t(`tabsText.question`)}:</p>
                            <div className="flex flex-col">
                              <p>
                                {" "}
                                {/* {index + 1} {"-"} */}
                                {parse(question)}
                              </p>
                              <RadioComponent value={answer} />
                            </div>
                          </div>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollBar>
    </Dialog>
  );
};

export default ModalTransfer;
