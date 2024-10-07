import { DetailedHTMLProps, FC, InputHTMLAttributes } from "react";
import cn from "classnames";

export const Timepicker: FC<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3.5">
        <svg
          className="size-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <input
        type="time"
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm leading-none text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
        min="09:00"
        max="18:00"
        value="00:00"
        {...props}
      />
    </div>
  );
};
