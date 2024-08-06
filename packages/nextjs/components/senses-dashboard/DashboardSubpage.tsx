import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Address } from "../scaffold-eth";
import { AddWidgetModal } from "./AddWidgetModal";
import { SettingModal } from "./SettingModal";
import { ButtonControlWidgetParamConfig, SensesButtonControlWidget } from "./widgets/ButtonControlWidget";
import { ChartWidgetParamConfig, SensesChartWidget } from "./widgets/ChartWidget";
import { LabelWidgetParamConfig, SensesLabelWidget } from "./widgets/LabelWidget";
import { SensesGenericWidget } from "./widgets/SensesWidget";
import { SensesSliderControlWidget, SliderControlWidgetParamConfig } from "./widgets/SliderControlWidget";
import { SensesToggleControlWidget, ToggleControlWidgetParamConfig } from "./widgets/ToggleControlWidget";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import {
  ChartWidgetMetaData,
  ControlButtonWidgetMetaData,
  ControlSliderWidgetMetaData,
  ControlToggleWidgetMetaData,
  DashboardData,
  EditSettingParam,
  LabelWidgetMetaData,
  WidgetMetaData,
} from "~~/types/widgets";
import { dashboardDataToSaveHexStr, saveHexStrToDashboardData } from "~~/utils/save-compression";

const GridLayout = WidthProvider(Responsive);

