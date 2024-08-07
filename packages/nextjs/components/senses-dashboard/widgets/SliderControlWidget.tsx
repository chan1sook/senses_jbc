import { useEffect, useState } from "react";
import { SensesWidgetWrapper } from "./SensesWidget";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { SingleDataProvider } from "~~/hooks/useDashboardDataProvder";
import { AddWidgetParam, ControlSliderWidgetMetaData, EditSettingParam } from "~~/types/widgets";

interface SensesWidgetProps {
  widgetData: ControlSliderWidgetMetaData;
  editMode?: boolean;
  dataProvider: SingleDataProvider[];
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
    slot: "0",
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
  dataProvider,
  editMode,
  onEditSetting,
  onDelWidget,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { address: connectAddress } = useAccount();
  const isEditable = connectAddress === widgetData.address;

  const [dataFetch, setDataFetch] = useState(false);
  const [value, setValue] = useState(50);

  const { writeContractAsync, isPending } = useScaffoldWriteContract("SensesJBCData");
  const applyValue = () => {
    if (editMode || !isEditable) {
      return;
    }

    writeContractAsync({
      functionName: "pushData",
      args: [BigInt(widgetData.slot), parseEther(value.toString())],
    });
  };

  useEffect(() => {
    const id = setInterval(() => {
      if (!dataFetch) {
        const targetData = dataProvider.find(
          ele => ele.address === widgetData.address && ele.slot === widgetData.slot,
        )?.data;
        if (targetData) {
          setValue(Math.round(targetData.data));
          setDataFetch(true);
        }
      }
    }, 50);
    return () => clearInterval(id);
  });
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
        <div className="w-full flex flex-row gap-2 items-center">
          <input
            type="range"
            min={widgetData.min}
            max={widgetData.max}
            value={value}
            className="flex-1 range"
            disabled={!isEditable}
            style={style}
            onChange={ev => {
              setValue(parseInt(ev.target.value));
            }}
          />
          {isEditable && (
            <button className="btn btn-primary btn-sm rounded-md" disabled={isPending} onClick={applyValue}>
              Apply
            </button>
          )}
        </div>
        <div className="text-center">
          {widgetData.prefix && <>{widgetData.prefix} </>}
          {value}
          {widgetData.suffix && <> {widgetData.suffix}</>}
        </div>
      </div>
    </SensesWidgetWrapper>
  );
};
