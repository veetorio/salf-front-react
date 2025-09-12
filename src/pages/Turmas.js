import Base from "../BaseComponent";
import Table, {} from "../components/Tables";
import BoxDefault from "../components/BoxDefault";
import { Button } from "../components/Button";
import { defaultMode } from "../config/api-config";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import { deleteTurma, getTurma, getTurmas, postTurmas, putTurmas } from "../api/api-turmas";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { escolas } from "../api/api-escolas";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
function Turmas() {
    const [open, setOpen] = useState(false);
    const [post, setPost] = useState(true);
    const [id, setId] = useState(0);
    const { data, isSuccess } = useQuery({
        queryKey: ['turmas'],
        queryFn: getTurmas
    });
    const filters = {
        name: { ...defaultMode },
        grade: { ...defaultMode },
        turn: { ...defaultMode },
        school: { ...defaultMode },
        group: { ...defaultMode }
    };
    const optSeries = ["1 ANO", "2 ANO", "3 ANO", "4 ANO", "5 ANO", "6 ANO", "7 ANO", "8 ANO", "9 ANO"];
    const optTurn = ["MATUTINO", "VESPERTINO", "NOTURNO", "INTEGRAL"];
    const { register, handleSubmit, control, reset } = useForm();
    const PostTurmas = () => {
        const queries = useQuery({
            queryFn: escolas,
            queryKey: [""]
        });
        const schools = queries.data?.map(e => ({ label: e.name, value: e.id }));
        const sendClass = (data) => {
            if (post)
                postTurmas(data);
            else
                putTurmas(data, id);
        };
        return <Dialog className="w-1/2" onHide={() => { setOpen(false); }} visible={open}>
            <div className="p-4">
                <h2>Nova Turma</h2>
                <form action="" className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit(sendClass)}>
                    <div className="flex flex-col">
                        <label className="">Nome da turma</label>
                        <InputText {...register("name")} placeholder="Ex : turma 1°" className="p-4"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="">Escola</label>
                        <Controller name="schoolId" // melhor usar schoolId já que vai salvar o id
         control={control} render={({ field }) => (<Select {...field} options={schools} value={schools?.find((s) => s.value === field.value) || null} 
            // pega o objeto correto baseado no id salvo no RHF
            onChange={(selected) => field.onChange(selected?.value)} 
            // salva só o "id" no form
            placeholder="Escolha a escola"/>)}/>
                    </div>
                    <div className="flex flex-col">
                        <label className="">Série</label>
                        <Controller name="grade" control={control} render={({ field }) => (<Dropdown value={field.value} onChange={(e) => field.onChange(e.value)} options={optSeries} placeholder="Selecione uma série" className="p-4" panelClassName="p-4 mt-1"/>)}/>
                    </div>
                    <div className="flex flex-col">
                        <label className="">Turno</label>
                        <Controller name="turn" control={control} render={({ field }) => (<Dropdown value={field.value} onChange={(e) => field.onChange(e.value)} options={optTurn} placeholder="Selecione um turno" className="p-4" panelClassName="p-4 mt-1"/>)}/>
                    </div>
                    <Button>
                        enviar
                    </Button>
                </form>
            </div>
        </Dialog>;
    };
    const onUpdate = async (id) => {
        setOpen(true);
        setPost(false);
        setId(id);
        const response = await getTurma(id);
        reset(response);
    };
    const onDelete = async (id) => {
        deleteTurma(id);
    };
    return <Base>
        <PostTurmas />
        <BoxDefault subtitle="Gerencie as turmas do sistema" title="Turmas">
            <Button onClick={() => {
            setOpen(true);
            setPost(true);
            reset({ grade: '', name: '', schoolId: 0, turn: 'MATUTINO' });
        }}>
                nova turma
            </Button>
        </BoxDefault>
        {isSuccess && <Table rows={data ?? []} title={"Turmas"} isAct filterInputs={filters} editCallbacks={onUpdate} deleteCallbacks={onDelete}/>}
    </Base>;
}
export default Turmas;
