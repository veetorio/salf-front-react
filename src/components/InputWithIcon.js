import { InputText } from "primereact/inputtext";
export const InputWithIcon = ({ icon, ...props }) => (<div className="flex mt-2 items-center bg-blue-50 border rounded-md px-3 w-fit ">
        {icon}
        <InputText className="p-4 bg-transparent border-none focus:ring-0 ml-2 outline-none" {...props} {...props.field}/>
    </div>);
export default InputWithIcon;
