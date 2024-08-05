import { WidgetMetaData } from "~~/types/widgets";

export const isLabelWidget = (widget: WidgetMetaData) => {
  return widget.type === "label";
};

export const isChartWidget = (widget: WidgetMetaData) => {
  return widget.type === "chart";
};

export const isControlToggleWidget = (widget: WidgetMetaData) => {
  return widget.type === "toggle";
};

export const isControlButtonWidget = (widget: WidgetMetaData) => {
  return widget.type === "btn";
};

export const isControlSliderWidget = (widget: WidgetMetaData) => {
  return widget.type === "slider";
};
