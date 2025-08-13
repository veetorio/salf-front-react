import Base from "../BaseComponent";
import BoxDefault from "../components/BoxDefault";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import Select from "react-select"
import { Button, ButtonSecundary, ButtonTerciary } from "../components/Button";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { escolas } from "../api/api-escolas";
import { Timer } from "../components/Timer";
import { useEffect, useRef, useState } from "react";
import { MdArrowLeft, MdArrowRight, MdCheck } from "react-icons/md";
import { getTurmasBySchoolId } from "../api/api-turmas";
import { getAlunosBySchoolIdAndClassId } from "../api/api-alunos";
import { getAvaliacoes } from "../api/api-avaliacoes";
import { getEventos } from "../api/api-eventos";
import { getRealizarAvaliacao, postRealizarAvaliacao } from "../api/api-realizar";
import { data } from "react-router-dom";

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

    const [states, setStates] = useState({
        school: 0,
        classSchool: 0,
        student: 0,
        assements: 0,
        events: 0
    })
    const [steps, setSteps] = useState<{ nameStep: string, data: string[], sizeData: number, currentData: number }[]>(
        [
            {
                nameStep: "palavras",
                data: [],
                sizeData: 0,
                currentData: 0,
            },
            {
                nameStep: "pseudo-palavras",
                data: [],
                sizeData: 0,
                currentData: 0,

            },
            {
                nameStep: "frases",
                data: [],
                sizeData: 0,
                currentData: 0,
            },
            {
                nameStep: "texto",
                data: [],
                sizeData: 0,
                currentData: 0
            },
            {
                nameStep: "questões",
                data: [],
                currentData: 0,
                sizeData: 0
            },
        ]
    )
    const mut = useMutation(
        {
            mutationKey: ['realizar'],
            mutationFn: () => postRealizarAvaliacao({ studentId: states.student, assessmentEventId: states.events, assessmentId: states.assements })
        }
    )
    const mutRealizar = useMutation({
        mutationKey: ["avaliacao"],
        mutationFn: async (id: number) => {

            const response = await getRealizarAvaliacao(id)
            setSteps(e =>
                e.map(step => {
                    switch (step.nameStep) {
                        case "palavras":
                            return { ...step, data: response.words }
                        case "pseudo-palavras":
                            return { ...step, data: response.pseudowords }
                        case "frases":
                            return { ...step, data: response.phrases.map(e => e.text) }
                        case "texto":
                            return { ...step, data: response.text.split(/\n(?=[\s\S]*\n)/g) }
                        default:
                            return step
                    }


                }
                )
            );
        }
    })


    const queries = useQueries(
        {
            queries: [
                {
                    queryKey: ["escolas"],
                    queryFn: escolas,
                    refetchOnWindowFocus: false
                },
                {
                    queryKey: ["turma"],
                    queryFn: () => (getTurmasBySchoolId(states.school)),
                    enabled: states.school != 0,
                    refetchOnWindowFocus: false
                },
                {
                    queryKey: ["aluno"],
                    queryFn: () => (getAlunosBySchoolIdAndClassId(states.school, states.classSchool)),
                    enabled: states.classSchool != 0,
                },
                {
                    queryKey: ["avaliações"],
                    queryFn: getAvaliacoes,
                    refetchOnWindowFocus: false
                },
                {
                    queryKey: ["eventos"],
                    queryFn: getEventos,
                    refetchOnWindowFocus: false
                },
            ]
        }
    )
    useEffect(() => {
        if (states.school) queries[1].refetch()
    }, [queries, states.school])
    useEffect(() => {
        if (states.classSchool) queries[2].refetch()
    }, [queries, states.classSchool])



    const OptionSelect = ({ value, index }: { value: string, index: number }) => {
        const [toggle, setToggle] = useState(false);

        return (
            <div
                aria-pressed={toggle}
                className={`p-2 text-white rounded-md hover:opacity-50 cursor-pointer 
                ${toggle ? "bg-green-500" : "bg-blue-500"}`}
                onClick={() => {
                    setToggle(prev => !prev);

                    setSteps(steps =>
                        steps.map((step, i) =>
                            i === index
                                ? {
                                    ...step,
                                    currentData: step.currentData + (toggle ? -1 : 1)
                                }
                                : step
                        )
                    );
                }}
            >
                {value}
            </div>
        );
    };

    const optionSchool: { value: number, label: string }[] = queries[0].data?.map(e => ({ value: e.id, label: e.name })) || []
    const optionClass: { value: number, label: string }[] = queries[1].data?.map(e => ({ value: e.id, label: e.name })) || []
    const optionStudents: { value: number, label: string }[] = queries[2].data?.map(e => ({ value: e.id, label: e.name })) || []
    const optionAssements: { value: number, label: string }[] = queries[3].data?.map(e => ({ value: e.id, label: e.name })) || []
    const optionEvents: { value: number, label: string }[] = queries[4].data?.map(e => ({ value: e.id, label: e.name })) || []
    const steps_element = useRef<Stepper>(null)
    const encerrar = () => {
        steps_element.current?.setActiveStep(5)
    }
    const encerrarNaEtapa = () => {

    }
    return <Base>
        <BoxDefault
            title="Realizar Avaliação de Leitura"
            subtitle="Avalie a fluência de leitura em três etapas">
        </BoxDefault>
        {
            !mut.isSuccess && <section title="Selecione a Avaliação" className="mt-4 w-full px-2 py-9 rounded-xl border border-solid border-gray-2 shadow-md">
                <h1 className="c-blue-950 text-xl">
                    Selecione avaliação
                </h1>
                <form action="" className="grid grid-cols-3 gap-x-2 gap-y-4 mt-4" onSubmit={async (e) => {
                    e.preventDefault()
                    const idresponse = await mut.mutateAsync()
                    mutRealizar.mutate(idresponse)
                }}>
                    <Select
                        placeholder="selecione a escola"
                        className=""
                        options={optionSchool}
                        isLoading={queries[0].isLoading}
                        onChange={(inp) => (setStates((e) => ({ ...e, school: (inp?.value ?? 0) })))}
                    />
                    <Select
                        placeholder="selecione a turma"
                        className="" options={optionClass}
                        isLoading={queries[1].isLoading}
                        onChange={(inp) => (setStates((e) => ({ ...e, classSchool: (inp?.value ?? 0) })))} />
                    <Select
                        placeholder="selecione o estudante"
                        className="" options={optionStudents}
                        isLoading={queries[2].isLoading}
                        onChange={(inp) => (setStates((e) => ({ ...e, student: (inp?.value ?? 0) })))} />
                    <Select
                        placeholder="selecione a avaliação"
                        isLoading={queries[3].isLoading}
                        className="" options={optionAssements}
                        onChange={(inp) => (setStates((e) => ({ ...e, assements: (inp?.value ?? 0) })))} />
                    <Select
                        placeholder="selecione o evento"
                        className="h-fit" options={optionEvents}
                        isLoading={queries[4].isLoading}
                        onChange={(inp) => (setStates((e) => ({ ...e, events: (inp?.value ?? 0) })))} />
                    <Button>
                        iniciar avaliação
                    </Button>
                </form>
            </section>
        }
        <main className="h-full w-full">
            {/* etapas */}
            {
                mut.isSuccess && <Stepper linear ref={steps_element} className="p-4 mt-8 shadow-2xl rounded-xl border border-solid border-gray-2" headerPosition="left" >
                    {

                    }
                    {steps.map((e, _) => {
                        return <StepperPanel header={e.nameStep}>
                            <main className="h-full w-full mt-8">
                                {/* etapas */}
                                <main className="">
                                    <header className="p-4 flex flex-col gap-4">
                                        <div className="w-full flex justify-between">
                                            <h1>Etapa - {e.nameStep}</h1>
                                            <button
                                                onClick={encerrar}
                                                className="p-4 bg-red-6 hover:bg-red text-white">
                                                encerrar
                                            </button>
                                            <Timer max={1 / 4} />
                                        </div>
                                        <p>Instrução: Peça para o aluno ler as {e.nameStep} abaixo em voz alta. Marque as palavras que o aluno conseguir ler corretamente. O tempo máximo para esta atividade é de 1 minuto.</p>
                                        <div className="b-0 b-l-4 h-fit b-solid c-blue-8 b-l-blue h-20 bg-blue-1 p-4">
                                            <h1>Importante :</h1>
                                            <p className="text-sm">As {e.nameStep} só poderão ser marcadas após o início do cronômetro e até o término do tempo. Após 1 minuto, as opções não marcadas serão bloqueadas automaticamente.</p>
                                        </div>
                                    </header>
                                    {
                                        e.nameStep !== "texto" ?
                                            <section className="p-4 grid grid-cols-4 gap-2">
                                                {
                                                    e.data.length != 0 ? e.data.map(e => <OptionSelect value={e} index={_} />)
                                                        :
                                                        <button
                                                            onClick={() => {
                                                                steps_element.current?.nextCallback()
                                                            }}
                                                            className="px-4 py-2 
                                                        text-lg
                                                        rounded-md border-none 
                                                        flex items-center
                                                        justify-center gap-4
                                                        hover:bg-blue-8 bg-blue-6 text-white w-fit h-fit">passar<MdArrowRight /></button>
                                                }
                                            </section> : <section className="p-4 grid grid-cols-1 gap-2">
                                                {
                                                    e.data.map(e => <OptionSelect value={e} index={_} />)
                                                }
                                            </section>

                                    }

                                    <footer className="flex justify-end">
                                        <Button onClick={() => (steps_element.current?.nextCallback())}>
                                            proxima etapa
                                        </Button>
                                    </footer>
                                </main>
                            </main>
                        </StepperPanel>
                    })
                    }
                    <StepperPanel header="Resultado">
                        <main className="h-full overflow-hidden flex flex-col items-center mt-4">
                            <div>
                                <MdCheck className="text-[10rem] rounded-full p-4 bg-gray-2" />
                            </div>
                            <p className="text-xl font-medium text-gray-700 mb-2">A avaliação foi finalizada com
                                sucesso!</p>
                            <p className="text-gray-600 mb-6">Os dados foram registrados no sistema.</p>
                            <div className="flex gap-2">
                                <ButtonTerciary>
                                    ver resultado
                                </ButtonTerciary>
                                <ButtonSecundary onClick={() => (steps_element.current?.setActiveStep(0))}>
                                    realizar nova avaliação
                                </ButtonSecundary>
                                <Button>
                                    voltar ao dashboard
                                </Button>
                            </div>
                        </main>
                    </StepperPanel>
                </Stepper>
            }
        </main>
    </Base>
}
export default Realizar