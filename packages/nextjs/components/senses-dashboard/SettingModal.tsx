import { NumberInput } from "../NumberInput";
import { TextareaStyled } from "../TextareaStyled";
import { AddressInput, InputBase, IntegerInput } from "../scaffold-eth";
import clsx from "clsx";
import { ChromePicker } from "react-color";
import { EditSettingParam } from "~~/types/widgets";
import { isParamValid } from "~~/utils/widget-utils";

type SettingModalParam = {
  show?: boolean;
  configTemplate: EditSettingParam;
  valueOfParam?: (param: string) => any;
  onValueChange?: (param: string, val: any) => void;
  applyValue?: () => void;
  onClose?: () => void;
};

export const SettingModal = ({
  show,
  configTemplate,
  valueOfParam,
  onValueChange,
  applyValue,
  onClose,
}: SettingModalParam) => {
  const paramList = Object.keys(configTemplate.params).map(ele => ({ param: ele, ...configTemplate.params[ele] }));
  const isParamAllValid = paramList.every(v => isParamValid(v.type, valueOfParam?.(v.param) || "", v.required));
  const applyValue2 = () => {
    if (!isParamAllValid) {
      return;
    }
    applyValue?.();
  };

  return (
    <>
      <input type="checkbox" className="modal-toggle" checked={show} readOnly />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Setting{configTemplate.label && <> : {configTemplate.label}</>}</h3>
          {paramList.map((ele, i) => {
            let inner = (
              <InputBase
                value={valueOfParam?.(ele.param) || ""}
                onChange={v => onValueChange?.(ele.param, v)}
                error={!isParamValid(ele.type, valueOfParam?.(ele.param) || "", ele.required)}
                suffix={ele.required ? <span className="pr-4 -ml-2 self-center">*</span> : null}
              ></InputBase>
            );
            switch (ele.type) {
              case "string_long":
                inner = (
                  <TextareaStyled
                    value={valueOfParam?.(ele.param) || ""}
                    onChange={v => onValueChange?.(ele.param, v)}
                    required={ele.required}
                    error={!isParamValid(ele.type, valueOfParam?.(ele.param) || "", ele.required)}
                  ></TextareaStyled>
                );
                break;
              case "address":
                inner = (
                  <AddressInput
                    value={valueOfParam?.(ele.param) || ""}
                    onChange={v => onValueChange?.(ele.param, v)}
                  ></AddressInput>
                );
                break;
              case "uint256":
                inner = (
                  <IntegerInput
                    value={`${valueOfParam?.(ele.param) || ""}`}
                    onChange={v => onValueChange?.(ele.param, `${v}`)}
                    disableMultiplyBy1e18
                  ></IntegerInput>
                );
                break;
              case "number":
                inner = (
                  <NumberInput
                    value={valueOfParam?.(ele.param) || ""}
                    onChange={v => onValueChange?.(ele.param, v)}
                    error={!isParamValid(ele.type, valueOfParam?.(ele.param) || "", ele.required)}
                    suffix={ele.required ? <span className="pr-4 -ml-2 self-center">*</span> : null}
                  ></NumberInput>
                );
                break;
              case "color":
                inner = (
                  <ChromePicker
                    color={valueOfParam?.(ele.param) || ""}
                    onChangeComplete={v => onValueChange?.(ele.param, v.hex)}
                  ></ChromePicker>
                );
                break;
            }
            return (
              <div key={i} className="my-2">
                {ele.name}:{inner}
              </div>
            );
          })}
          <div className="modal-action">
            <label className={clsx("btn", !isParamAllValid ? "btn-disabled" : "")} onClick={applyValue2}>
              Apply Value
            </label>
            <label className="btn" onClick={onClose}>
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
