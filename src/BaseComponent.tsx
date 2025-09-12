import type { PropsWithChildren } from "react";
import SideBar from "./components/SideBar";
import { LOCAL } from "./config/api-config";
import { storeLogin } from "./contexts/login";
const roleDisplay : Record<string,string> = {
    'ADMIN': 'Administrador',
    'COORDINATOR': 'Coordenador',
    'APPLICATOR': 'Aplicador',
    'MANAGER': 'Gestor'
};
function Base(props: PropsWithChildren) {
    const { user } = storeLogin()
    const userLogin = user ? user : JSON.parse((localStorage.getItem("user") || "")).user
    return <main className="w-screen h-screen flex font-sans">
        <SideBar />
        <section className="w-full h-full overflow-auto">
            <header className="shadow-sm w-full p-4 flex justify-between">
                <div className="c-blue-950">
                    <h1>
                        SALF - {LOCAL}
                    </h1>
                </div>
                <div className="flex items-center gap-8">
                    <span className="bg-blue-2 c-blue-9 p-2 rounded-md text-sm">{roleDisplay[userLogin.role]}</span>
                    {userLogin.name}
                </div>
            </header>
            <section className="p-2 w-full bg-gray-1">
                {props.children}
            </section>
        </section>
    </main>
}
export default Base