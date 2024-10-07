import { Datepicker } from "flowbite-react";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { Timepicker } from "./Timepicker";
import { DEFAULT_LOCALE } from "@/api/constants";

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  onBlur: () => void;
}

const Component: ForwardRefRenderFunction<HTMLInputElement, DateTimePickerProps> = ({ value, onChange, onBlur }) => {
  return (
    <div className="flex items-center gap-4">
      <Datepicker
        labelTodayButton="Сегодня"
        labelClearButton="Сбросить"
        language={DEFAULT_LOCALE}
        weekStart={1}
        onSelectedDateChanged={(date) => {
          const hours = value.getHours();
          const minutes = value.getMinutes();
          date.setHours(hours);
          date.setMinutes(minutes);
          onChange(date);
        }}
        onBlur={onBlur}
        value={value.toLocaleDateString(DEFAULT_LOCALE)}
        defaultDate={value}
      />
      <Timepicker
        value={value.toLocaleTimeString(DEFAULT_LOCALE).split(":").slice(0, 2).join(":")}
        onBlur={onBlur}
        onChange={(e) => {
          const [hours, minutes] = e.target.value.split(":");
          const newValue = new Date(value);
          newValue.setHours(Number(hours));
          newValue.setMinutes(Number(minutes));
          onChange(newValue);
        }}
      />
    </div>
  );
};

export const DateTimePicker = forwardRef(Component);
