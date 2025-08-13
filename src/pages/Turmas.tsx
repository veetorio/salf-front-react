import Base from "../BaseComponent";
import Table, { type FiltersColumn } from "../components/Tables";
import BoxDefault from "../components/BoxDefault";
import { Button } from "../components/Button";
import { defaultMode } from "../config/api-config";
import { useQuery } from "@tanstack/react-query";
import { getTurmas } from "../api/api-turmas";
export interface Class {
    id: number;
    name: string;
    grade: string;
    turn: string;
    totalStudents: number;
    school: string
    group: string
}

function Turmas() {
    const { data ,isSuccess} = useQuery(
        {
            queryKey : ['turmas'],
            queryFn : getTurmas
        }
    )

    const filters: FiltersColumn = {
        name: { ...defaultMode },
        grade: { ...defaultMode },
        turn: { ...defaultMode },
        school: { ...defaultMode },
        group: { ...defaultMode }
    }
    return <Base>
        <BoxDefault subtitle="Gerencie as turmas do sistema" title="Turmas">
            <Button>
                nova turma
            </Button>
        </BoxDefault>
        {
            isSuccess && <Table rows={data ?? []} title={"Turmas"} isAct filterInputs={filters} />

        }
    </Base>
}

export default Turmas