export const DashboardSubpage = ({ address, id, isNew }: { address: string; id: bigint; isNew?: boolean }) => {
  const { address: connectAddress } = useAccount();
  const router = useRouter();
  const isEditable = connectAddress === address;

  const { data: dashboardRawData } = useScaffoldReadContract({
    contractName: "SensesJBCDashboard",
    functionName: "dashboardData",
    args: [address, id],
  });

  const { writeContractAsync, isPending } = useScaffoldWriteContract("SensesJBCDashboard");

  const [dataFetch, setDataFetch] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    widgets: [],
    layouts: {},
  });
  const [editDashboardData, setEditDashboardData] = useState<DashboardData>({
    widgets: [],
    layouts: {},
  });

  const [editMode, setEditMode] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [hoverBtn, setHoverBtn] = useState(false);
  const [showModal, setShowModal] = useState(0);
  const [settingConfig, setSettingConfig] = useState<EditSettingParam>({
    label: "widget",
    params: {},
  });
  const [currentConfigValue, setCurrentConfigValue] = useState<Partial<WidgetMetaData>>({});

  const cols = { lg: 8, md: 4, xs: 2 };

  const toggleEditMode = () => {
    setEditDashboardData(JSON.parse(JSON.stringify(dashboardData)));
    setEditMode(true);
    setHoverBtn(false);
  };

  const openSetting = (ele: WidgetMetaData, template: EditSettingParam) => {
    setSettingConfig(template);
    setCurrentConfigValue(JSON.parse(JSON.stringify(ele)));
    setShowModal(2);
  };

  const deleteWidget = (id: string) => {
    setEditDashboardData(data => {
      const newData: DashboardData = JSON.parse(JSON.stringify(data));
      newData.widgets = newData.widgets.filter(widget => widget.id !== id);
      return newData;
    });
  };

  const saveData = async () => {
    const newSaveData: DashboardData = JSON.parse(JSON.stringify(editDashboardData));

    for (const d of Object.keys(newSaveData.layouts)) {
      newSaveData.layouts[d].forEach(ele => {
        delete ele.moved;
        delete ele.static;
      });
    }

    setDashboardData(newSaveData);
    setEditMode(false);
    setSaveError(false);
    const saveStr = dashboardDataToSaveHexStr(newSaveData);

    try {
      await writeContractAsync({ functionName: "updateDashboardData", args: [id, saveStr] });
      if (isNew) {
        router.replace(`/dashboard/${address}/${id}`);
      }
    } catch (err) {
      console.error(err);
      setSaveError(true);
    }
  };

  const revertData = () => {
    setEditMode(v => !v);
  };

  useEffect(() => {
    const id = setInterval(() => {
      if (!dataFetch && dashboardRawData) {
        let dashboardData: DashboardData = {
          widgets: [],
          layouts: {},
        };
        const saveData = dashboardRawData;

        if (saveData) {
          try {
            const parseData = saveHexStrToDashboardData(saveData);
            if (!parseData) {
              throw new Error("Invalid Save Data");
            }
            dashboardData = parseData;
          } catch (err) {
            console.error(err);
          }
        } else {
          console.warn("Invalid strStorage data or not initialize: use default value");
        }

        setDashboardData(dashboardData);
        setDataFetch(true);
      }
    }, 100);
    return () => clearInterval(id);
  }, [dataFetch, dashboardRawData]);

  const stripeColor1 = "transparent";
  const stripeColor2 = "#2727270C";
  const bgStyle = editMode
    ? ({
        "background-image": `linear-gradient(45deg, ${stripeColor1} 31.82%, ${stripeColor2} 31.82%, ${stripeColor2} 50%, ${stripeColor1} 50%, ${stripeColor1} 81.82%, ${stripeColor2} 81.82%, ${stripeColor2} 100%)`,
        "background-size": "55.00px 55.00px",
      } as React.CSSProperties)
    : {};

  return (
    <>
      <div className="flex items-center flex-col flex-grow p-4" style={bgStyle}>
        <div className="my-2 pb-2 w-full max-w-screen-sm flex flex-row gap-x-2 items-center justify-between border-b-2">
          <div>#{id.toString()}</div>
          <Address address={address} />
          {isNew ? <div className="badge badge-success">New</div> : <div className="badge badge-warning">View</div>}
        </div>
        <div className="w-full max-w-screen-sm flex flex-row gap-x-2 items-center justify-between">
          {editMode ? (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => setShowModal(1)}>
                Add Widget
              </button>
              <div className="flex flex-row gap-2">
                <button className="btn btn-primary btn-sm" onClick={saveData}>
                  Save
                </button>
                <button className="btn btn-primary btn-sm" onClick={revertData}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              {!dataFetch || isPending ? (
                <div className="flex flex-row gap-x-2 items-center">
                  <span className="loading loading-spinner loading-xs"></span>
                  <span>{isPending ? "Saving..." : "Loading..."}</span>
                </div>
              ) : saveError ? (
                <>
                  <div className="flex flex-row gap-x-2 items-center">
                    <span>Save Error</span>
                  </div>
                  <button className="btn btn-primary btn-sm" disabled={!dataFetch || isPending} onClick={saveData}>
                    Resave
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-row gap-x-2 items-center">
                    <span>{dashboardData.widgets.length === 0 ? "No Widget" : "Ready"}</span>
                  </div>
                </>
              )}
              {isEditable && (
                <button className="btn btn-primary btn-sm" disabled={!dataFetch || isPending} onClick={toggleEditMode}>
                  Edit
                </button>
              )}
            </>
          )}
        </div>
        <div className="w-full overflow-x-auto overflow-y-hidden">
          {editMode ? (
            <GridLayout
              className="layout"
              isDraggable={!hoverBtn}
              isResizable={!hoverBtn}
              layouts={editDashboardData.layouts}
              breakpoints={{ lg: 1200, md: 768, xs: 0 }}
              cols={cols}
              rowHeight={30}
              onLayoutChange={(_, newLayouts) => {
                setEditDashboardData(data => {
                  const newData = JSON.parse(JSON.stringify(data));
                  newData.layouts = newLayouts;
                  return newData;
                });
              }}
            >
              {editDashboardData.widgets.map(ele => {
                let inner = <SensesGenericWidget widgetData={ele} editMode></SensesGenericWidget>;
                switch (ele.type) {
                  case "label":
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
                    break;
                  case "chart":
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
                    break;
                  case "toggle":
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
                    break;
                  case "btn":
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
                    break;
                  case "slider":
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
                    break;
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
              layouts={dashboardData.layouts}
              breakpoints={{ lg: 1200, md: 768, xs: 0 }}
              cols={{ lg: 8, md: 4, xs: 2 }}
              rowHeight={30}
            >
              {dashboardData.widgets.map(ele => {
                let inner = <SensesGenericWidget widgetData={ele}></SensesGenericWidget>;
                switch (ele.type) {
                  case "label":
                    inner = <SensesLabelWidget widgetData={ele as LabelWidgetMetaData}></SensesLabelWidget>;
                    break;
                  case "chart":
                    inner = <SensesChartWidget widgetData={ele as ChartWidgetMetaData}></SensesChartWidget>;
                    break;
                  case "toggle":
                    inner = (
                      <SensesToggleControlWidget
                        widgetData={ele as ControlToggleWidgetMetaData}
                      ></SensesToggleControlWidget>
                    );
                    break;
                  case "btn":
                    inner = (
                      <SensesButtonControlWidget
                        widgetData={ele as ControlButtonWidgetMetaData}
                      ></SensesButtonControlWidget>
                    );
                    break;
                  case "slider":
                    inner = (
                      <SensesSliderControlWidget
                        widgetData={ele as ControlSliderWidgetMetaData}
                      ></SensesSliderControlWidget>
                    );
                    break;
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
          onAddWidget={newWidget => {
            setEditDashboardData(data => {
              const newData = JSON.parse(JSON.stringify(data));
              newData.widgets.push(newWidget);

              if (!newData.layouts.xs) {
                newData.layouts.xs = [];
              }
              const last_xs = newData.layouts.xs[newData.layouts.xs.length - 1] || { x: -1, y: 0 };
              const nextSeq_xs = last_xs.y * cols.xs + last_xs.x + 1;
              const x_xs = nextSeq_xs % cols.md;
              const y_xs = Math.floor(nextSeq_xs / cols.xs);
              newData.layouts.xs.push({ i: newWidget.id, x: x_xs, y: y_xs, w: 2, h: 4 });

              if (!newData.layouts.md) {
                newData.layouts.md = [];
              }
              const last_md = newData.layouts.md[newData.layouts.md.length - 1] || { x: -1, y: 0 };
              const nextSeq_md = last_md.y * cols.md + last_md.x + 1;
              const x_md = nextSeq_md % cols.md;
              const y_md = Math.floor(nextSeq_md / cols.md);
              newData.layouts.md.push({ i: newWidget.id, x: x_md, y: y_md, w: 2, h: 4 });

              if (!newData.layouts.lg) {
                newData.layouts.lg = [];
              }
              const last_lg = newData.layouts.lg[newData.layouts.lg.length - 1] || { x: -1, y: 0 };
              const nextSeq_lg = last_lg.y * cols.lg + last_lg.x + 1;
              const x_lg = nextSeq_lg % cols.md;
              const y_lg = Math.floor(nextSeq_lg / cols.lg);
              newData.layouts.lg.push({ i: newWidget.id, x: x_lg, y: y_lg, w: 2, h: 4 });

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
            setEditDashboardData(data => {
              const newData: DashboardData = JSON.parse(JSON.stringify(data));
              const targetId = newData.widgets.findIndex(ele => ele.id === currentConfigValue.id);
              if (targetId !== -1) {
                newData.widgets.splice(targetId, 1, currentConfigValue as WidgetMetaData);
              }
              return newData;
            });
            setShowModal(0);
          }}
          onClose={() => setShowModal(0)}
        ></SettingModal>
      </div>
    </>
  );
};
