import { useEffect, useState } from "react";
import { SensesWidgetWrapper } from "./SensesWidget";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { SingleDataProvider } from "~~/hooks/useDashboardDataProvder";
import { AddWidgetParam, ControlToggleWidgetMetaData, EditSettingParam } from "~~/types/widgets";

interface SensesWidgetProps {
  widgetData: ControlToggleWidgetMetaData;
  editMode?: boolean;
  dataProvider: SingleDataProvider[];
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
    slot: "0",
    onValue: "1",
    offValue: "0",
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
    onValue: {
      type: "number",
      name: "Threshold/Value when Switch On",
    },
    offValue: {
      type: "number",
      name: "Threshold/Value when Switch Off",
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
  const { writeContractAsync, isPending } = useScaffoldWriteContract("SensesJBCData");

  const [enable, setEnabled] = useState(false);
  const getToggleStateByValue = (val: number) => {
    const onValue = parseFloat(widgetData.onValue || "1");
    const offValue = parseFloat(widgetData.offValue || "0");
    if (onValue >= offValue) {
      return val >= offValue;
    } else {
      return val <= onValue;
    }
  };

  const onClickSwitch = () => {
    if (editMode || !isEditable) {
      return;
    }

    writeContractAsync({
      functionName: "pushData",
      args: [BigInt(widgetData.slot), parseEther(enable ? widgetData.offValue || "0" : widgetData.onValue || "1")],
    }).then(() => {
      setEnabled(v => !v);
    });
  };

  useEffect(() => {
    const id = setInterval(() => {
      if (!dataFetch) {
        const targetData = dataProvider.find(
          ele => ele.address === widgetData.address && ele.slot === widgetData.slot,
        )?.data;
        if (targetData) {
          setEnabled(getToggleStateByValue(targetData.data));
          setDataFetch(true);
        }
      }
    }, 50);
    return () => clearInterval(id);
  });

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
        <input
          type="checkbox"
          className="toggle toggle-lg"
          disabled={isPending || !isEditable}
          checked={enable}
          onClick={onClickSwitch}
          style={style}
        />
        <div className="text-center">{enable ? widgetData.onText || "ON" : widgetData.offText || "OFF"}</div>
      </div>
    </SensesWidgetWrapper>
  );
};
