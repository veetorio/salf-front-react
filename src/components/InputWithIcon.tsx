import { InputText } from "primereact/inputtext";
import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

type InputWithIconProps = {
    icon: ReactNode;
    type?: string;
    placeholder?: string;
    value?: string;
    field : UseFormRegisterReturn
};

export const InputWithIcon = ({
    icon,
    ...props
}: InputWithIconProps) => (
    <div className="flex mt-2 items-center bg-blue-50 border rounded-md px-3 w-fit ">
        {icon}
        <InputText className="p-4 bg-transparent border-none focus:ring-0 ml-2 outline-none" {...props} {...props.field} />
    </div>
);

export default InputWithIcon