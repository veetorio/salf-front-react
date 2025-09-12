import { useQueries } from "@tanstack/react-query";
import Base from "../BaseComponent";
import BoxDefault from "../components/BoxDefault";
import Table, { type FiltersColumn } from "../components/Tables";
import {  getRankingStudents } from "../api/api-ranking";
import { defaultMode } from "../config/api-config";
import { getRegioes } from "../api/api-regions";
import { getGrupos } from "../api/api-groups";
import { ProgressSpinner } from "primereact/progressspinner";
export interface StudentData {
    studentId: number;
    student: string;
    readingLevel: string; // se tiver um enum de níveis, pode tipar melhor
    eventId: number;
    regionId: number;
    groupId: number;
    schoolId: number;
    school: string;
    region: string;
    group: string;
}
export const LayerLoad = () => <section className="w-full h-[80vh] flex justify-center items-center bg-white shadow-md mt-4">
    <div className="flex flex-col justify-center items-center">
        <ProgressSpinner />
        <h3 className="text-gray mt-3">Carregando tabela...</h3>
    </div>
</section>

function RankingDeAlunos() {

    const queries = useQueries({
        queries: [
            {
                queryFn: async () =>  getRankingStudents() ,
                queryKey: ["ranking"]
            },
            {
                queryKey: ["regions"],
                queryFn: getRegioes
            },
            {
                queryKey: ["groups"],
                queryFn: getGrupos
            },
        ]
    })
    const filterDrops: FiltersColumn = {
        "region": { ...defaultMode },
        "group": { ...defaultMode },
    }
    const filterInput: FiltersColumn = {
        "school": { ...defaultMode },
    }
    const [ranking, groups, regions] = queries
    const regionsMap = regions.data?.map(e => e.name)
    const groupsMap = groups.data?.map(e => e.name)
    const rows = ranking.data?.map(e => ({ name: e.student, school: e.school, region: e.region, group: e.group, readingLevel: e.readingLevel }))

    return <Base>
        <BoxDefault title="Ranking de alunos" />
        {
            ranking.isSuccess ? <Table
                title="Alunos"
                options={[regionsMap ?? [], groupsMap ?? []]}
                filterDrops={filterDrops}
                filterInputs={filterInput}
                rows={rows ?? []}
                editCallbacks={() => { }}
                deleteCallbacks={() => { }}
            /> : <LayerLoad/>
        }

    </Base>
}
export default RankingDeAlunos