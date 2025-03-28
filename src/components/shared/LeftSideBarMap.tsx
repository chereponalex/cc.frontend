import { Filter, TypeFilter } from "@/@types";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, ScrollBar, Select } from "../ui";
import Checkbox from "@/components/ui/Checkbox";
import { components, ValueContainerProps } from "react-select";
import { useSearchParams } from "react-router-dom";
import { ConfigProvider, InputNumber, Slider, SliderSingleProps } from "antd";
import useDarkMode from "@/utils/hooks/useDarkmode";
import { useLazyGetMapFiltersQuery } from "@/services/RtkQueryService";
import Loading from "./Loading";
import { useTranslation } from "react-i18next";
import "../../views/ManagerPage/index.css";
import { separateNumbers } from "@/utils/separateNumbers";
import replaceSequence from "@/utils/replaceSequence";
import transformOptionsToString from "@/utils/transformOptionsToString";
import usePrevious from "@/utils/hooks/usePrevious";
import ModeSwitcher from "../template/ThemeConfigurator/ModeSwitcher";
import setMarkerActive from "@/utils/setMarkerActive";

interface FilterData extends Filter {
  value: any | null;
}

const Range = ({
  value,
  onChange,
  min,
  max,
}: {
  value: [number, number];
  onChange: (val: string) => void;
  min: number;
  max: number;
}) => {
  const [isDark] = useDarkMode();
  const [curState, setCurState] = useState<number[]>([]);
  const onChangeHandler = (range: any) => {
    onChange(range.join("-"));
    setCurState(range);
  };

  useEffect(() => {
    if (value) {
      setCurState(value);
    }
  }, [value]);

  const formatter: NonNullable<SliderSingleProps["tooltip"]>["formatter"] = (
    value,
  ) => {
    if (!value) {
      return "0 ₽";
    }
    return `${separateNumbers(value * 1000000)} ₽`;
  };

  const thousandSeparatorValue = (number: number) => {
    const integerPart = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return integerPart;
  };
  const handleInputChange = (index: number, newValue: number) => {
    const clampedValue = Math.max(min, Math.min(max, newValue));
    const newRange = [...curState];
    newRange[index] = clampedValue;
    setCurState(newRange);
    onChange(newRange.join("-"));
  };

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            InputNumber: {
              activeBorderColor: "#7c3aed",
              hoverBorderColor: "none",
              inputFontSize: 13,
            },
            Slider: {
              handleActiveColor: "none",
              handleLineWidthHover: 2.5,
              handleActiveOutlineColor: "none",
              handleSizeHover: 10,
              handleSize: 10,
              railSize: 3,
              dotSize: 2,
              dotBorderColor: "red",
              railBg: isDark ? "#ffff" : "#d1d5db",
              railHoverBg: isDark ? "#ffff" : "#d1d5db",
            },
          },
        }}
      >
        <div className="flex justify-between">
          <div className="input-flex-align">
            <InputNumber
              key={`${min}-${max}`}
              style={{ backgroundColor: isDark ? "#101827" : "#ffff" }}
              min={min}
              max={max}
              // value={thousandSeparatorValue(curState[0])}
              value={curState[0]}
              onChange={(value) => {
                const parsedValue =
                  value && parseInt(value.toString().replace(/\D/g, ""));
                handleInputChange(0, Number(parsedValue));
              }}
            />
            <p className="ml-1">000 000 ₽</p>
          </div>
          <div className="input-flex-align">
            <InputNumber
              key={`${min}-${max}`}
              style={{ backgroundColor: isDark ? "#101827" : "#ffff" }}
              min={min}
              max={max}
              value={curState[1]}
              // value={thousandSeparatorValue(curState[1])}
              onChange={(value) => {
                const parsedValue =
                  value && parseInt(value.toString().replace(/\D/g, ""));
                handleInputChange(1, Number(parsedValue));
              }}
            />
            <p className="ml-1">000 000 ₽</p>
          </div>
        </div>
        <Slider
          key={`${min}-${max}`}
          tooltip={{ placement: "right", formatter }}
          range
          min={min}
          max={max}
          value={curState}
          onChangeComplete={onChangeHandler}
          onChange={(range: any) => {
            setCurState(range);
          }}
        />
      </ConfigProvider>
    </>
  );
};

const Option = (props: any) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
          style={{ marginTop: "-10px" }}
        />
        <label style={{ marginLeft: "10px" }}>{props.label}</label>
      </components.Option>
    </div>
  );
};

