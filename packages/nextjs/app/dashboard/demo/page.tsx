"use client";

import { useEffect, useState } from "react";
import lzstring from "lz-string";
import { nanoid } from "nanoid";
import type { NextPage } from "next";
import ReactGridLayout, { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useAccount } from "wagmi";
import { AddWidgetModal } from "~~/components/AddWidgetModal";
import { SettingModal } from "~~/components/SettingModal";
import { ButtonControlWidgetParamConfig, SensesButtonControlWidget } from "~~/components/widgets/ButtonControlWidget";
import { ChartWidgetParamConfig, SensesChartWidget } from "~~/components/widgets/ChartWidget";
import { LabelWidgetParamConfig, SensesLabelWidget } from "~~/components/widgets/LabelWidget";
import { SensesGenericWidget } from "~~/components/widgets/SensesWidget";
import { SensesSliderControlWidget, SliderControlWidgetParamConfig } from "~~/components/widgets/SliderControlWidget";
import { SensesToggleControlWidget, ToggleControlWidgetParamConfig } from "~~/components/widgets/ToggleControlWidget";
import {
  ChartWidgetMetaData,
  ControlButtonWidgetMetaData,
  ControlSliderWidgetMetaData,
  ControlToggleWidgetMetaData,
  EditSettingParam,
  LabelWidgetMetaData,
  WidgetMetaData,
} from "~~/types/widgets";
import {
  isChartWidget,
  isControlButtonWidget,
  isControlSliderWidget,
  isControlToggleWidget,
  isLabelWidget,
} from "~~/utils/widget-utils";

type PageProps = {
  params: { address: string; id: string };
};

const GridLayout = WidthProvider(Responsive);

