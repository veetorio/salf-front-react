import Base from "../BaseComponent";
import BoxDefault from "../components/BoxDefault";
import { useQuery } from "@tanstack/react-query";
import Search from "../components/SelectSearch";
import { Button } from "../components/Button";
import { useEffect } from "react";
import { escolas } from "../config/Escolas";
import { storeLogin } from "../contexts/login";

interface Region {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

interface Group {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

interface DataItem {
    id: number;
    name: string;
    regionId: number;
    groupId: number;
    region: Region;
    group: Group;
    totalClasses: number;
    totalStudents: number;
    createdAt: string;
    updatedAt: string;
}

export interface Meta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ResponseType {
    data: DataItem[];
    meta: Meta;
}

const formatInput = (_: DataItem) => ({ value: _.id, label: _.name })

function Realizar() {

    const { data } = useQuery<ResponseType>({
        queryKey : ["schools"],
        queryFn : escolas,
        enabled : !(storeLogin().user?.token ?? JSON.parse(localStorage.getItem("user") || "")) 
    })

    useEffect(() => {
        (
            async function () {
                console.log(await escolas())
            }
        )()
    },[])


    const option: { value: number, label: string }[] = data?.data.map(formatInput) ?? []

    return <Base>
        <BoxDefault
            title="Realizar Avaliação de Leitura"
            subtitle="Avalie a fluência de leitura em três etapas">
        </BoxDefault>
        <BoxDefault title="Selecione a Avaliação">
            <form action="" className=" mt-4 flex flex-wrap gap-x-12 gap-y-2">
                <Search option={option} label="escola"/>
                <Search option={option} label="turma"/>
                <Search option={option} label="aluno"/>
                <Search option={option} label="avaliação"/>
                <Search option={option} label="teste de leitura"/>
                <Button>
                    iniciar avaliação
                </Button>
            </form>
        </BoxDefault>
        <main>
            {/* etapas */}
            <section>1</section>
            <section>2</section>
            <section>3</section>
            <section>4</section>
            <section>5</section>
        </main>
    </Base>
}
export default Realizar