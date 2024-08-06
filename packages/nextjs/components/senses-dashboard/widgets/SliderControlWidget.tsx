import { useState } from "react";
import { SensesWidgetWrapper } from "./SensesWidget";
import { AddWidgetParam, ControlSliderWidgetMetaData, EditSettingParam } from "~~/types/widgets";

interface SensesWidgetProps {
  widgetData: ControlSliderWidgetMetaData;
  editMode?: boolean;
  onEditSetting?: () => void;
  onDelWidget?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const SliderControlWidgetParamAddConfig: AddWidgetParam = {
  label: "Slider",
  type: "slider",
  defaultValues: {
    title: "Slider",
    address: "__address__",
    slot: "1",
    min: "0",
    max: "100",
  },
};

export const SliderControlWidgetParamConfig: EditSettingParam = {
  label: "Slider",
  params: {
    title: {
      type: "string",
      name: "Title",
      required: true,
    },
    prefix: {
      type: "string",
      name: "Prefix",
    },
    suffix: {
      type: "string",
      name: "Suffix",
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
    min: {
      type: "number",
      name: "Min Value",
      required: true,
    },
    max: {
      type: "number",
      name: "Max Value",
      required: true,
    },
    color: {
      type: "color",
      name: "Slider Color",
    },
  },
};

export const SensesSliderControlWidget: React.FC<SensesWidgetProps> = ({
  widgetData,
  editMode,
  onEditSetting,
  onDelWidget,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [value, setValue] = useState(50);

  const style = {
    "--range-shdw": widgetData.color,
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
        <input
          type="range"
          min={widgetData.min}
          max={widgetData.max}
          value={value}
          className="range"
          style={style}
          onChange={ev => setValue(parseInt(ev.target.value))}
        />
        <div className="text-center">
          {widgetData.prefix && <>{widgetData.prefix} </>}
          {value}
          {widgetData.suffix && <> {widgetData.suffix}</>}
        </div>
      </div>
    </SensesWidgetWrapper>
  );
};
