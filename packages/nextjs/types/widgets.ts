export type WidgetMetaData = {
  id: string;
  type: string;
  [x: string]: string;
};

export type FetchableWidgetMetaData = WidgetMetaData & {
  slot: string;
  address: string;
};

export type ChartWidgetMetaData = FetchableWidgetMetaData & {
  type: "chart";
  title: string;
  label?: string;
  color?: string;
};

export type LabelWidgetMetaData = {
  id: string;
  type: "label";
  title: string;
  content: string;
};

export type ControlToggleWidgetMetaData = FetchableWidgetMetaData & {
  type: "toggle";
  title?: string;
  onText?: string;
  offText?: string;
  onValue?: string;
  offValue?: string;
  colorOn?: string;
  colorOff?: string;
};

export type ControlButtonWidgetMetaData = FetchableWidgetMetaData & {
  id: string;
  type: "btn";
  title?: string;
  btnText?: string;
  color?: string;
  value?: string;
};

export type ControlSliderWidgetMetaData = FetchableWidgetMetaData & {
  type: "slider";
  title?: string;
  prefix?: string;
  suffix?: string;
  color?: string;
  min: string;
  max: string;
};

export type AddWidgetParam = {
  label: string;
  type: WidgetMetaData["type"];
  defaultValues: {
    [x: string]: string;
  };
};

export type WidgetInputParamType = "string" | "string_long" | "address" | "uint256" | "number" | "color";
export type EditSettingParam = {
  label: string;
  params: {
    [x: string]: {
      type: WidgetInputParamType;
      name: string;
      required?: boolean;
    };
  };
};

export type DashboardData = {
  widgets: WidgetMetaData[];
  layouts: ReactGridLayout.Layouts;
};
