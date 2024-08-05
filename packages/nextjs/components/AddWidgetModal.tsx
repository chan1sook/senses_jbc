import { ButtonControlWidgetParamAddConfig } from "./widgets/ButtonControlWidget";
import { ChartWidgetParamAddConfig } from "./widgets/ChartWidget";
import { LabelWidgetParamAddConfig } from "./widgets/LabelWidget";
import { SliderControlWidgetParamAddConfig } from "./widgets/SliderControlWidget";
import { ToggleControlWidgetParamAddConfig } from "./widgets/ToggleControlWidget";
import { nanoid } from "nanoid";
import { useAccount } from "wagmi";
import { AddWidgetParam, WidgetMetaData } from "~~/types/widgets";

type AddWidgetModalParam = {
  show?: boolean;
  onAddWidget?: (x: WidgetMetaData) => void;
  onClose?: () => void;
};

export const AddWidgetModal = ({ show, onAddWidget, onClose }: AddWidgetModalParam) => {
  const widgetConfigs = [
    LabelWidgetParamAddConfig,
    ChartWidgetParamAddConfig,
    ToggleControlWidgetParamAddConfig,
    ButtonControlWidgetParamAddConfig,
    SliderControlWidgetParamAddConfig,
  ];

  const { address } = useAccount();

  const onAddWidget2 = (config: AddWidgetParam) => {
    if (!onAddWidget) {
      return;
    }

    const parsedDefaultValue = { ...config.defaultValues };
    for (const key of Object.keys(parsedDefaultValue)) {
      if (parsedDefaultValue[key] === "__address__" && address) {
        parsedDefaultValue[key] = address;
      }
    }

    const widgetData: WidgetMetaData = {
      ...parsedDefaultValue,
      id: nanoid(),
      type: config.type,
    };

    onAddWidget(widgetData);
  };

  return (
    <>
      <input type="checkbox" className="modal-toggle" checked={show} readOnly onChange={e => {}} />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Add Widget</h3>
          <h6 className="font-bold my-2">Select Widget</h6>
          <div className="grid grid-flow-row grid-cols-3 gap-2">
            {widgetConfigs.map(ele => {
              return (
                <button className="col-auto btn btn-sm" onClick={() => onAddWidget2(ele)}>
                  {ele.label}
                </button>
              );
            })}
          </div>
          <div className="modal-action">
            <label className="btn" onClick={onClose}>
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
