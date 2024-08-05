import { ChangeEvent, ReactNode, useCallback } from "react";
import { CommonInputProps } from "~~/components/scaffold-eth";

type TextareaStyledProps<T> = CommonInputProps<T> & {
  error?: boolean;
  required?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  reFocus?: boolean;
};

export const TextareaStyled = <T extends { toString: () => string } | undefined = string>({
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
  disabled,
}: TextareaStyledProps<T>) => {
  let modifier = "";
  if (error) {
    modifier = "border-error";
  } else if (disabled) {
    modifier = "border-disabled bg-base-300";
  }

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value as unknown as T);
    },
    [onChange],
  );

  return (
    <div className={`flex border-2 border-base-300 bg-base-200 rounded-xl text-accent ${modifier}`}>
      <textarea
        className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 min-h-[8rem] px-4 py-2 border w-full font-medium placeholder:text-accent/50 text-gray-400"
        placeholder={placeholder}
        name={name}
        value={value?.toString()}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        autoComplete="off"
      ></textarea>
    </div>
  );
};
