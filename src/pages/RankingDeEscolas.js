import { useQueries } from "@tanstack/react-query";
import Base from "../BaseComponent";
import BoxDefault from "../components/BoxDefault";
import Table, {} from "../components/Tables";
import { getRankingRegions, getRankingSchools } from "../api/api-ranking";
import { defaultMode } from "../config/api-config";
import { getRegioes } from "../api/api-regions";
import { getGrupos } from "../api/api-groups";
import { BarChartCommon } from "../components/graficos/Bar";
import { LayerLoad } from "./RankingDeALunos";
function RankingDeEscolas() {
    const queries = useQueries({
        queries: [
            {
                queryFn: getRankingSchools,
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
            {
                queryKey: ["ranking-regions"],
                queryFn: getRankingRegions
            },
        ]
    });
    const filterInput = {
        "school": { ...defaultMode },
    };
    const [ranking, groups, regions, rankingRegions] = queries;
    const regionsMap = regions.data?.map(e => e.name);
    const groupsMap = groups.data?.map(e => e.name);
    const rows = ranking.data?.map(e => ({ school: e.school, count: e.count })).sort((a, b) => a.count - b.count).reverse();
    const regionsRankingLabel = rankingRegions.data?.map(e => e.region);
    const regionsRankingData = rankingRegions.data?.map(e => e.percentage);
    return <Base>
        <BoxDefault title="Ranking de Escolas"/>
        <main className="p-4">
            <div>
                {ranking.isSuccess ? <Table title="Escolas" options={[regionsMap ?? [], groupsMap ?? []]} filterInputs={filterInput} rows={rows ?? []} editCallbacks={() => { }} deleteCallbacks={() => { }}/> : <LayerLoad />}

            </div>
            <section className="p-7 mt-5 shadow-2xl">
                <BarChartCommon labels={regionsRankingLabel ?? []} values={regionsRankingData ?? []}/>
            </section>
        </main>
    </Base>;
}
export default RankingDeEscolas;
