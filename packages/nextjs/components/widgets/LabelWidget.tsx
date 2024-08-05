import { SensesWidgetWrapper } from "./SensesWidget";
import { AddWidgetParam, EditSettingParam, LabelWidgetMetaData } from "~~/types/widgets";

interface SensesWidgetProps {
  widgetData: LabelWidgetMetaData;
  editMode?: boolean;
  onEditSetting?: () => void;
  onDelWidget?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const LabelWidgetParamAddConfig: AddWidgetParam = {
  label: "Label",
  type: "label",
  defaultValues: {
    title: "Label",
    content: "SensesJBC",
  },
};

export const LabelWidgetParamConfig: EditSettingParam = {
  label: "Label",
  params: {
    title: {
      type: "string",
      name: "Title",
      required: true,
    },
    content: {
      type: "string_long",
      name: "Content",
    },
  },
};

export const SensesLabelWidget: React.FC<SensesWidgetProps> = ({
  widgetData,
  editMode,
  onEditSetting,
  onDelWidget,
  onMouseEnter,
  onMouseLeave,
}) => {
  const contentLines = widgetData.content.split("\n").map(ele => <div>{ele.replace(/ /g, "\u00A0")}</div>);
  return (
    <SensesWidgetWrapper
      editMode={editMode}
      onEditSetting={onEditSetting}
      onDelWidget={onDelWidget}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h3 className="font-bold text-xl">{widgetData.title}</h3>
      <div>{contentLines}</div>
    </SensesWidgetWrapper>
  );
};
