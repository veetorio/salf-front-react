import { useQueries, useQuery } from "@tanstack/react-query";
import Base from "../BaseComponent";
import BoxDefault from "../components/BoxDefault";
import { Button } from "../components/Button";
import Table, {} from "../components/Tables";
import { defaultMode } from "../config/api-config";
import { deleteAluno, getAluno, getAlunos, postAlunos, putAlunos } from "../api/api-alunos";
import { Dialog } from "primereact/dialog";
import Select from "react-select";
import { InputText } from "primereact/inputtext";
import { escolas } from "../api/api-escolas";
import { getTurmas } from "../api/api-turmas";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { LayerLoad } from "./RankingDeALunos";
function Alunos() {
    const { data, isSuccess } = useQuery({
        queryKey: ["alunos"],
        queryFn: getAlunos
    });
    const filters = {
        name: { ...defaultMode },
        classGroup: { ...defaultMode },
        grade: { ...defaultMode },
        school: { ...defaultMode },
    };
    const { register, reset, handleSubmit, control } = useForm();
    const [open, setOpen] = useState(false);
    const [post, setPost] = useState(false);
    const [id, setId] = useState(0);
    const onPutStudent = async (id) => {
        const student = await getAluno(id);
        setPost(false);
        setId(id);
        setOpen(true);
        reset({ ...student });
    };
    const PostAluno = () => {
        const queries = useQueries({
            queries: [
                {
                    queryFn: escolas,
                    queryKey: ["schools"]
                },
                {
                    queryFn: getTurmas,
                    queryKey: ["class"]
                },
            ]
        });
        const escolasOpts = queries[0].data?.map(e => ({ label: e.name, value: e.id }));
        const turmasOpts = queries[1].data?.map(e => ({ label: e.name, value: e.id }));
        const send = (data) => {
            if (post)
                postAlunos(data);
            else
                putAlunos(data, id);
        };
        const onDelete = (id) => {
            deleteAluno(id);
        };
        return <Dialog className="w-1/2" visible={open} onHide={() => { setOpen(false); }}>
            <div className="p-4">
                <h2>
                    Novo aluno
                </h2>
                <form action="" className="mt-4" onSubmit={handleSubmit(send)}>
                    <div className="flex flex-col mt-4">
                        <label className="mb-2">Nome do aluno</label>
                        <InputText {...register('name')} className="p-4" placeholder="Insira o nome do aluno"/>
                    </div>
                    <div className="flex flex-col mt-4">
                        <label className="mb-2">Matricula</label>
                        <InputText {...register("registrationNumber")} className="p-4" placeholder="Insira matricula"/>
                    </div>
                    <div className="flex flex-col mt-4">
                        <label className="mb-2">Escola</label>
                        <Controller name="school" control={control} render={({ field }) => (<Select options={escolasOpts} placeholder="selecione a escola" value={escolasOpts?.find(opt => opt.value === field.value) || null} onChange={(val) => field.onChange(val ? val.value : null)}/>)}/>
                    </div>

                    <div className="flex flex-col mt-4 mb-2">
                        <label className="mb-2">Turma</label>
                        <Controller name="classGroup" control={control} render={({ field }) => (<Select options={turmasOpts} placeholder="selecione a turma" value={turmasOpts?.find(opt => opt.value === field.value) || null} onChange={(val) => field.onChange(val ? val.value : null)}/>)}/>
                    </div>
                    <Button>
                        enviar
                    </Button>
                </form>
            </div>
        </Dialog>;
    };
    return <Base>
        <PostAluno />
        <BoxDefault title="Alunos" subtitle="Gerencie os alunos do sistema">
            <div className="flex gap-2">
                <Button>
                    exportar
                </Button>
                <Button onClick={() => {
            setOpen(true);
            setPost(true);
            reset({ classGroup: "", id: 0, name: '', registrationNumber: 0, school: '' });
        }}>
                    novo aluno
                </Button>
            </div>
        </BoxDefault>
        {isSuccess ? <Table title="Alunos" filterInputs={filters} isAct rows={data ?? []} editCallbacks={onPutStudent} deleteCallbacks={deleteAluno}/> : <LayerLoad />}
    </Base>;
}
export default Alunos;
