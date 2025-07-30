import type { PropsWithChildren } from "react";
import SideBar from "./components/SideBar";
import { LOCAL } from "./config/api.config";
import { storeLogin } from "./contexts/login";
const roleDisplay = {
    'ADMIN': 'Administrador',
    'COORDINATOR': 'Coordenador',
    'APPLICATOR': 'Aplicador',
    'MANAGER': 'Gestor'
};
function Base(props: PropsWithChildren) {
    const { user } = storeLogin()
    return <main className="w-screen h-screen flex font-sans">
        <SideBar />
        <section className="w-full">
            <header className="shadow-sm w-full p-4 flex justify-between">
                <div className="c-blue-950">
                    <h1>
                        SALF - {LOCAL}
                    </h1>
                </div>
                <div className="flex items-center gap-8">
                    <span className="bg-blue-2 c-blue-9 p-2 rounded-md text-sm">{roleDisplay[user?.user.role]}</span>
                    {user?.user.name}
                </div>
            </header>
            <section className="p-4">
                {props.children}
            </section>
        </section>
    </main>
}
export default Base