import { type PropsWithChildren } from "react";

function BoxDefault(props : PropsWithChildren<{ title : string , subtitle? : string}>) {
    return  <header className="px-4 py-8 shadow-md rounded-xl flex justify-between">
        <div>
            <h1 className="text-blue-950">{props.title}</h1>
            <p className="text-gray-7">{props.subtitle}</p>
        </div>
        <div>
            {
                props.children
            }
        </div>
    </header>
}

export default BoxDefault