import { useEffect, useState } from "react";
import { useScaffoldReadContract } from "./scaffold-eth";
import { formatEther } from "viem";
import { ChartWidgetMetaData, FetchableWidgetMetaData } from "~~/types/widgets";

type FetchDataKey = {
  address: string;
  slot: string;
};
type FetchDataEntry = {
  address: string;
  slot: string;
  lastIndex: bigint;
  data: { ts: number; data: number }[];
};

export type ChartDataProvider = {
  address: string;
  slot: string;
  data: { ts: number; data: number }[];
};

export const useChartDataProvider = (widgets: ChartWidgetMetaData[]): ChartDataProvider[] => {
  const uniqueFetchableWidgets: FetchDataKey[] = widgets.reduce((prev, current) => {
    const key: FetchDataKey = { slot: current.slot, address: current.address };
    if (!prev.find(ele => ele.slot === key.slot && ele.address === key.address)) {
      prev.push({ slot: current.slot, address: current.address });
    }
    return prev;
  }, [] as FetchDataKey[]);

  const size = 100;
  const [widgetIndex, setWidgetIndex] = useState(0);
  const [runnerIndex, setRunnerIndex] = useState(0);
  const [storeData, setStoreData] = useState<FetchDataEntry[]>([]);

  const widgetDataTarget = uniqueFetchableWidgets[widgetIndex];

  const { data: dataLength } = useScaffoldReadContract({
    contractName: "SensesJBCData",
    functionName: "dataLength",
    args: [widgetDataTarget?.address, BigInt(widgetDataTarget?.slot || "0")],
  });

  let lastDataFrameIndex = (dataLength || BigInt(0)) - BigInt(size);
  if (lastDataFrameIndex < BigInt(0)) {
    lastDataFrameIndex = BigInt(0);
  }
  const { data: lastestDataFrame } = useScaffoldReadContract({
    contractName: "SensesJBCData",
    functionName: "getDataPaging",
    args: [widgetDataTarget?.address, BigInt(widgetDataTarget?.slot || "0"), lastDataFrameIndex, BigInt(size)],
  });

  let runnerFrameIndex = (dataLength || BigInt(0)) - BigInt(size + runnerIndex);
  if (runnerFrameIndex < BigInt(0)) {
    runnerFrameIndex = BigInt(0);
  }
  const { data: runnerDataFrame } = useScaffoldReadContract({
    contractName: "SensesJBCData",
    functionName: "getDataPaging",
    args: [widgetDataTarget?.address, BigInt(widgetDataTarget?.slot || "0"), runnerFrameIndex, BigInt(size)],
  });

  useEffect(() => {
    const id = setInterval(() => {
      if (!widgetDataTarget) {
        if (uniqueFetchableWidgets.length > 0) {
          setWidgetIndex(0);
        }
      } else {
        if (
          typeof lastestDataFrame !== "undefined" &&
          typeof runnerDataFrame !== "undefined" &&
          typeof dataLength === "bigint"
        ) {
          const parsedLastDataFrame = lastestDataFrame
            .map(ele => ({
              ts: parseInt(ele.ts.toString()),
              data: parseFloat(formatEther(ele.data)),
            }))
            .reverse();
          // todo deficit
          const runnerLastDataFrame = runnerDataFrame
            .map(ele => ({
              ts: parseInt(ele.ts.toString()),
              data: parseFloat(formatEther(ele.data)),
            }))
            .reverse();

          setStoreData(oldStoreData => {
            let targetEntry = oldStoreData.find(
              ele => ele.address === widgetDataTarget.address && ele.slot === widgetDataTarget.slot,
            );
            const newStoreData = [...oldStoreData];
            if (!targetEntry) {
              targetEntry = {
                address: widgetDataTarget.address,
                slot: widgetDataTarget.slot,
                lastIndex: dataLength,
                data: parsedLastDataFrame,
              };
              newStoreData.push(targetEntry);
            }

            // console.log("runnerIndex", widgetIndex, runnerLastDataFrame);
            if (
              targetEntry.data.length > size &&
              runnerLastDataFrame.some(ele => {
                const fwTs = (ele.ts + 3600) * 1000;
                return fwTs >= Date.now();
              })
            ) {
              for (let i = 0; i < runnerLastDataFrame.length; i++) {
                targetEntry.data[runnerIndex + i] = runnerLastDataFrame[i];
              }
            }

            if (targetEntry.lastIndex < dataLength) {
              const diffIndex = parseInt((dataLength - targetEntry.lastIndex).toString());
              const insertedFrame = new Array(diffIndex).fill(undefined).map((_, i) => parsedLastDataFrame[i]);
              targetEntry.data = insertedFrame.concat(targetEntry.data);
              targetEntry.lastIndex = dataLength;
            }

            return newStoreData;
          });

          let nextIndex = 0;
          if (widgetIndex < uniqueFetchableWidgets.length - 1) {
            nextIndex = widgetIndex + 1;
          }
          // console.log(widgetIndex, uniqueFetchableWidgets.length - 1);

          setWidgetIndex(nextIndex);

          const nextWidgetTarget = uniqueFetchableWidgets[nextIndex];
          if (nextWidgetTarget) {
            const nextTargetEntry = storeData.find(
              ele => ele.address === nextWidgetTarget.address && ele.slot === nextWidgetTarget.slot,
            );
            if (nextTargetEntry) {
              let nextRunnerIndex = nextTargetEntry.data.findIndex(ele => typeof ele === "undefined");
              if (nextRunnerIndex === -1) {
                nextRunnerIndex = nextTargetEntry.data.length;
              }
              setRunnerIndex(nextRunnerIndex);
            }
          }
        }
      }

      // console.log(widgetIndex, storeData);
    }, 100);
    return () => clearInterval(id);
  }, [
    uniqueFetchableWidgets,
    widgetDataTarget,
    dataLength,
    lastestDataFrame,
    runnerDataFrame,
    widgetIndex,
    runnerIndex,
    storeData,
  ]);

  // filter storeData by widget
  return uniqueFetchableWidgets.map(ele => {
    const targetData = storeData.find(ele2 => ele.address === ele2.address && ele.slot === ele2.slot);
    return {
      address: ele.address,
      slot: ele.slot,
      data: targetData
        ? targetData.data
            .filter(ele => !!ele)
            .map(ele => {
              return {
                ts: ele.ts,
                data: ele.data,
              };
            })
        : [],
    };
  });
};

