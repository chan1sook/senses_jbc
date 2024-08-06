import { isZeroAddress } from "./scaffold-eth/common";
import { isAddress } from "viem";
import { WidgetInputParamType } from "~~/types/widgets";

export const isParamValid = (type: WidgetInputParamType, value: string, required = false) => {
  const isEmptyValue = typeof value === "undefined" || value === "";
  let valueValid = false;

  try {
    switch (type) {
      case "address":
        valueValid = isAddress(value) && !isZeroAddress(value);
        break;
      case "uint256":
        valueValid = BigInt(value) >= BigInt(0);
        break;
      case "number":
        valueValid = Number.isFinite(parseFloat(value));
        break;
      case "string":
      case "string_long":
      case "color":
      default:
        valueValid = typeof value === "string";
    }
  } catch (err) {
    valueValid = false;
  }
  return !!required ? valueValid : valueValid || isEmptyValue;
};
