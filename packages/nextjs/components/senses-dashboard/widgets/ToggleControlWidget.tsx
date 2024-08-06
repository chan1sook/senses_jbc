import { useState } from "react";
import { SensesWidgetWrapper } from "./SensesWidget";
import { AddWidgetParam, ControlToggleWidgetMetaData, EditSettingParam } from "~~/types/widgets";

interface SensesWidgetProps {
  widgetData: ControlToggleWidgetMetaData;
  editMode?: boolean;
  onEditSetting?: () => void;
  onDelWidget?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const ToggleControlWidgetParamAddConfig: AddWidgetParam = {
  label: "Toggle",
  type: "toggle",
  defaultValues: {
    title: "Toggle",
    address: "__address__",
    slot: "1",
  },
};

export const ToggleControlWidgetParamConfig: EditSettingParam = {
  label: "Toggle",
  params: {
    title: {
      type: "string",
      name: "Title",
      required: true,
    },
    onText: {
      type: "string",
      name: "Button On Text",
    },
    offText: {
      type: "string",
      name: "Button Off Text",
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
    colorOff: {
      type: "color",
      name: "Button Off Color",
    },
    colorOn: {
      type: "color",
      name: "Button On Color",
    },
  },
};

export const SensesToggleControlWidget: React.FC<SensesWidgetProps> = ({
  widgetData,
  editMode,
  onEditSetting,
  onDelWidget,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [enable, setEnabled] = useState(false);
  const onClickSwitch = () => {
    if (editMode) {
      return;
    }

    setEnabled(v => !v);
  };
  const style = {
    "background-color": enable ? widgetData.colorOn : widgetData.colorOff,
  } as React.CSSProperties;

  return (
    <SensesWidgetWrapper
      editMode={editMode}
      onEditSetting={onEditSetting}
      onDelWidget={onDelWidget}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {widgetData.title && <h3 className="font-bold text-xl">{widgetData.title}</h3>}
      <div className="flex-1 flex flex-col justify-center items-center gap-y-2">
        <input type="checkbox" className="toggle toggle-lg" checked={enable} onClick={onClickSwitch} style={style} />
        <div className="text-center">{enable ? widgetData.onText || "ON" : widgetData.offText || "OFF"}</div>
      </div>
    </SensesWidgetWrapper>
  );
};