const NoOptionsMessage = (props: any) => {
  const { t } = useTranslation();
  return (
    <components.NoOptionsMessage {...props}>
      <span>{t(`select.noOptions`)}</span>
    </components.NoOptionsMessage>
  );
};

const ValueContainer = ({
  children,
  ...props
}: ValueContainerProps<{
  value: string;
  label: string;
}>) => {
  let [values, input] = children as any;

  if (Array.isArray(values)) {
    const plural = values.length === 1 ? "" : "о";
    values = `${values.length} выбран${plural}`;
  }

  return (
    <>
      <components.ValueContainer {...props}>
        <p style={{ fontSize: "14px" }}>{values}</p>
        {input}
      </components.ValueContainer>
    </>
  );
};

const ElementTypeComponent = ({
  element,
  value,
  onChange,
  loading,
  isDark,
  getMapFilters,
  count = 0,
}: {
  element: {
    name: string;
    type: string;
    options: { value: string; label: string }[] | any;
    label: string;
    placeholder?: string;
  };
  getMapFilters: any;
  loading?: boolean;
  value: string | null;
  onChange: (key: string, value: any) => void;
  isDark: boolean;
  count?: number;
}) => {
  const { t } = useTranslation();
  switch (element.type) {
    case TypeFilter.SELECT:
      const [queryParams, setQueryParams] = useSearchParams();
      const cityId = queryParams.get("city");
      const selected = useMemo(() => {
        return element.options.length > 0
          ? element.options.find((el: { value: string; label: string }) => {
              return el.value === value;
            }) || null
          : null;
      }, [value]);

      function replaceCountLabel(str: string, count: number) {
        const regex = /\((\d+)\)/;
        const match = str.match(regex);
        if (match) {
          const replacedStr = str.replace(regex, `(${count})`);
          return replacedStr;
        } else {
          return str;
        }
      }
      const modifiedSelected =
        selected && element.name === "city" && !loading
          ? {
              ...selected,
              label: replaceCountLabel(selected?.label, count),
            }
          : selected;

      function replaceLabelInOptions(
        opt: { value: string; label: string }[],
        modified: { value: string; label: string },
      ) {
        const foundIndex = opt.findIndex(
          (option) => option?.value === modified?.value,
        );
        if (foundIndex !== -1) {
          const newOpt = [...opt];
          newOpt[foundIndex] = {
            ...newOpt[foundIndex],
            label: modified?.label,
          };
          return newOpt;
        }
        return opt;
      }

      const handleResetFilters = () => {
        const allParams = Object.fromEntries(queryParams);
        setMarkerActive(false, allParams.pointId);
        const newParams = { city: allParams.city };
        const queryString = new URLSearchParams(newParams).toString();
        setQueryParams(queryString);
        getMapFilters({ id: cityId });
      };
      return (
        <>
          <h6
            style={{
              fontSize: "14px",
              marginBottom: element.name === "city" ? "5px" : 0,
            }}
            className="flex justify-between"
          >
            {element.label}
            {element.name === "city" && (
              <Button
                type="button"
                size="xs"
                style={{
                  height: "25px",
                  paddingLeft: "7px",
                  paddingRight: "7px",
                  fontSize: "14px",
                }}
                onClick={handleResetFilters}
              >
                Сбросить все фильтры
              </Button>
            )}
          </h6>
          <Select
            size="xs"
            isLoading={element.name === "city" ? loading : false}
            value={modifiedSelected}
            options={
              element.name === "city"
                ? replaceLabelInOptions(element.options, modifiedSelected)
                : [...element.options]
            }
            placeholder={element.placeholder || ""}
            components={{ NoOptionsMessage }}
            onChange={(e) => {
              const val =
                e?.value === modifiedSelected?.value && element.name !== "city"
                  ? null
                  : e?.value;
              if (element.name === "city") {
                handleResetFilters();
              }
              onChange(element.name, val);
            }}
          />
        </>
      );
    case TypeFilter.CHECKBOX:
      const options = element.options.filter(
        (option: { value: string; label: string }) => option.value,
      );
      options.unshift({ value: "all", label: "Все" });
      const dropdownCheckboxVal = options.filter(
        (el: { value: string; label: string }) => value?.includes(el.value),
      );
      return (
        <div className="">
          <h6 style={{ fontSize: "14px" }} className="">
            {element.label}
          </h6>
          <Select
            size="xs"
            // controlShouldRenderValue={false}
            menuPlacement={
              element.name === "marketplaces" || element.name === "developers"
                ? "top"
                : "auto"
            }
            placeholder=""
            isMulti
            value={dropdownCheckboxVal}
            menuPortalTarget={document.body}
            options={options}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            noOptionsMessage={() => t(`select.noOptions`)}
            components={{
              ValueContainer,
            }}
            onChange={(items, value) => {
              if (
                value.action === "select-option" &&
                value.option?.value === "all"
              ) {
                onChange(element.name, transformOptionsToString(options));
              } else {
                let sendedVal = "";
                for (let i = 0; i < items.length; i++) {
                  if (items[i].value === "all") {
                    // sendedVal = "all";
                    // break;
                    continue;
                  }
                  if (i === 0) {
                    sendedVal = `${items[i].value}`;
                  } else {
                    sendedVal = `${sendedVal},${items[i].value}`;
                  }
                }
                onChange(element.name, sendedVal);
              }
            }}
          />
        </div>
      );
    case TypeFilter.GROUP_CHECKBOX:
      const targetSequence: string[] = ["K4", "E4", "K5", "E5"];
      const more4 = "more4";
      const groupCheckBoxVal = value ? value.split(",") : [];
      const sortOptions: any[] = useMemo(() => {
        let arraySort: { value: string; label: string }[] = [];
        element.options.forEach((elm: any) => {
          switch (elm?.value) {
            case "K1":
              arraySort[0] = elm;
              break;
            case "C":
              arraySort[1] = elm;
              break;
            case "K2":
              arraySort[2] = elm;
              break;
            case "E2":
              arraySort[3] = elm;
              break;
            case "K3":
              arraySort[4] = elm;
              break;
            case "E3":
              arraySort[5] = elm;
            case more4:
              arraySort[6] = {
                value: more4,
                label: "4-х комнатная евро и более",
              };
              break;
            default:
              break;
          }
        });
        //TODO удалить ненужные фильтры на бэке
        arraySort = arraySort.filter((item) => item !== null);
        return arraySort;
      }, []);

      return (
        <div className="mr-7">
          <h6 style={{ fontSize: "14px" }} className="">
            {element.label}
          </h6>
          <Checkbox.Group
            className="grid grid-cols-2 gap-y-0.5 gap-x-0"
            value={replaceSequence(groupCheckBoxVal, targetSequence, more4)}
            onChange={(e) => {
              const index = e.indexOf(more4);
              if (index !== -1) {
                e.splice(index, 1, ...targetSequence);
              }
              onChange(element.name, e.join(","));
            }}
          >
            {sortOptions.map((option: any) => {
              return (
                <div key={option?.value}>
                  <div className="flex">
                    <Checkbox value={option?.value}>
                      <p
                        style={{
                          color: isDark ? "#ffff" : "#111827",
                          fontSize: "14px",
                        }}
                        className="whitespace-nowrap"
                      >
                        {option?.label}
                      </p>
                    </Checkbox>
                  </div>
                </div>
              );
            })}
          </Checkbox.Group>
        </div>
      );
    case TypeFilter.CHECKBOX_SINGLE:
      // let checkboxSingleVal: boolean;
      // if (element.name === "is_active") {
      //   checkboxSingleVal = value === "true" || value === "off";
      // } else {
      //   checkboxSingleVal = value === "true";
      // }
      const checkboxSingleVal = value === "true";
      return (
        <div
          className="mr-7 flex"
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Checkbox
            checked={checkboxSingleVal}
            onChange={(e) => {
              onChange(element.name, e.valueOf());
            }}
          >
            <h6
              className=""
              style={{
                whiteSpace: "nowrap",
                fontSize: "14px",
                fontWeight: 400,
              }}
            >
              {element.label}
            </h6>
          </Checkbox>
        </div>
      );
    case TypeFilter.RANGE:
      const rangeVal: any = value?.split("-").map((el: any) => Number(el)) || [
        Math.floor(Number(element.options.min) / 1000000),
        Math.ceil(Number(element.options.max) / 1000000),
      ];
      rangeVal[1] = Math.min(rangeVal[1], 99);
      return (
        <div style={{ flexDirection: "column", alignItems: "start" }}>
          <h6
            className=""
            style={{
              whiteSpace: "nowrap",
              textAlign: "start",
              fontSize: "14px",
            }}
          >
            {element.label}
          </h6>
          <div
            className="flex"
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          ></div>
          <Range
            value={rangeVal}
            min={Math.floor(Number(element.options.min) / 1000000)}
            max={Math.min(Math.ceil(Number(element.options.max) / 1000000), 99)}
            onChange={(v: string) => onChange(element.name, v)}
          />
        </div>
      );
    default:
      return null;
  }
};

