import { useQueries } from "@tanstack/react-query";
import Base from "../BaseComponent";
import BoxDefault from "../components/BoxDefault";
import Table, { type FiltersColumn } from "../components/Tables";
import { getRankingStudents } from "../api/api-ranking";
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
                queryFn: async () => getRankingStudents(),
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
        "grade": { ...defaultMode },
        "readingLevel": { ...defaultMode },
    }

    const [ranking] = queries
    const rows = ranking.data?.map(e => ({ name: e.student, school: e.school, grade: (removerGrau(e.grade)), readingLevel: e.readingLevel }))
    function removerGrau(texto: string): string {
        if (!texto)
            return texto
        return texto.replace(/[°º]/g, "");
    }
    const levels = [
        "NOT_EVALUATED",
        "NON_READER",
        "SYLLABLE_READER",
        "WORD_READER",
        "SENTENCE_READER",
        "TEXT_READER_WITHOUT_FLUENCY",
        "TEXT_READER_WITH_FLUENCY"
    ]
    const niveisLeitores = {
        NOT_EVALUATED: 'Não avaliado',
        NON_READER: 'Não leitor',
        SYLLABLE_READER: 'Leitor de sílabas',
        WORD_READER: 'Leitor de palavras',
        SENTENCE_READER: 'Leitor de frases',
        TEXT_READER_WITHOUT_FLUENCY: 'Leitor de texto sem fluência',
        TEXT_READER_WITH_FLUENCY: 'Leitor de texto com fluência'
    }
    const optSeries = ["1 ANO", "2 ANO", "3 ANO", "4 ANO", "5 ANO", "6 ANO", "7 ANO", "8 ANO", "9 ANO"]

    const inputValues: { label: string, value: string }[] = levels.map(e => ({ label: niveisLeitores[e], value: e }))
    return <Base>
        <BoxDefault title="Ranking de alunos" />
        {
            ranking.isSuccess ? <Table
                title="Alunos"
                options={[optSeries, inputValues]}
                filterDrops={filterDrops}
                // filterInputs={filterInput}
                rows={rows ?? []}
                editCallbacks={() => { }}
                deleteCallbacks={() => { }}
            /> : <LayerLoad />
        }

    </Base>
}
export default RankingDeAlunos