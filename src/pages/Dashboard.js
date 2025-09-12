import Base from "../BaseComponent";
import BoxDefault from "../components/BoxDefault";
import Select from "react-select";
import { Button } from "../components/Button";
import { FaBookReader } from "react-icons/fa";
import { FaBrain } from "react-icons/fa";
import { useQueries } from "@tanstack/react-query";
import { getRegioes } from "../api/api-regions";
import { getGruposById } from "../api/api-groups";
import { useEffect, useState } from "react";
import { escolasById } from "../api/api-escolas";
import { getEventos } from "../api/api-eventos";
import { Controller, useForm } from "react-hook-form";
import { FaTachometerAlt } from "react-icons/fa";
import { MdCheck, MdGroups, MdPercent } from "react-icons/md";
import Pizza from "../components/graficos/Pizza";
import { getDashboardAnalytics, getPerformanceByGrade, getReadingLevelEvolution, getYearlyProgression } from "../api/api-dashboard";
import MultiLineChart, { LineGraph } from "../components/graficos/Linear";
import { YearlyBarChart } from "../components/graficos/Bar";
function Dashboard() {
    const [ids, setIds] = useState({
        regions: 0,
        grupos: 0,
        escolas: 0,
        ano: "",
        avaliacao: 0,
        evento: 0
    });
    const { handleSubmit, control } = useForm();
    const [cards, setCards] = useState({
        averagePpm: 0,
        assessmentCompletion: 0,
        comprehensionScore: 0,
        participationRate: 0,
        studentsAssessed: 0,
        totalStudents: 0,
        readingLevelDistribution: []
    });
    const date = new Date();
    const [levelProgress, setLevelProgress] = useState();
    const [yearly, setYearly] = useState({
        yearly: {
            currentYear: {
                total: 0,
                year: date.getFullYear()
            },
            previousYear: {
                total: 0,
                year: date.getFullYear() - 1
            }
        }
    });
    const [lineProgress, setLineProgress] = useState({
        distribution: [],
        eventId: 0,
        eventName: ""
    });
    const optSeries = ["1 ANO", "2 ANO", "3 ANO", "4 ANO", "5 ANO", "6 ANO", "7 ANO", "8 ANO", "9 ANO"];
    const queries = useQueries({
        queries: [
            {
                queryFn: getRegioes,
                queryKey: ["regions"]
            },
            {
                queryFn: async () => getGruposById(ids.regions),
                queryKey: ["groups"]
            },
            {
                queryFn: async () => escolasById(ids.regions, ids.grupos),
                queryKey: ["schools"]
            },
            {
                queryFn: getEventos,
                queryKey: ["events"]
            },
        ]
    });
    const sendForm = async (data) => {
        const [cardsApi, multiLineLevel, barYearly, lineGrade] = await Promise.all([
            getDashboardAnalytics(data),
            getReadingLevelEvolution(data),
            getYearlyProgression(data),
            getPerformanceByGrade(data)
        ]);
        setCards({ ...cardsApi });
        setLevelProgress(lineGrade.gradePerformance);
        setYearly({ ...barYearly });
        setLineProgress(multiLineLevel.evolution[0]);
    };
    const loadData = async () => {
        const [cardsApi, multiLineLevel, barYearly, lineGrade] = await Promise.all([
            getDashboardAnalytics({}),
            getReadingLevelEvolution({}),
            getYearlyProgression({}),
            getPerformanceByGrade({})
        ]);
        setCards({ ...cardsApi });
        setLevelProgress(lineGrade.gradePerformance);
        setYearly({ ...barYearly });
        setLineProgress(multiLineLevel.evolution[0]);
    };
    useEffect(() => {
        loadData();
    }, []);
    useEffect(() => {
        refetchAll();
        console.log(levelProgress);
    }, [ids]);
    const refetchAll = () => {
        queries.forEach(result => result.refetch());
    };
    const Card = (props) => {
        return <div className={`flex items-center flex-basis-full px-2 py-2 gap-x-3 c-white ${props.color} gap-7 shadow-lg rounded-md `}>
            <div>
                <div className={` rounded-full p-2`}>
                    {props.icon}
                </div>
            </div>
            <div>
                <h6 className=" text-nowrap ">{props.text}</h6>
                <b className="text-lg-1 ">{props.value}{props.isPercent ? "%" : ''}</b>
            </div>
        </div>;
    };
    const regions = queries[0].data?.map(e => ({ label: e.name, value: e.id }));
    const groups = queries[1].data?.map(e => ({ label: e.name, value: e.id }));
    const schools = queries[2].data?.map(e => ({ label: e.name, value: e.id }));
    const events = queries[3].data?.map(e => ({ label: e.name, value: e.id }));
    const yearSchool = optSeries?.map(e => ({ label: e, value: e }));
    const PieData = cards.readingLevelDistribution.map(e => e.count);
    const PieLabels = cards.readingLevelDistribution.map(e => e.name);
    const multiLineLabels = lineProgress.distribution.map(e => e.name);
    const multiLineData = lineProgress.distribution.map(e => e.percentage);
    // const multiLineData = 
    // const BaseGraph = (props: PropsWithChildren) => <section className="bg-white shadow-lg p-8">{props.children}</section>
    return <Base>
        <BoxDefault title="Dashboard de Avaliações" subtitle="Visualize e analise os dados das avaliações de leitura">
        </BoxDefault>
        <section>
            <header className="p-4 bg-white shadow-md rounded-lg mt-4">
                <form action="" className="grid gap-x-2 gap-y-3 cols-3" onSubmit={handleSubmit(sendForm)}>
                    <div>
                        <label className="c-blue-950 font-bold">Regiões</label>
                        <Controller name="regionId" control={control} render={({ field }) => (<Select className="mt-2" placeholder="selecione a região" options={regions ?? []} value={(regions ?? []).find((opt) => opt.value === field.value) || null} onChange={(inp) => {
                field.onChange(inp?.value ?? null);
                setIds((e) => ({ ...e, regions: inp?.value ?? 0 }));
            }}/>)}/>
                    </div>

                    {/* Grupos */}
                    <div>
                        <label className="c-blue-950 font-bold">Grupos</label>
                        <Controller name="groupId" control={control} render={({ field }) => (<Select className="mt-2" placeholder="selecione o grupo" options={groups ?? []} value={(groups ?? []).find((opt) => opt.value === field.value) || null} onChange={(inp) => {
                field.onChange(inp?.value ?? null);
                setIds((e) => ({ ...e, groups: inp?.value ?? 0 }));
            }}/>)}/>
                    </div>

                    {/* Escolas */}
                    <div>
                        <label className="c-blue-950 font-bold">Escolas</label>
                        <Controller name="schoolId" control={control} render={({ field }) => (<Select className="mt-2" placeholder="selecione a escola" options={schools ?? []} value={(schools ?? []).find((opt) => opt.value === field.value) || null} onChange={(inp) => {
                field.onChange(inp?.value ?? null);
                setIds((e) => ({ ...e, escolas: inp?.value ?? 0 }));
            }}/>)}/>
                    </div>

                    {/* Ano Escolar */}
                    <div>
                        <label className="c-blue-950 font-bold">Ano Escolar</label>
                        <Controller name="grade" control={control} render={({ field }) => (<Select className="mt-2" placeholder="selecione o ano" options={yearSchool ?? []} value={(yearSchool ?? []).find((opt) => opt.value === field.value) || null} onChange={(inp) => {
                field.onChange(inp?.value ?? "1 ANO");
                setIds((e) => ({ ...e, ano: inp?.value ?? "1 ANO" }));
            }}/>)}/>
                    </div>



                    {/* Eventos de Avaliação */}
                    <div>
                        <label className="c-blue-950 font-bold">Eventos de avaliações</label>
                        <Controller name="assessmentEventId" control={control} render={({ field }) => (<Select className="mt-2" placeholder="selecione o evento" options={events ?? []} value={(events ?? []).find((opt) => opt.value === field.value) || null} onChange={(inp) => {
                field.onChange(inp?.value ?? null);
                setIds((e) => ({ ...e, grupos: inp?.value ?? 0 }));
            }}/>)}/>
                    </div>
                    <Button>
                        Enviar
                    </Button>
                </form>
            </header>
        </section>
        <main>
            {/* cards */}
            <section className="flex gap-2 mt-4">
                <Card icon={<MdGroups className="text-white opacity-80" size={24}/>} text="Total de Alunos" color="bg-blue" value={cards.totalStudents}/>
                <Card icon={<MdCheck className="text-white opacity-80" size={24}/>} text="Avaliações concluídas" color="bg-blue" value={cards.assessmentCompletion}/>
                <Card icon={<FaTachometerAlt className="text-white opacity-80" size={24}/>} text="Alunos Avaliados" color="bg-green" value={cards.studentsAssessed}/>
                <Card icon={<MdPercent className="text-white opacity-80" size={24}/>} text="Taxa de Participação" color="bg-yellow" isPercent value={cards.participationRate}/>
                <Card icon={<FaBookReader className="text-white opacity-80" size={24}/>} text="PPM Médio" color="bg-blue" isPercent value={cards.averagePpm}/>
                <Card icon={<FaBrain className="text-white opacity-80" size={24}/>} text="Compreensão" color="bg-purple" isPercent value={cards.comprehensionScore}/>
            </section>
            <section className="grid gap-4 cols-5 rows-2 mt-4">
                <section className="col-span-2 p-4 shadow-xl rounded-lg">
                    <Pizza title="Distribuição por Nível de Leitura" data={{ labels: PieLabels, values: PieData }}/>
                </section>
                <section className="p-4 shadow-xl col-span-3  rounded-lg">
                    <LineGraph data={multiLineData ?? []} labels={multiLineLabels ?? []}/>
                </section>
                <section className="col-span-3 p-4 shadow-xl  rounded-lg">
                    <MultiLineChart data={levelProgress ?? []}/>
                </section>
                <section className="p-4 shadow-xl col-span-2 rounded-lg">
                    <YearlyBarChart {...yearly}/>
                </section>
            </section>
        </main>
    </Base>;
}
export default Dashboard;
