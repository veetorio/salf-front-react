import { useQuery } from "@tanstack/react-query";
import Base from "../BaseComponent";
import BoxDefault from "../components/BoxDefault";
import { Button } from "../components/Button";
import Table, { type FiltersColumn } from "../components/Tables";
import { defaultMode } from "../config/api-config";
import { getAlunos } from "../api/api-alunos";


export interface Student {
    id: number;
    name: string;
    classGroup: string;
    school: string;
    grade: string

}
function Alunos() {
    const { data , isSuccess} = useQuery(
        {
            queryKey : ["alunos"],
            queryFn : getAlunos
        }
    )
    const filters: FiltersColumn = {
        name: {...defaultMode},
        classGroup: {...defaultMode},
        grade: {...defaultMode},
        school: {...defaultMode},
    }
    return <Base>
        <BoxDefault title="Alunos" subtitle="Gerencie os alunos do sistema">
            <div className="flex gap-2">
                <Button>
                    exportar
                </Button>
                <Button>
                    novo aluno
                </Button>
            </div>
        </BoxDefault>
        {
            isSuccess && <Table title="Alunos" filterInputs={filters} isAct rows={data ?? []} />

        }
    </Base>
}

export default Alunos