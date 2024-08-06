import lzstring from "lz-string";
import { DashboardData } from "~~/types/widgets";

function dashboardDataToJsonStr(saveData: DashboardData) {
  return JSON.stringify(saveData);
}

function jsonStrToWidgetData(jsonStr: string): DashboardData | undefined {
  const jsonData = JSON.parse(jsonStr);
  // roughly check if valid
  if (jsonData && typeof jsonData === "object" && jsonData.layouts && jsonData.widgets) {
    return jsonData as DashboardData;
  }
  return undefined;
}

function saveStrToHexStr(str: string) {
  const uintArray = lzstring.compressToUint8Array(str);
  console.log("uintArray len:", uintArray.length);
  return ("0x" + Buffer.from(uintArray).toString("hex")) as `0x${string}`;
}

function hexStrToStr(str: `0x${string}`) {
  const subStr = str.substring(2);
  const uintArray = Uint8Array.from([...Buffer.from(subStr, "hex")]);
  return lzstring.decompressFromUint8Array(uintArray);
}

export function dashboardDataToSaveHexStr(saveData: DashboardData) {
  const saveStr = dashboardDataToJsonStr(saveData);
  const hexSaveStr = saveStrToHexStr(saveStr);

  console.log("hex str:", hexSaveStr.length);
  return hexSaveStr;
}

export function saveHexStrToDashboardData(saveStr: `0x${string}`) {
  return jsonStrToWidgetData(hexStrToStr(saveStr));
}