const LeftSideBarMap = ({
  loading,
  isVisible,
  handleFiltersChange,
  count,
}: any) => {
  const [isDark] = useDarkMode();
  const [filterData, setFilterData] = useState<FilterData[]>([]);
  const [queryParams, setQueryparams] = useSearchParams();
  const [selectedFilterData, setSelectedFilterData] = useState<{
    [key: string]: any;
  }>({});
  const cityId = queryParams.get("city");
  const [getMapFilters, { data: dataFilters, isFetching: isFetchingFilters }] =
    useLazyGetMapFiltersQuery();
  useEffect(() => {
    if (cityId) {
      getMapFilters({ id: cityId });
    }
  }, [cityId]);
  const [priceFilter, setPriceFilter] = useState(
    dataFilters?.filters?.find((filter) => filter.name === "price") ?? null,
  );
  useEffect(() => {
    const newPriceFilter =
      dataFilters?.filters?.find((filter) => filter.name === "price") ?? null;
    setPriceFilter(newPriceFilter as any);
  }, [dataFilters]);

  useEffect(() => {
    setFilterData((prev) => {
      if (!Array.isArray(dataFilters?.filters)) {
        return prev;
      }
      return (
        dataFilters?.filters?.map((el: any) => ({ ...el, value: "" })) || []
      );
    });
  }, [dataFilters]);
  console.log(filterData, "fil");
  // NUMBER = "number",
  // DATE_PICKER = "date",
  // DATE = "date-time-interval",
  // DROP_DOWN = "dropdown-checkbox",
  // CHECKBOX_SINGLE = "checkbox",
  // RANGE = "number-interval",
  // INPUT = "input",
  // SELECT = "select",
  // GROUP_CHECKBOX = "group-checkbox",

  // element: {
  //   name: string;
  //   type: string;
  //   options: { value: string; label: string }[] | any;
  //   label: string;
  //   placeholder?: string;
  // };
  // const test = data: [
  // {name: "city", type: "select-single", options: cityOptions, label: "Города", placeholder: ""},
  // {name: "roominess", type: "group-checkbox", options: romminessOptions, label: "Комнатность", placeholder: ""},
  // {name: "deadline", type: "select-single", options: deadlineOptions, label: "Срок сдачи", placeholder: ""},
  // {name: "finishing", type: "select-multi", options: finishingOptions, label: "Отделка", placeholder: ""},
  // {name: "payment_methods", type: "select-multi", options: paymentMethodsOptions, label: "Способы оплаты", placeholder: ""},
  // {name: "price", type: "number-interval", options: priceOptions, label: "Цена", placeholder: ""},
  // {name: "client_is_out_of_town", type: "checkbox", options: isClientInCity, label: "Клиент за городом", placeholder: ""},
  // {name: "not_looking_for_himself", type: "checkbox", options: isLookingFor, label: "Ищет не себе", placeholder: ""},
  // {name: "is_active", type: "checkbox", options: isActive, label: "Нерабочее время", placeholder: ""},
  // {name: "tags", type: "select-multi", options: tagOptions, label: "Теги", placeholder: ""},
  // {name: "developers", type: "select-multi", options: developerOptions, label: "Застройщики", placeholder: ""},
  // {name: "marketplaces", type: "select-multi", options: marketplaceOptions, label: "Площадки", placeholder: ""},
  // ]
  const memorizedData: any[] = useMemo(() => {
    let arraySort = Array.from(Array(filterData?.length), () => null);
    // ToDo переписать с сортировочной функцией
    filterData?.forEach((elm: any) => {
      switch (elm?.name) {
        case "city":
          arraySort[0] = elm;
          break;
        case "roominess":
          arraySort[1] = elm;
          break;
        case "deadline":
          arraySort[2] = elm;
          break;
        case "finishing":
          arraySort[3] = elm;
          break;
        case "payment_methods":
          arraySort[4] = elm;
          break;
        case "price":
          // @ts-ignore
          arraySort[5] = priceFilter as Filter;
          break;
        case "client_is_out_of_town":
          arraySort[6] = elm;
          break;
        case "not_looking_for_himself":
          arraySort[7] = elm;
          break;
        case "is_active":
          arraySort[8] = elm;
          break;
        case "tags":
          arraySort[9] = elm;
          break;
        case "developers":
          arraySort[10] = elm;
          break;
        case "marketplaces":
          arraySort[11] = elm;
          break;
        default:
          break;
      }
    });
    return arraySort;
  }, [filterData, dataFilters]);
  const prevQueryParams = usePrevious(queryParams);
  const prevCityId = usePrevious(cityId);
  useEffect(() => {
    const isClearingFilters = (
      prevParams: URLSearchParams,
      currentParams: URLSearchParams,
    ) => {
      const prev = Object.fromEntries(prevParams);
      const current = Object.fromEntries(currentParams);
      return Object.keys(prev).length > Object.keys(current).length;
    };
    const getRemainingFields = (
      prevParams: URLSearchParams,
      currentParams: URLSearchParams,
    ) => {
      const prevKeys = Object.keys(Object.fromEntries(prevParams));
      const currentKeys = Object.keys(Object.fromEntries(currentParams));
      return prevKeys.filter((item) => !currentKeys.includes(item));
    };

    let newSelected: { [key: string]: string } = {};
    for (const [param, value] of queryParams.entries()) {
      if (value && value !== "false") {
        newSelected[param] = value;
      }
    }
    setSelectedFilterData(newSelected);
    //&& !newSelected['pointId']
    const prevKeys = Object.keys(Object.fromEntries(prevQueryParams));
    const currentKeys = Object.keys(newSelected);

    function containsOnlyItemsInList(
      array1: string[],
      array2: string[],
    ): boolean {
      return array2.every((elem) => array1.includes(elem));
    }

    const cityEqual: boolean = prevCityId === cityId;
    if (cityId) {
      if (
        isClearingFilters(prevQueryParams, queryParams) &&
        containsOnlyItemsInList(["city", "is_active"], prevKeys)
      ) {
        getMapFilters({ id: cityId });
      } else if (
        !isClearingFilters(prevQueryParams, queryParams) &&
        containsOnlyItemsInList(["city", "is_active"], currentKeys)
      ) {
        if (currentKeys.includes("is_active")) {
          getMapFilters({ id: cityId, is_active: "off" });
        } else {
          getMapFilters({ id: cityId });
        }
      }
    }

    // if (cityId && hasFieldsForFilterReq && !isClearingFilters(prevQueryParams,queryParams)) {
    //   getMapFilters({ id: cityId });
    // }

    // !fetchLoading.current && fetchData(newSelected);
  }, [queryParams]);
  return (
    <div
      className="py-2"
      style={{
        width: isVisible ? "100%" : "0%",
        maxWidth: "330px",
        // minWidth: "330px",
        background: isDark ? "#101827" : "none",
        display: isVisible ? "block" : "none",
      }}
    >
      <ScrollBar
        autoHide
        direction="ltr"
        style={{
          width: "100%",
          height: "100%",
          marginBottom: "10px",
        }}
      >
        {
          <Loading loading={isFetchingFilters}>
            <div
              className="px-3 flex flex-col justify-between"
              style={{ height: "100%" }}
            >
              <div>
                {memorizedData?.slice(0, 6).map((elm, i) => {
                  return elm !== null ? (
                    <div key={`${elm.name}-${i}`} className="mb-0.5">
                      <ElementTypeComponent
                        count={count}
                        getMapFilters={getMapFilters}
                        isDark={isDark}
                        loading={loading}
                        element={elm}
                        value={selectedFilterData[elm.name]}
                        onChange={(key: string, value: any) =>
                          handleFiltersChange(key, value)
                        }
                      />
                    </div>
                  ) : null;
                })}
              </div>
              <div
                style={{ background: "rgba(202, 197, 197, 0.1)" }}
                className="rounded-lg px-4 py-2"
              >
                {memorizedData?.slice(6).map((elm, i) => {
                  return elm !== null ? (
                    <div key={`${elm.name}-${i}`} className="mb-0.5">
                      <ElementTypeComponent
                        getMapFilters={getMapFilters}
                        isDark={isDark}
                        loading={loading}
                        element={elm}
                        value={selectedFilterData[elm.name]}
                        onChange={(key: string, value: any) =>
                          handleFiltersChange(key, value)
                        }
                      />
                    </div>
                  ) : null;
                })}
              </div>
              {/* <div className="py-4"><ModeSwitcher /></div> */}
            </div>
          </Loading>
        }
      </ScrollBar>
    </div>
  );
};
export default LeftSideBarMap;
