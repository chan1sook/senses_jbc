import { useState } from "react";
import ChartContainer from "../ChartContainer";
import { SensesWidgetWrapper } from "./SensesWidget";
import { AddWidgetParam, ChartWidgetMetaData, EditSettingParam } from "~~/types/widgets";

interface SensesWidgetProps {
  widgetData: ChartWidgetMetaData;
  editMode?: boolean;
  onEditSetting?: () => void;
  onDelWidget?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const ChartWidgetParamAddConfig: AddWidgetParam = {
  label: "Chart",
  type: "chart",
  defaultValues: {
    title: "Chart",
    address: "__address__",
    slot: "1",
  },
};

export const ChartWidgetParamConfig: EditSettingParam = {
  label: "Chart",
  params: {
    title: {
      type: "string",
      name: "Title",
      required: true,
    },
    address: {
      type: "address",
      name: "Address",
      required: true,
    },
    slot: {
      type: "bigint",
      name: "Slot",
      required: true,
    },
    color: {
      type: "color",
      name: "Chart Line Color",
    },
  },
};

export const SensesChartWidget: React.FC<SensesWidgetProps> = ({
  widgetData,
  editMode,
  onEditSetting,
  onDelWidget,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [chartData] = useState(
    new Array(200).fill(undefined).map((_, i) => ({ x: Date.now() - (200 - i) * 60000, y: 20 + Math.random() * 5 })),
  );
  return (
    <SensesWidgetWrapper
      editMode={editMode}
      onEditSetting={onEditSetting}
      onDelWidget={onDelWidget}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ChartContainer label={widgetData.title} chartData={chartData} color={widgetData.color}></ChartContainer>
    </SensesWidgetWrapper>
  );
};
