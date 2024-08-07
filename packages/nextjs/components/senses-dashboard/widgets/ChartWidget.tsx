import ChartContainer from "../ChartContainer";
import { SensesWidgetWrapper } from "./SensesWidget";
import { ChartDataProvider } from "~~/hooks/useDashboardDataProvder";
import { AddWidgetParam, ChartWidgetMetaData, EditSettingParam } from "~~/types/widgets";

interface SensesWidgetProps {
  widgetData: ChartWidgetMetaData;
  editMode?: boolean;
  dataProvider?: ChartDataProvider[];
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
    slot: "0",
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
    },
    slot: {
      type: "uint256",
      name: "Slot",
      required: true,
    },
    label: {
      type: "string",
      name: "Data Label",
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
  dataProvider,
  onEditSetting,
  onDelWidget,
  onMouseEnter,
  onMouseLeave,
}) => {
  const targetData = dataProvider?.find(
    ele => ele.slot === widgetData.slot && ele.address === widgetData.address,
  )?.data;
  const chartData = targetData ? targetData.map(ele => ({ x: ele.ts * 1000, y: ele.data })) : [];

  return (
    <SensesWidgetWrapper
      editMode={editMode}
      onEditSetting={onEditSetting}
      onDelWidget={onDelWidget}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ChartContainer
        title={widgetData.title}
        label={widgetData.label}
        chartData={chartData}
        color={widgetData.color}
      ></ChartContainer>
    </SensesWidgetWrapper>
  );
};
