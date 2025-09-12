// import { useQuery } from "@tanstack/react-query";
import Base from "../BaseComponent"
import BoxDefault from "../components/BoxDefault"
import { Button, ButtonSecundary } from "../components/Button"
import Table, { type FiltersColumn } from "../components/Tables"
// import { getUsuarios } from "../config/api-usuarios";
// import { useEffect, useState } from "react";
import { defaultMode } from "../config/api-config";
import { deleteUsuarios, getUsuarios, postUsuarios, updateUsuarios } from "../api/api-usuarios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MdAdd, MdSend } from "react-icons/md";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
export interface UserPost {
    name: string;
    email: string;
    role: string;
    password?: string
}
export interface User extends UserPost {
    id: number;
}
type postInfo = {
    name: string,
    password: string,
    replyPassword: string,
    email: string,
    role: string,
}
function Usuarios() {
    const { data } = useQuery<User[]>(
        {
            queryKey: ["usuarios"],
            queryFn: async () => {
                return toast.promise(
                    async () => await getUsuarios(),
                    {
                        success: "dados carregados",
                        pending: "carregando ...",
                        error: "não foi possivel carregar usuarios"
                    }
                )
            },
            staleTime: 5 * 60
        }
    )


    const defaultValues = {
        email: '',
        name: '',
        password: '',
        role: ''
    }
    const [requestBody, setRequestBody] = useState<UserPost>({ ...defaultValues })
    const [postView, setPostView] = useState(false)
    const [isPost, setPost] = useState(false)
    const mutPost = useMutation({
        mutationKey: ['postUsuarios'],
        mutationFn: async (body: UserPost) => postUsuarios(body)
    })
    const mutDelete = useMutation({
        mutationKey: ['deleteUsuarios'],
        mutationFn: async (id: number) => {

            toast.promise(
                deleteUsuarios(id), {
                success: "este usuario foi apagado",
                pending: "apagando este usuario",
                error: "não foi possivel apagar usuario",
            }

            )
        }
    })
    const mutUpdate = useMutation({
        mutationKey: ['updateUsuarios'],
        mutationFn: async (id: number) => {
            const body = data?.filter(e => e.id == id)[0]
            setPost(false)
            setPostView(true)
            setRequestBody({ ...body } as UserPost)
        }
    })

    const sendForm = async (data?: postInfo) => {
        if ((data?.password != data?.replyPassword) || (data?.password === "") || (data?.replyPassword === ""))
            toast.error("senhas estão diferentes")
        else {
            const body: UserPost = {
                name: data?.name || '',
                email: data?.email || '',
                password: data?.password || '',
                role: data?.role || ''
            }
            if (isPost) {
                await toast.promise(() => mutPost.mutateAsync(body), {
                    success: "usuario criado.",
                    error: "não foi possivel criar usuario.",
                    pending: "criando ..."
                }
                )
            } else {
                await toast.promise(
                    updateUsuarios((requestBody as User).id, data || {
                        email: '',
                        name: '',
                        password: '',
                        role: ''
                    })
                    , 
                    {
                        success : "atualizado com sucesso",
                        pending : "atualizando ...",
                        error : "não foi possivel atualizar item"
                    }
                )
            }
        }
    }
    const inputsFilter: FiltersColumn = {
        "name": { ...defaultMode },
        "email": { ...defaultMode }
    }
    const dropsFilter: FiltersColumn = {
        "role": { ...defaultMode }
    }
    const roles = [
        { value: "ADMIN", label: "Administrador" },
        { value: "COORDINATOR", label: "Coordenador" },
        { value: "MANAGER", label: "Gestor Escolar" },
        { value: "APPLICATOR", label: "Aplicador" },
    ]
    const Form = () => {
        const { register, handleSubmit, control } = useForm<postInfo>(
            {
                defaultValues: { ...requestBody }
            }
        )
        return <Dialog visible={postView} onHide={() => (setPostView(false))} closeOnEscape>
            <div className="px-8">
                <h2 className="c-blue-950">Cadastrar Novo Usuário</h2>
                <h5>Preencha os dados abaixo para cadastrar um novo usuário no sistema.</h5>
                <main className="px-2 py-8">
                    <form onSubmit={handleSubmit(sendForm)} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="">nome</label>
                                <InputText {...register("name")} className="p-2" placeholder="" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="">email</label>
                                <InputText {...register("email")} type="email" className="p-2" placeholder="" />
                            </div>
                            {
                                isPost && <>
                                    <div className="flex flex-col">
                                        <label htmlFor="">senha</label>
                                        <InputText {...register("password")} className="p-2" placeholder="" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="">confirmar senha</label>
                                        <InputText {...register("replyPassword")} className="p-2" placeholder="" />
                                    </div>
                                </>
                            }
                            <div className="flex flex-col">
                                <label htmlFor="">tipo de usuario</label>
                                <Controller
                                    name="role"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) =>
                                        <Dropdown
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => { field.onChange(e.value) }}
                                            options={roles} optionValue="value"
                                            optionLabel="label" panelClassName="p-4"
                                            className="p-2" placeholder="selecione" />} />
                            </div>
                        </div>
                        <div className=" bg-blue-1 rounded p-4">
                            <div>
                                <h4 className="c-blue-7">Informações sobre os tipos de usuário:</h4>
                                <li className="text-sm c-blue-7"> <b>Administrador</b>  : Acesso completo a todas as funcionalidades</li>
                                <li className="text-sm c-blue-7"> <b>Secretária</b> : Gerencia escolas, turmas, alunos, visualiza relatórios e dashboards com estatísticas</li>
                                <li className="text-sm c-blue-7"> <b>Aplicador</b>: Realiza avaliações de leitura com os alunos</li>
                                <li className="text-sm c-blue-7"> <b>Gestor Escolar</b>: Visualiza relatórios e dashboards com estatísticas</li>
                            </div>
                        </div>
                        <ButtonSecundary>
                            <MdSend />
                            enviar
                        </ButtonSecundary>
                    </form>
                </main>
            </div>
        </Dialog>
    }
    return <Base>
        <BoxDefault title="Usuarios" subtitle="Gerencie os usuários do sistema">
            <Button onClick={() => {
                setRequestBody({ ...defaultValues })
                setPost(true)
                setPostView(true)

            }}>
                <div className="flex items-center gap-4">
                    <MdAdd size={24} />
                    criar usuario
                </div>
            </Button>
        </BoxDefault>
        <Form />
        <Table title="Lista de Usuários"
            rows={data ?? [{ name: '', email: '', id: 0, role: '' }]}
            filterInputs={inputsFilter}
            filterDrops={dropsFilter}
            isAct={true}
            options={[["ADMIN", "COORDINATOR", "MANAGER", "APPLICATOR"]]}
            deleteCallbacks={mutDelete.mutate}
            editCallbacks={mutUpdate.mutate}
        />
    </Base>
}

export default Usuarios