const DashboardPage: NextPage<PageProps> = ({ params }: PageProps) => {
  const { address: connectedAddress } = useAccount();

  const [dataFetch, setDataFetch] = useState<boolean>(false);
  const [widgetData, setWidgetData] = useState<WidgetMetaData[]>([]);
  const [editWidgetData, setEditWidgetData] = useState<WidgetMetaData[]>(JSON.parse(JSON.stringify(widgetData)));
  const [editMode, setEditMode] = useState(false);
  const [hoverBtn, setHoverBtn] = useState(false);
  const [showModal, setShowModal] = useState(0);
  const [settingConfig, setSettingConfig] = useState<EditSettingParam>({
    label: "widget",
    params: {},
  });
  const [currentConfigValue, setCurrentConfigValue] = useState<Partial<WidgetMetaData>>({});

  const cols = { lg: 8, md: 4, xs: 2 };
  const [layouts, setLayouts] = useState<ReactGridLayout.Layouts>({
    xs: [],
    md: [],
    lg: [],
  });
  const [editLayouts, setEditLayouts] = useState<ReactGridLayout.Layouts>(JSON.parse(JSON.stringify(layouts)));

  const toggleEditMode = () => {
    setEditLayouts(JSON.parse(JSON.stringify(layouts)));
    setEditWidgetData(JSON.parse(JSON.stringify(widgetData)));
    setEditMode(true);
    setHoverBtn(false);
  };

  const openSetting = (ele: WidgetMetaData, template: EditSettingParam) => {
    setSettingConfig(template);
    setCurrentConfigValue(JSON.parse(JSON.stringify(ele)));
    setShowModal(2);
  };

  const deleteWidget = (id: string) => {
    setEditWidgetData(v => v.filter(ele => ele.id !== id));
  };

  const localStorageKey = "demo_dashboard";

  const compressSave = (layouts: ReactGridLayout.Layouts, widgetData: WidgetMetaData[]) => {
    const jsonData = { layouts: layouts, widgetData: widgetData };
    const jsonStr = JSON.stringify(jsonData);
    const compressJsonStr = lzstring.compress(jsonStr);
    return compressJsonStr;
  };
  const decompressSave = (str: string) => {
    const decompressJsonStr = lzstring.decompress(str);
    const jsonData = JSON.parse(decompressJsonStr) as {
      layouts: ReactGridLayout.Layouts;
      widgetData: WidgetMetaData[];
    };
    return jsonData;
  };

  const saveData = () => {
    let newLayouts: ReactGridLayout.Layouts = JSON.parse(JSON.stringify(editLayouts));
    for (const d of Object.keys(newLayouts)) {
      newLayouts[d].forEach(v => {
        delete v.moved;
        delete v.static;
      });
    }
    let newWidgetData = JSON.parse(JSON.stringify(editWidgetData));

    const saveStr = compressSave(newLayouts, newWidgetData);

    // temp save to local storage
    localStorage.setItem(localStorageKey, saveStr);

    setLayouts(newLayouts);
    setWidgetData(newWidgetData);
    setEditMode(v => !v);
  };

  const revertData = () => {
    setEditMode(v => !v);
  };

  useEffect(() => {
    const id = setInterval(() => {
      if (!dataFetch) {
        let widgetData: WidgetMetaData[] = [
          { id: nanoid(), type: "label", title: "Label", content: "basic label" },
          { id: nanoid(), type: "chart", title: "Chart", address: connectedAddress, slot: "2", color: "red" },
          {
            id: nanoid(),
            type: "btn",
            title: "Button",
            address: connectedAddress,
            slot: "2",
            btnText: "Click me!",
          },
          {
            id: nanoid(),
            type: "toggle",
            title: "Toggle",
            address: connectedAddress,
            slot: "2",
            btnOn: "ON",
            btnOff: "OFF",
          },
          {
            id: nanoid(),
            type: "slider",
            title: "Slider",
            address: connectedAddress,
            slot: "2",
            min: 0,
            max: 50,
            color: "blue",
          },
        ];
        let layout: ReactGridLayout.Layouts = {
          xs: widgetData.map((ele, i) => {
            const x = (i * 2) % cols.xs;
            const y = Math.floor((i * 2) / cols.xs);
            return { i: ele.id, x: x, y: y, w: 2, h: 4 };
          }),
          md: widgetData.map((ele, i) => {
            const x = (i * 2) % cols.md;
            const y = Math.floor((i * 2) / cols.md);
            return { i: ele.id, x: x, y: y, w: 2, h: 4 };
          }),
          lg: widgetData.map((ele, i) => {
            const x = (i * 2) % cols.lg;
            const y = Math.floor((i * 2) / cols.lg);
            return { i: ele.id, x: x, y: y, w: 2, h: 4 };
          }),
        };
        const saveData = localStorage.getItem(localStorageKey);
        if (saveData) {
          try {
            const jsonSaveData = decompressSave(saveData);
            widgetData = jsonSaveData.widgetData;
            layout = jsonSaveData.layouts;
          } catch (err) {
            console.error(err);
          }
        }

        setWidgetData(widgetData);
        setLayouts(layout);
        setDataFetch(true);
      }
    }, 100);
    return () => clearInterval(id);
  });

  const stripeColor1 = "transparent";
  const stripeColor2 = "#2727271d";
  const bgStyle = editMode
    ? ({
        "background-image": `linear-gradient(45deg, ${stripeColor1} 31.82%, ${stripeColor2} 31.82%, ${stripeColor2} 50%, ${stripeColor1} 50%, ${stripeColor1} 81.82%, ${stripeColor2} 81.82%, ${stripeColor2} 100%)`,
        "background-size": "55.00px 55.00px",
      } as React.CSSProperties)
    : {};

  return (
    <>
      <div className="flex items-center flex-col flex-grow p-4" style={bgStyle}>
        <div className="w-full max-w-screen-sm flex flex-row gap-x-2 items-center">
          {editMode ? (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => setShowModal(1)}>
                Add Widget
              </button>
              <button className="ml-auto btn btn-primary btn-sm" onClick={saveData}>
                Save
              </button>
              <button className="btn btn-primary btn-sm" onClick={revertData}>
                Cancel
              </button>
            </>
          ) : (
            <button className="ml-auto btn btn-primary btn-sm" disabled={!dataFetch} onClick={toggleEditMode}>
              Edit
            </button>
          )}
        </div>
        <div className="w-full overflow-x-auto overflow-y-hidden">
          {editMode ? (
            <GridLayout
              className="layout"
              isDraggable={!hoverBtn}
              isResizable={!hoverBtn}
              layouts={editLayouts}
              breakpoints={{ lg: 1200, md: 768, xs: 0 }}
              cols={cols}
              rowHeight={30}
              onLayoutChange={(_, l) => {
                setEditLayouts(l);
              }}
            >
              {editWidgetData.map(ele => {
                let inner = <SensesGenericWidget widgetData={ele} editMode></SensesGenericWidget>;
                if (isLabelWidget(ele)) {
                  inner = (
                    <SensesLabelWidget
                      widgetData={ele as LabelWidgetMetaData}
                      editMode
                      onMouseEnter={() => setHoverBtn(true)}
                      onMouseLeave={() => setHoverBtn(false)}
                      onEditSetting={() => openSetting(ele, LabelWidgetParamConfig)}
                      onDelWidget={() => deleteWidget(ele.id)}
                    ></SensesLabelWidget>
                  );
                } else if (isChartWidget(ele)) {
                  inner = (
                    <SensesChartWidget
                      widgetData={ele as ChartWidgetMetaData}
                      editMode
                      onMouseEnter={() => setHoverBtn(true)}
                      onMouseLeave={() => setHoverBtn(false)}
                      onEditSetting={() => openSetting(ele, ChartWidgetParamConfig)}
                      onDelWidget={() => deleteWidget(ele.id)}
                    ></SensesChartWidget>
                  );
                } else if (isControlToggleWidget(ele)) {
                  inner = (
                    <SensesToggleControlWidget
                      widgetData={ele as ControlToggleWidgetMetaData}
                      editMode
                      onMouseEnter={() => setHoverBtn(true)}
                      onMouseLeave={() => setHoverBtn(false)}
                      onEditSetting={() => openSetting(ele, ToggleControlWidgetParamConfig)}
                      onDelWidget={() => deleteWidget(ele.id)}
                    ></SensesToggleControlWidget>
                  );
                } else if (isControlButtonWidget(ele)) {
                  inner = (
                    <SensesButtonControlWidget
                      widgetData={ele as ControlButtonWidgetMetaData}
                      editMode
                      onMouseEnter={() => setHoverBtn(true)}
                      onMouseLeave={() => setHoverBtn(false)}
                      onEditSetting={() => openSetting(ele, ButtonControlWidgetParamConfig)}
                      onDelWidget={() => deleteWidget(ele.id)}
                    ></SensesButtonControlWidget>
                  );
                } else if (isControlSliderWidget(ele)) {
                  inner = (
                    <SensesSliderControlWidget
                      widgetData={ele as ControlSliderWidgetMetaData}
                      editMode
                      onMouseEnter={() => setHoverBtn(true)}
                      onMouseLeave={() => setHoverBtn(false)}
                      onEditSetting={() => openSetting(ele, SliderControlWidgetParamConfig)}
                      onDelWidget={() => deleteWidget(ele.id)}
                    ></SensesSliderControlWidget>
                  );
                }
                return (
                  <div key={ele.id} className="border-2 bg-blue-200 relative">
                    {inner}
                  </div>
                );
              })}
            </GridLayout>
          ) : (
            <GridLayout
              className="layout"
              isDraggable={false}
              isResizable={false}
              layouts={layouts}
              breakpoints={{ lg: 1200, md: 768, xs: 0 }}
              cols={{ lg: 8, md: 4, xs: 2 }}
              rowHeight={30}
            >
              {widgetData.map(ele => {
                let inner = <SensesGenericWidget widgetData={ele}></SensesGenericWidget>;
                if (isLabelWidget(ele)) {
                  inner = <SensesLabelWidget widgetData={ele as LabelWidgetMetaData}></SensesLabelWidget>;
                } else if (isChartWidget(ele)) {
                  inner = <SensesChartWidget widgetData={ele as ChartWidgetMetaData}></SensesChartWidget>;
                } else if (isControlToggleWidget(ele)) {
                  inner = (
                    <SensesToggleControlWidget
                      widgetData={ele as ControlToggleWidgetMetaData}
                    ></SensesToggleControlWidget>
                  );
                } else if (isControlButtonWidget(ele)) {
                  inner = (
                    <SensesButtonControlWidget
                      widgetData={ele as ControlButtonWidgetMetaData}
                    ></SensesButtonControlWidget>
                  );
                } else if (isControlSliderWidget(ele)) {
                  inner = (
                    <SensesSliderControlWidget
                      widgetData={ele as ControlSliderWidgetMetaData}
                    ></SensesSliderControlWidget>
                  );
                }
                return (
                  <div key={ele.id} className="border-2 bg-blue-200">
                    {inner}
                  </div>
                );
              })}
            </GridLayout>
          )}
        </div>
        <AddWidgetModal
          show={showModal == 1}
          onAddWidget={w => {
            setEditWidgetData(v => {
              const newData = [...v, w];
              return newData;
            });
            setEditLayouts(v => {
              const newData = JSON.parse(JSON.stringify(v));

              const last_xs = newData.xs[newData.xs.length - 1];
              const nextSeq_xs = last_xs.y * cols.xs + last_xs.x + 1;
              const x_xs = nextSeq_xs % cols.md;
              const y_xs = Math.floor(nextSeq_xs / cols.xs);
              newData.xs.push({ i: w.id, x: x_xs, y: y_xs, w: 2, h: 4 });

              const last_md = newData.md[newData.md.length - 1];
              const nextSeq_md = last_md.y * cols.md + last_md.x + 1;
              const x_md = nextSeq_md % cols.md;
              const y_md = Math.floor(nextSeq_md / cols.md);
              newData.md.push({ i: w.id, x: x_md, y: y_md, w: 2, h: 4 });

              const last_lg = newData.lg[newData.lg.length - 1];
              const nextSeq_lg = last_lg.y * cols.lg + last_lg.x + 1;
              const x_lg = nextSeq_lg % cols.md;
              const y_lg = Math.floor(nextSeq_lg / cols.lg);
              newData.lg.push({ i: w.id, x: x_lg, y: y_lg, w: 2, h: 4 });

              return newData;
            });
            setShowModal(0);
          }}
          onClose={() => setShowModal(0)}
        ></AddWidgetModal>
        <SettingModal
          show={showModal == 2}
          configTemplate={settingConfig}
          valueOfParam={param => {
            return (currentConfigValue as Record<string, any>)[param];
          }}
          onValueChange={(param, value) => {
            const oldValue = JSON.parse(JSON.stringify(currentConfigValue));
            oldValue[param] = value;
            setCurrentConfigValue(oldValue);
          }}
          applyValue={() => {
            const newEditWidgetData: WidgetMetaData[] = JSON.parse(JSON.stringify(editWidgetData));
            const targetId = newEditWidgetData.findIndex(ele => ele.id === currentConfigValue.id);
            if (targetId !== -1) {
              newEditWidgetData.splice(targetId, 1, currentConfigValue as WidgetMetaData);
            }
            setEditWidgetData(newEditWidgetData);
            setShowModal(0);
          }}
          onClose={() => setShowModal(0)}
        ></SettingModal>
      </div>
    </>
  );
};

export default DashboardPage;
