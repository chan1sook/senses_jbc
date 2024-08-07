import { SensesWidgetWrapper } from "./SensesWidget";
import clsx from "clsx";
import fContrast from "font-color-contrast";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { AddWidgetParam, ControlButtonWidgetMetaData, EditSettingParam } from "~~/types/widgets";

interface SensesWidgetProps {
  widgetData: ControlButtonWidgetMetaData;
  editMode?: boolean;
  onEditSetting?: () => void;
  onDelWidget?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const ButtonControlWidgetParamAddConfig: AddWidgetParam = {
  label: "Button",
  type: "btn",
  defaultValues: {
    title: "Button",
    address: "__address__",
    slot: "0",
    value: "1",
  },
};

export const ButtonControlWidgetParamConfig: EditSettingParam = {
  label: "Button",
  params: {
    title: {
      type: "string",
      name: "Title",
      required: true,
    },
    btnText: {
      type: "string",
      name: "Button Text",
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
    value: {
      type: "number",
      name: "On Press Value",
    },
    color: {
      type: "color",
      name: "Button Color",
    },
  },
};

export const SensesButtonControlWidget: React.FC<SensesWidgetProps> = ({
  widgetData,
  editMode,
  onEditSetting,
  onDelWidget,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { address: connectAddress } = useAccount();
  const isEditable = connectAddress === widgetData.address;

  const { writeContractAsync, isPending } = useScaffoldWriteContract("SensesJBCData");
  const onClickBtn = () => {
    if (editMode || !isEditable) {
      return;
    }

    writeContractAsync({
      functionName: "pushData",
      args: [BigInt(widgetData.slot), parseEther(widgetData.value || "1")],
    });
  };

  const style = {
    "background-color": widgetData.color,
    color: fContrast(widgetData.color || "white"),
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
        <button
          className={clsx("btn", editMode ? "pointer-events-none" : "")}
          style={style}
          disabled={isPending || !isEditable}
          onClick={onClickBtn}
        >
          {widgetData.btnText || "Click Here"}
        </button>
      </div>
    </SensesWidgetWrapper>
  );
};
