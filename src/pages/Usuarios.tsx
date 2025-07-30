import { useQuery } from "@tanstack/react-query";
import Base from "../BaseComponent"
import BoxDefault from "../components/BoxDefault"
import { Button } from "../components/Button"
import Table from "../components/Tables"
import { getUsuarios } from "../config/api-usuarios";
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

function Usuarios() {
    const { data  } = useQuery({
        queryKey :["usuarios"],
        queryFn : getUsuarios
    })
    console.log(data)
    const users: User[] = [
        { id: 1, name: "Alice", email: "alice@example.com", role: "ADMIN" },
        { id: 2, name: "Bob", email: "bob@example.com", role: "APPLICATOR" },
        { id: 3, name: "Mozart", email: "bob@example.com", role: "COORDINATOR" },
        { id: 4, name: "Bob", email: "bob@example.com", role: "MANAGER" },
    ];

    return <Base>
        <BoxDefault title="Usuarios" subtitle="Gerencie os usuários do sistema">
            <Button>
                <div className="text-align-center"></div>
                criar usuario
            </Button>
        </BoxDefault>
        <Table title="Lista de Usuários" rows={users} isViewFilter={["name"]} filter={["name","role","email"]} isAct={true}/>
    </Base>
}

export default Usuarios