export type SingleDataProvider = {
  address: string;
  slot: string;
  data?: { ts: number; data: number };
};

export const useSingleDataProvider = (widgets: FetchableWidgetMetaData[]): SingleDataProvider[] => {
  const uniqueFetchableWidgets: FetchDataKey[] = widgets.reduce((prev, current) => {
    const key: FetchDataKey = { slot: current.slot, address: current.address };
    if (!prev.find(ele => ele.slot === key.slot && ele.address === key.address)) {
      prev.push({ slot: current.slot, address: current.address });
    }
    return prev;
  }, [] as FetchDataKey[]);

  const [widgetIndex, setWidgetIndex] = useState(0);
  const [storeData, setStoreData] = useState<FetchDataEntry[]>([]);
  const widgetDataTarget = uniqueFetchableWidgets[widgetIndex];

  const { data: dataLength } = useScaffoldReadContract({
    contractName: "SensesJBCData",
    functionName: "dataLength",
    args: [widgetDataTarget?.address, BigInt(widgetDataTarget?.slot || "0")],
  });

  let lastDataFrameIndex = (dataLength || BigInt(0)) - BigInt(1);
  if (lastDataFrameIndex < BigInt(0)) {
    lastDataFrameIndex = BigInt(0);
  }
  const { data: lastestDataFrame } = useScaffoldReadContract({
    contractName: "SensesJBCData",
    functionName: "getDataPaging",
    args: [widgetDataTarget?.address, BigInt(widgetDataTarget?.slot || "0"), lastDataFrameIndex, BigInt(1)],
  });

  useEffect(() => {
    const id = setInterval(() => {
      if (!widgetDataTarget) {
        if (uniqueFetchableWidgets.length > 0) {
          setWidgetIndex(0);
        }
      } else {
        if (typeof lastestDataFrame !== "undefined" && typeof dataLength === "bigint") {
          const parsedLastDataFrame = lastestDataFrame.map(ele => ({
            ts: parseInt(ele.ts.toString()),
            data: parseFloat(formatEther(ele.data)),
          }));

          setStoreData(oldStoreData => {
            const targetEntry = oldStoreData.find(
              ele => ele.address === widgetDataTarget.address && ele.slot === widgetDataTarget.slot,
            );
            const newStoreData = [...oldStoreData];
            if (!targetEntry) {
              newStoreData.push({
                address: widgetDataTarget.address,
                slot: widgetDataTarget.slot,
                lastIndex: dataLength,
                data: parsedLastDataFrame,
              });
            }
            if (targetEntry && targetEntry.lastIndex < dataLength) {
              targetEntry.data = parsedLastDataFrame;
              targetEntry.lastIndex = dataLength;
            }

            return newStoreData;
          });

          let nextIndex = 0;
          if (widgetIndex < uniqueFetchableWidgets.length - 1) {
            nextIndex = widgetIndex + 1;
          }

          setWidgetIndex(nextIndex);
        }
      }
    }, 100);
    return () => clearInterval(id);
  }, [uniqueFetchableWidgets.length, widgetDataTarget, dataLength, lastestDataFrame, widgetIndex, storeData]);

  // filter storeData by widget
  return uniqueFetchableWidgets.map(ele => {
    const targetData = storeData.find(ele2 => ele.address === ele2.address && ele.slot === ele2.slot);
    return {
      address: ele.address,
      slot: ele.slot,
      data: targetData?.data[0],
    };
  });
};
