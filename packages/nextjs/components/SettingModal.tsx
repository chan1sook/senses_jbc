import { TextareaStyled } from "./TextareaStyled";
import { AddressInput, InputBase, IntegerInput } from "./scaffold-eth";
import clsx from "clsx";
import { ChromePicker } from "react-color";
import { isAddress } from "viem";
import { EditSettingParam } from "~~/types/widgets";

type SettingModalParam = {
  show?: boolean;
  type?: string;
  configTemplate: EditSettingParam;
  valueOfParam?: (param: string) => any;
  onValueChange?: (param: string, val: any) => void;
  applyValue?: () => void;
  onClose?: () => void;
};

export const SettingModal = ({
  show,
  type,
  configTemplate,
  valueOfParam = () => undefined,
  onValueChange = () => {},
  applyValue = () => {},
  onClose,
}: SettingModalParam) => {
  const paramList = Object.keys(configTemplate.params).map(ele => ({ param: ele, ...configTemplate.params[ele] }));
  const isParamInvalid = (ele: (typeof paramList)[0]) => {
    try {
      const val = valueOfParam(ele.param);
      switch (ele.type) {
        case "address":
          return !isAddress(val) || (!!ele.required && (val as string) === "");
        case "bigint":
          const val2 = BigInt(val);
          return val2 < BigInt(0) || (!!ele.required && (val as string) === "");
      }
      return !!ele.required && (val as string) === "";
    } catch (err) {
      return true;
    }
  };
  const applyValue2 = () => {
    if (paramList.some(isParamInvalid)) {
      return;
    }
    applyValue();
  };

  return (
    <>
      <input type="checkbox" className="modal-toggle" checked={show} readOnly onChange={e => {}} />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Setting{configTemplate.label && <> : {configTemplate.label}</>}</h3>
          {paramList.map(ele => {
            return ele.type === "string" ? (
              <div className="my-2">
                {ele.name}:
                <InputBase
                  value={valueOfParam(ele.param) as string}
                  onChange={v => onValueChange(ele.param, v)}
                  error={isParamInvalid(ele)}
                  suffix={ele.required ? <span className="pr-4 -ml-2 self-center">*</span> : null}
                ></InputBase>
              </div>
            ) : ele.type === "string_long" ? (
              <div className="my-2">
                {ele.name}:
                <TextareaStyled
                  value={valueOfParam(ele.param) as string}
                  onChange={v => onValueChange(ele.param, v)}
                  required={ele.required}
                  error={isParamInvalid(ele)}
                ></TextareaStyled>
              </div>
            ) : ele.type === "address" ? (
              <div className="my-2">
                {ele.name}:
                <AddressInput
                  value={valueOfParam(ele.param) as string}
                  onChange={v => onValueChange(ele.param, v)}
                ></AddressInput>
              </div>
            ) : ele.type === "bigint" ? (
              <div className="my-2">
                {ele.name}:
                <IntegerInput
                  value={`${valueOfParam(ele.param)}`}
                  onChange={v => onValueChange(ele.param, `${v}`)}
                  disableMultiplyBy1e18
                ></IntegerInput>
              </div>
            ) : ele.type === "color" ? (
              <div className="my-2">
                {ele.name}:
                <ChromePicker
                  color={valueOfParam(ele.param)}
                  onChangeComplete={v => onValueChange(ele.param, v.hex)}
                ></ChromePicker>
              </div>
            ) : (
              <div className="my-2">
                {ele.name}:
                <InputBase
                  value={valueOfParam(ele.param) as string}
                  onChange={v => onValueChange(ele.param, v)}
                  suffix={ele.required ? <span className="pr-4 -ml-2 self-center">*</span> : null}
                ></InputBase>
              </div>
            );
          })}
          <div className="modal-action">
            <label className={clsx("btn", paramList.some(isParamInvalid) ? "btn-disabled" : "")} onClick={applyValue2}>
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
