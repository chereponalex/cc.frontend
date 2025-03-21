import Table from "@/components/ui/Table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Button, ScrollBar, Select } from "../ui";
import { HiPlus, HiTrash } from "react-icons/hi";
import { TableTextConst } from "@/@types";

const { Tr, Th, Td, THead, TBody } = Table;

const TableScript = ({
  view,
  selectInfo,
  dataCollection,
  setDataColletion,
  loading,
}: any) => {
  const selectQuestions = selectInfo?.questions || [];
  const { t } = useTranslation();

  const getSelectedQuestionIds = (dataCollection: any[]) => {
    return dataCollection
      ?.map((row) => row.question_id)
      ?.filter((id) => id !== "");
  };

  const addQuestion = () => {
    const newRow: any = {
      question_id: "",
    };
    setDataColletion((prev: any) => {
      if (!prev) {
        return [newRow];
      } else return [...prev, newRow];
    });
  };

  const deleteQuestion = (index: number) => {
    setDataColletion((prev: any) => {
      return prev.filter((el: any, i: number) => index !== i);
    });
  };

  const optionsQuestions = useMemo(() => {
    const selectedQuestionIds = getSelectedQuestionIds(dataCollection);
    return selectQuestions
      ?.filter(
        (question: any) => !selectedQuestionIds?.includes(question.value),
      )
      ?.map((question: any) => ({
        label: question.label,
        value: question.value,
      }));
  }, [selectQuestions, dataCollection]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: t("table.columnsHeader.question"),
        accessorKey: "question_id",
        cell: (props) => {
          const questionId = props.getValue() as string;
          const selectedQuestion = selectQuestions.find(
            (q: any) => q.value === questionId,
          );
          const label = selectedQuestion ? selectedQuestion.label : "";
          const questionInfo: any = props.row.original;
          const valueObj = {
            value: props.getValue(),
            label: label || questionInfo?.text,
          };
          return (
            <>
              <Select
                size="xs"
                isLoading={loading}
                isDisabled={view}
                placeholder=""
                options={optionsQuestions as any}
                value={valueObj as any}
                onChange={(
                  question: { value: string; label: string } | null,
                ) => {
                  if (question) {
                    setDataColletion((prev: any) => {
                      let newState: any = [...prev];
                      newState[props.row.id] = {
                        ...newState[props.row.id],
                        question_id: question.value,
                      };
                      return newState;
                    });
                  }
                }}
              />
            </>
          );
        },
      },
      {
        header: t("table.columnsHeader.answer"),
        accessorKey: "answer",
        cell: (props) => {
          const questionId = props.row.original.question_id;
          const selectedQuestion = selectQuestions.find(
            (q: any) => q.value === questionId,
          );
          const answer = selectedQuestion ? selectedQuestion.answers : null;
          return <>{answer !== null ? (answer ? "Да" : "Нет") : ""}</>;
        },
      },
      ...(!view
        ? [
            {
              header: "Удалить",
              accessorKey: "delete_question",
              cell: (props: any) => {
                const rowIndex = props.row.index;
                return (
                  <Button
                    type="button"
                    shape="circle"
                    variant="plain"
                    size="xs"
                    icon={<HiTrash />}
                    onClick={() => deleteQuestion(rowIndex)}
                  />
                );
              },
            },
          ]
        : []),
    ],
    [optionsQuestions, selectQuestions, view],
  );

  const table: any = useReactTable({
    columns,
    data: dataCollection,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Table noScrolling>
        <THead
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            paddingBottom: "5px",
          }}
        >
          {table.getHeaderGroups().map((headerGroup: any) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => {
                return (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ textAlign: "center" }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </Th>
                );
              })}
            </Tr>
          ))}
        </THead>
        <TBody style={{ textAlign: "center" }}>
          {table.getRowModel().rows.map((row: any) => {
            return (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell: any) => {
                  return (
                    <Td key={cell.id} className="">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </TBody>
        {!view && (
          <div
            style={{
              display: "flex",
              width: "100%",
              marginTop: "20px",
              borderTop: "0",
            }}
          >
            <Button
              type="button"
              className="float-left"
              icon={<HiPlus />}
              onClick={() => addQuestion()}
            >
              {t(`${TableTextConst.SCRIPT}Page.buttons.addNewQuestion`)}
            </Button>
          </div>
        )}
      </Table>
    </>
  );
};

export default TableScript;

// import Table from "@/components/ui/Table";
// import { ColumnDef } from "@tanstack/react-table";
// import { useMemo } from "react";
// import {
//   useReactTable,
//   flexRender,
//   getCoreRowModel,
// } from "@tanstack/react-table";
// import { useTranslation } from "react-i18next";
// import { Button, ScrollBar, Select } from "../ui";
// import { HiPlus, HiTrash } from "react-icons/hi";
// import { TableTextConst } from "@/@types";

// const { Tr, Th, Td, THead, TBody } = Table;

// const TableScript = ({
//   view,
//   selectInfo,
//   dataCollection,
//   setDataColletion,
//   loading,
// }: any) => {
//   const selectQuestions = selectInfo?.questions || {};
//   const answers = selectInfo?.answers || {};
//   console.log(selectQuestions, 'selectQuestions')
//   const { t } = useTranslation();

//   const addQuestion = () => {
//     const newRow: any = {
//       question_id: "",
//     };
//     setDataColletion((prev: any) => {
//       if (!prev) {
//         return [newRow];
//       } else return [...prev, newRow];
//     });
//   };

//   const deleteQuestion = (index: number) => {
//     setDataColletion((prev: any) => {
//       return prev.filter((el: any, i: number) => index !== i);
//     });
//   };
//   const optionsQuestions = useMemo(() => {
//     const data = Object.entries(selectQuestions);
//     return data.map(([id, value]) => ({
//       label: value,
//       value: id,
//     }));
//   }, [selectQuestions]);

//   const columns = useMemo<ColumnDef<any>[]>(
//     () => [
//       {
//         header: t("table.columnsHeader.question"),
//         accessorKey: "question_id",
//         cell: (props) => {
//           const label = selectQuestions[`${props.getValue()}`] || "";
//           const questionInfo: any = props.row.original;
//           const valueObj = {
//             value: props.getValue(),
//             label: label || questionInfo?.text,
//           };
//           return (
//             <>
//               <Select
//                 size="xs"
//                 isLoading={loading}
//                 isDisabled={view}
//                 placeholder=""
//                 options={optionsQuestions as any}
//                 value={valueObj as any}
//                 onChange={(
//                   question: { value: string; label: string } | null,
//                 ) => {
//                   if (question) {
//                     setDataColletion((prev: any) => {
//                       let newState: any = [...prev];
//                       newState[props.row.id] = {
//                         ...newState[props.row.id],
//                         question_id: question.value,
//                       };
//                       return newState;
//                     });
//                   }
//                 }}
//               />
//             </>
//           );
//         },
//       },
//       {
//         header: t("table.columnsHeader.answer"),
//         accessorKey: "answer",
//         cell: (props) => {
//           const label = answers[`${props.row.original.question_id}`];
//           return <>{label ? label?.value : props.row.original.reply}</>;
//         },
//       },
//       ...(!view
//         ? [
//             {
//               header: "Удалить",
//               accessorKey: "delete_question",
//               cell: (props: any) => {
//                 const rowIndex = props.row.index;
//                 return (
//                   <Button
//                     type="button"
//                     shape="circle"
//                     variant="plain"
//                     size="xs"
//                     icon={<HiTrash />}
//                     onClick={() => deleteQuestion(rowIndex)}
//                   />
//                 );
//               },
//             },
//           ]
//         : []),
//     ],
//     [optionsQuestions, answers, view],
//   );

//   const table: any = useReactTable({
//     columns,
//     data: dataCollection,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   return (
//     <>
//       <Table noScrolling>
//         <THead
//           style={{
//             position: "sticky",
//             top: 0,
//             zIndex: 2,
//             paddingBottom: "5px",
//           }}
//         >
//           {table.getHeaderGroups().map((headerGroup: any) => (
//             <Tr key={headerGroup.id}>
//               {headerGroup.headers.map((header: any) => {
//                 return (
//                   <Th
//                     key={header.id}
//                     colSpan={header.colSpan}
//                     style={{ textAlign: "center" }}
//                   >
//                     {flexRender(
//                       header.column.columnDef.header,
//                       header.getContext(),
//                     )}
//                   </Th>
//                 );
//               })}
//             </Tr>
//           ))}
//         </THead>
//         <TBody style={{ textAlign: "center" }}>
//           {table.getRowModel().rows.map((row: any) => {
//             return (
//               <Tr key={row.id}>
//                 {row.getVisibleCells().map((cell: any) => {
//                   return (
//                     <Td key={cell.id} className="">
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext(),
//                       )}
//                     </Td>
//                   );
//                 })}
//               </Tr>
//             );
//           })}
//         </TBody>
//         {!view && (
//           <div
//             style={{
//               display: "flex",
//               width: "100%",
//               marginTop: "20px",
//               borderTop: "0",
//             }}
//           >
//             <Button
//               type="button"
//               className="float-left"
//               icon={<HiPlus />}
//               onClick={() => addQuestion()}
//             >
//               {t(`${TableTextConst.SCRIPT}Page.buttons.addNewQuestion`)}
//             </Button>
//           </div>
//         )}
//       </Table>
//     </>
//   );
// };

// export default TableScript;
