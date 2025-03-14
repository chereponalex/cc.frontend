import setMarkerActive from "@/utils/setMarkerActive";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast, Button } from "@/components/ui";

const buttons = [
  {
    id: "group_1",
    label: "П1",
  },
  {
    id: "group_2",
    label: "П2",
  },
  {
    id: "group_3",
    label: "П3",
  },
  {
    id: "group_4",
    label: "П4",
  },
  {
    id: "group_5",
    label: "П5",
  },
];

interface Button {
  id: string;
  label: string;
}

interface BtnBlockProps {
  handleFiltersChange: (key: string, value: any) => void;
  groups: Record<string, any[]>;
}

const BtnsPriority: React.FC<BtnBlockProps> = ({
  handleFiltersChange,
  groups,
}) => {
  const [queryParams, _] = useSearchParams();

  useEffect(() => {
    if (queryParams.get("pointId") === null) {
      setMarkerActive(false, queryParams.get("pointId"));
      setActiveButtonId(null);
    } else {
      const activeButton = buttons.find((button) => {
        const group = groups[button.id];
        return (
          group && group.some((item) => item.id === queryParams.get("pointId"))
        );
      });
      setMarkerActive(true, queryParams.get("pointId"));
      setActiveButtonId(activeButton?.id || null);
    }
  }, [queryParams, buttons, groups]);

  const [activeButtonId, setActiveButtonId] = useState<string | null>(null);
  const handleButtonClick = (buttonId: string) => {
    setMarkerActive(false, queryParams.get("pointId"));
    const group = groups[buttonId];
    if (group && group.length > 0) {
      handleFiltersChange("pointId", group[0]?.id);
    }
  };

  return (
    <div className="mt-2">
      {buttons.map((button) => (
        <Button
          disabled={activeButtonId === button.id ? true : false}
          style={{
            width: "30px",
            padding: 0,
            opacity: activeButtonId === button.id ? 0.4 : 1,
            display: groups[button.id].length === 0 ? "none" : "block",
            border: activeButtonId === button.id ? "0.5px solid black" : "none",
            boxShadow:
              activeButtonId === button.id
                ? "rgba(32, 40, 28, 0.5) 4px 4px 19px inset"
                : "none",
          }}
          variant="solid"
          className={` mb-1`}
          key={button.id}
          size="xs"
          onClick={() => handleButtonClick(button.id)}
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
};

export default BtnsPriority;
