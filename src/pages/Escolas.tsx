import Base from "../BaseComponent"
import Table, { type FiltersColumn } from "../components/Tables"
import BoxDefault from "../components/BoxDefault";
import { Button } from "../components/Button";
import { defaultMode } from "../config/api-config";
import { useQueries, useQuery } from "@tanstack/react-query";
import { deleteEscola, escola, escolas, Mockschools, postEscola, putEscola, type School } from "../api/api-escolas";
import { getRegioes } from "../api/api-regions";
import { getGrupos } from "../api/api-groups";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";


function Escolas() {

    const { data } = useQuery<School[]>({
        queryKey: ["escolas"],
        queryFn: escolas,
        enabled: true
    })
    const queries = useQueries({
        queries: [
            {
                queryFn: getRegioes,
                queryKey: ["regions"]
            },
            {
                queryFn: getGrupos,
                queryKey: ["groups"]
            },
        ]
    })



    const filters: FiltersColumn = {
        "name": { ...defaultMode }
    }
    const filterDrops: FiltersColumn = {
        "region": { ...defaultMode },
        "group": { ...defaultMode }
    }


    const gruposGlobal = queries[0].data?.map(e => e.name)
    const regionsGlobal = queries[0].data?.map(e => e.name)

    const [open, setOpen] = useState(false)
    const [post, setPost] = useState(false)
    const [id, setId] = useState(0)
    const { register, handleSubmit, control, reset } = useForm<{ name: string, regioId: number, groupId: number }>()
    const onDelete = (id: number) => {
        deleteEscola(id)
    }
    const onPutSchool = async (id: number) => {
        const escolaResponse = await escola(id)
        setPost(false)
        setId(id)
        setOpen(true)
        reset({ ...escolaResponse })

    }
    const PostEscola = () => {
        const SendSubmit = (data: { name: string, regioId: number, groupId: number }) => {
            if (post) postEscola(data)
            else putEscola(data, id)
        }
        const grupos = queries[1].data?.map(e => ({ label: e.name, value: e.id }))
        const regions = queries[0].data?.map(e => ({ label: e.name, value: e.id }))

        return <Dialog className="w-1/2" visible={open} onHide={() => setOpen(false)}>
            <div className="p-4">
                <h1 className="mb-4">Nova escola</h1>
                <form className="flex flex-col" action="" onSubmit={handleSubmit(SendSubmit)}>
                    {/* Nome */}
                    <div className="flex flex-col gap-2 mt-2">
                        <label>Nome da escola</label>
                        <InputText
                            {...register("name")}
                            className="p-4 mt-1"
                            placeholder="Ex: Escola 123"
                        />
                    </div>

                    {/* Região */}
                    <div className="flex flex-col gap-2 mt-2">
                        <label>Região</label>
                        <Controller
                            name="regionId"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.value)}
                                    options={regions}
                                    placeholder="Escolha a região"
                                    className="p-4 mt-1"
                                    panelClassName="p-3"
                                />
                            )}
                        />
                    </div>

                    {/* Grupo */}
                    <div className="flex flex-col gap-2 mt-2 mb-2">
                        <label>Grupo</label>
                        <Controller
                            name="groupId"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.value)}
                                    options={grupos}
                                    placeholder="Escolha o grupo"
                                    className="p-4 mt-1"
                                    panelClassName="p-3"
                                />
                            )}
                        />
                    </div>

                    <Button>
                        Enviar
                    </Button>
                </form>
            </div>
        </Dialog>
    }
    return <Base>
        <PostEscola />
        <BoxDefault title="Escolas" subtitle="Gerencie as escolas do sistema">
            <Button onClick={() => {
                setPost(true)
                reset({ name: "", groupId: 0, regioId: 0 })
                setOpen(true)
            }}>
                criar nova escola
            </Button>
        </BoxDefault>
        <Table
            isAct={true}
            rows={data ?? Mockschools}
            filterInputs={filters}
            filterDrops={filterDrops}
            deleteCallbacks={onDelete}
            editCallbacks={onPutSchool}
            options={[regionsGlobal ?? [], gruposGlobal ?? []]}
            title="Lista de Escolas"

        />
    </Base>

}

export default Escolas