export type ChartWidgetMetaData = {
  id: string;
  type: "chart";
  title: string;
  address: string;
  slot: string;
  color?: string;
};

export type LabelWidgetMetaData = {
  id: string;
  type: "label";
  title: string;
  content: string;
};

export type ControlToggleWidgetMetaData = {
  id: string;
  type: "toggle";
  address: string;
  slot: string;
  title?: string;
  onText?: string;
  offText?: string;
  colorOn?: string;
  colorOff?: string;
};

export type ControlButtonWidgetMetaData = {
  id: string;
  type: "btn";
  address: string;
  slot: string;
  title?: string;
  btnText?: string;
  color?: string;
};

export type ControlSliderWidgetMetaData = {
  id: string;
  type: "slider";
  title?: string;
  prefix?: string;
  suffix?: string;
  color?: string;
  address: string;
  slot: string;
  min: string;
  max: string;
};

export type WidgetMetaData =
  | ChartWidgetMetaData
  | ControlButtonWidgetMetaData
  | ControlToggleWidgetMetaData
  | ControlSliderWidgetMetaData
  | LabelWidgetMetaData
  | {
      id: string;
      type: string;
      [x: string]: string;
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
