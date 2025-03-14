import type { CSSProperties } from "react";
import React from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import type { CollapseProps } from "antd";
import { Collapse, theme } from "antd";
import useDarkMode from "@/utils/hooks/useDarkmode";

const CustomCollapse = ({ text = "" }: any) => {
  const [isDark] = useDarkMode();

  const { token } = theme.useToken();

  const getItems: (panelStyle: CSSProperties) => CollapseProps["items"] = (
    panelStyle,
  ) => [
    {
      key: "1",
      label: (
        <h6
          style={{
            color: !isDark ? "black" : "white",
            fontSize: "14px",
            fontWeight: 700,
          }}
        >
          {"Описание:"}
        </h6>
      ),
      children: <p style={{ color: !isDark ? "black" : "white" }}>{text}</p>,
      style: panelStyle,
    },
  ];
  const panelStyle: React.CSSProperties = {
    marginBottom: 10,
    background: isDark ? "#101827" : "#ffffff",
    border: "none",
  };

  return (
    <Collapse
      bordered={false}
      // defaultActiveKey={["1"]}
      expandIcon={({ isActive }) => {
        return (
          <CaretRightOutlined
            style={{ color: !isDark ? "black" : "white" }}
            rotate={isActive ? 90 : 0}
          />
        );
      }}
      // style={{ background: token.colorBgContainer }}
      items={getItems(panelStyle)}
    />
  );
};

export default CustomCollapse;
