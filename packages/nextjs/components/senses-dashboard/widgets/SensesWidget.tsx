import clsx from "clsx";
import { CogIcon, TrashIcon } from "@heroicons/react/24/outline";
import { WidgetMetaData } from "~~/types/widgets";

interface SensesWidgetWrapperProps {
  children?: React.ReactNode;
  editMode?: boolean;
  onEditSetting?: () => void;
  onDelWidget?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const SensesWidgetWrapper: React.FC<SensesWidgetWrapperProps> = ({
  children,
  editMode,
  onEditSetting,
  onDelWidget,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div className="relative w-full h-full">
      <div className={clsx("absolute inset-0 p-2 overflow-auto", editMode ? "pointer-events-none" : "")}>
        {children}
      </div>
      {editMode && (onEditSetting || onDelWidget) && (
        <div className="absolute bottom-2 left-2 right-2 flex flex-row gap-x-2">
          <div
            className="w-6 h-6 btn btn-xs p-1 cursor-pointer flex justify-center items-center"
            onClick={onEditSetting}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <CogIcon className="w-4 h-4" title="Setting"></CogIcon>
          </div>
          <div
            className="w-6 h-6 btn btn-xs p-1 cursor-pointer flex justify-center items-center"
            onClick={onDelWidget}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <TrashIcon className="w-4 h-4" title="Delete"></TrashIcon>
          </div>
        </div>
      )}
    </div>
  );
};

interface SensesWidgetProps {
  widgetData: WidgetMetaData;
  editMode?: boolean;
  onClick?: () => void;
}

export const SensesGenericWidget: React.FC<SensesWidgetProps> = ({ widgetData, editMode, onClick }) => {
  return (
    <SensesWidgetWrapper editMode={editMode} onEditSetting={onClick}>
      <div>{`${JSON.stringify(widgetData)}`}</div>
    </SensesWidgetWrapper>
  );
};
