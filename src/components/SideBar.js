import { Link, useNavigate } from "react-router-dom";
import { storeLogin } from "../contexts/login";
import { LOCAL } from "../config/api-config";
import { MdAssignmentTurnedIn, MdDashboard, MdEmojiEvents, MdGroups, MdHowToReg, MdLogout, MdPerson, MdSchool } from "react-icons/md";
const rolesPanel = {
    'ADMIN': ["Dashboard", "Escolas", "Turmas", "Alunos", "Avaliações", "Realizar", "Usuarios", "Ranking-de-Alunos", "Ranking-de-Escolas"],
    'COORDINATOR': ["Escolas", "Turmas", "Alunos", "Avaliações", "Ranking de Alunos", "Ranking de Escolas"],
    'APPLICATOR': ["Realizar"],
    'MANAGER': ["Dashboard"]
};
const icons = {
    "Dashboard": <MdDashboard />,
    "Escolas": <MdSchool />,
    "Turmas": <MdGroups />,
    "Alunos": <MdPerson />,
    "Avaliações": <MdAssignmentTurnedIn />,
    "Usuarios": <MdPerson />,
    "Realizar": <MdHowToReg />,
    "Ranking-de-Alunos": <MdEmojiEvents />,
    "Ranking-de-Escolas": <MdSchool />,
    "sair": <MdLogout />
};
function SideBar() {
    const { user, clear } = storeLogin();
    const userLogin = user ? user : JSON.parse((localStorage.getItem("user") || ""));
    const items = rolesPanel[userLogin.user.role] ?? [];
    const nav = useNavigate();
    const logout = () => {
        localStorage.removeItem("user");
        clear();
        nav("/");
    };
    return <aside className="h-screen w-1/5  bg-blue-950 px-4 py-5 font-sans c-white">
        <header>
            <h1>
                Salf {LOCAL}
            </h1>
        </header>
        <nav className="flex flex-col gap-4 mt-5">
            {items.map((e) => <Link className="c-white decoration-none flex gap-4 items-center hover:c-gray transition" to={`/${e}`}>{icons[e]}{e}</Link>)}
            <div onClick={logout} className="flex gap-4 items-center hover:c-gray">{icons["sair"]}sair</div>
        </nav>
    </aside>;
}
export default SideBar;
