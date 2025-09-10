import { useQueries, useQuery } from "@tanstack/react-query";
import Base from "../BaseComponent";
import BoxDefault from "../components/BoxDefault";
import { Button } from "../components/Button";
import Table, { type FiltersColumn } from "../components/Tables";
import { defaultMode } from "../config/api-config";
import { getAlunos } from "../api/api-alunos";
import { Dialog } from "primereact/dialog";
import Select from "react-select";
import { InputText } from "primereact/inputtext";
import { escolas } from "../api/api-escolas";
import { getTurmas } from "../api/api-turmas";


export interface Student {
    id: number;
    name: string;
    classGroup: string;
    school: string;
    grade: string

}
function Alunos() {
    const { data, isSuccess } = useQuery(
        {
            queryKey: ["alunos"],
            queryFn: getAlunos
        }
    )
    const filters: FiltersColumn = {
        name: { ...defaultMode },
        classGroup: { ...defaultMode },
        grade: { ...defaultMode },
        school: { ...defaultMode },
    }
    const PostAluno = () => {
        const queries = useQueries({
            queries : [
                {
                    queryFn : escolas,
                    queryKey : ["schools"]
                },
                {
                    queryFn : getTurmas,
                    queryKey : ["class"]
                },
            ]
        })
        const escolasOpts = queries[0].data?.map(e => ({ label : e.name , value : e.id}))
        const turmasOpts = queries[1].data?.map(e => ({ label : e.name , value : e.id}))
        return <Dialog className="w-1/2" visible={true} onHide={() => { }}>
            <div className="p-4">
                <h2>
                    Novo aluno
                </h2>
                <form action="" className="mt-4">
                    <div className="flex flex-col mt-4">
                        <label className="mb-2">Nome do aluno</label>
                        <InputText className="p-4" placeholder="Insira o nome do aluno" />
                    </div>
                    <div className="flex flex-col mt-4">
                        <label className="mb-2">Matricula</label>
                        <InputText className="p-4" placeholder="Insira matricula" />
                    </div>
                    <div className="flex flex-col mt-4">
                        <label className="mb-2">Escola</label>
                        <Select options={escolasOpts} placeholder="selecione a escola"/>
                    </div>
                    <div className="flex flex-col mt-4 mb-2">
                        <label className="mb-2">Turma</label>
                        <Select options={turmasOpts} placeholder="selecione a turma"/>
                    </div>
                    <Button>
                        enviar
                    </Button>
                </form>
            </div>
        </Dialog>
    }
    return <Base>
        <PostAluno/>
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