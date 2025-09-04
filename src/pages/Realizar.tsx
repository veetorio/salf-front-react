import Base from "../BaseComponent";
import BoxDefault from "../components/BoxDefault";
import { useMutation, useQueries } from "@tanstack/react-query";
import Select from "react-select";
import { Button, ButtonSecundary, ButtonTerciary } from "../components/Button";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { escolas } from "../api/api-escolas";
import { Timer } from "../components/Timer";
import { useEffect, useRef, useState } from "react";
import { MdArrowLeft, MdArrowRight, MdCheck } from "react-icons/md";
import { getTurmasBySchoolId } from "../api/api-turmas";
import { getAlunosBySchoolIdAndClassId } from "../api/api-alunos";
import { getAvaliacoes } from "../api/api-avaliacoes";
import { getEventos } from "../api/api-eventos";
import {
  getRealizarAvaliacao,
  postRealizarAvaliacao,
} from "../api/api-realizar";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";
import type { Student } from "./Alunos";
import { URL } from "../config/api-config";

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


// 🔹 Componente puro para cada opção

function Realizar() {
  const [isDisabled, setIsDisabled] = useState(true)
  const OptionSelect = ({
    value,
    active,
    onToggle,
  }: {
    value: string;
    step: string;
    active: boolean;
    onToggle: () => void;
  }) => {
    return (
      <button
        className={`p-2 text-white border-none rounded-md hover:opacity-50 cursor-pointer 
      ${!isDisabled ? active ? "bg-green-500" : "bg-blue-500" : "bg-gray"}
      `}
        onClick={onToggle}
        disabled={isDisabled}
      >
        {value}
      </button>
    );
  };

  const [states, setStates] = useState({
    school: 0,
    classSchool: 0,
    student: 0,
    assements: 0,
    events: 0,
  });

  const [steps, setSteps] = useState<{ nameStep: string; data: string[] }[]>([
    { nameStep: "palavras", data: [] },
    { nameStep: "pseudo-palavras", data: [] },
    { nameStep: "frases", data: [] },
    { nameStep: "texto", data: [] },
    { nameStep: "questões", data: [] },
  ]);

  const [respostas, setRespostas] = useState<Record<string, number>>({
    "questões": 0,
    palavras: 0,
    "pseudo-palavras": 0,
    frases: 0,
    texto: 0,
  });

  // 🔹 Novo estado: guarda o que foi clicado
  const [picked, setPicked] = useState<
    Record<string, Record<string, boolean>>
  >({
    palavras: {},
    "pseudo-palavras": {},
    frases: {},
    texto: {},
    questões: {},
  });
  const calcParams = (percent: number, all: number) => Math.round((percent / 100) * all)
  // 🔹 Atualiza picked + respostas
  const handleToggle = (step: string, value: string) => {
    setPicked((prev) => {
      const stepMap = prev[step] ?? {};
      const newVal = !stepMap[value];

      setRespostas((curr) => ({
        ...curr,
        [step]: Math.max(0, (curr[step] ?? 0) + (newVal ? 1 : -1)),
      }));

      return {
        ...prev,
        [step]: { ...stepMap, [value]: newVal },
      };
    });
  };

  const mut = useMutation({
    mutationKey: ["realizar"],
    mutationFn: () =>
      postRealizarAvaliacao({
        studentId: states.student,
        assessmentEventId: states.events,
        assessmentId: states.assements,
      }),
  });

  const mutRealizar = useMutation({
    mutationKey: ["avaliacao"],
    mutationFn: async (id: number) => {
      const response = await getRealizarAvaliacao(id);
      setSteps((e) =>
        e.map((step) => {
          switch (step.nameStep) {
            case "palavras":
              return { ...step, data: response.words };
            case "pseudo-palavras":
              return { ...step, data: response.pseudowords };
            case "frases":
              return { ...step, data: response.phrases.map((e) => e.text) };
            case "texto":
              return {
                ...step,
                data: response.text.split(/\n(?=[\s\S]*\n)/g),
              };
            default:
              return step;
          }
        })
      );
    },
  });

  const queries = useQueries({
    queries: [
      { queryKey: ["escolas"], queryFn: escolas, refetchOnWindowFocus: false },
      {
        queryKey: ["turma"],
        queryFn: () => getTurmasBySchoolId(states.school),
        enabled: states.school != 0,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["aluno"],
        queryFn: () =>
          getAlunosBySchoolIdAndClassId(states.school, states.classSchool),
        enabled: states.classSchool != 0,
      },
      { queryKey: ["avaliações"], queryFn: getAvaliacoes, refetchOnWindowFocus: false },
      { queryKey: ["eventos"], queryFn: getEventos, refetchOnWindowFocus: false },
    ],
  });


  useEffect(() => {
    if (states.school) queries[1].refetch();
  }, [queries, states.school]);
  useEffect(() => {
    if (states.classSchool) queries[2].refetch();
  }, [queries, states.classSchool]);

  const optionSchool =
    queries[0].data?.map((e) => ({ value: e.id, label: e.name })) || [];
  const optionClass =
    queries[1].data?.map((e) => ({ value: e.id, label: e.name })) || [];
  const optionStudents =
    queries[2].data?.map((e) => ({ value: e.id, label: e.name })) || [];
  const optionAssements =
    queries[3].data?.map((e) => ({ value: e.id, label: e.name })) || [];
  const optionEvents =
    queries[4].data?.map((e) => ({ value: e.id, label: e.name })) || [];

  type Requisitos = "requisito 0" | "requisito 1" | "requisito 2" | "requisito 3" | "requisito 4" | "requisito 5" | "requisito 6"
  const stepsLogic = {
    "palavras": (size: number, all: number): { isPass: boolean, requisito?: Requisitos } => {
      const paramWords = calcParams(16, all)
      if (size <= paramWords) {
        if (size <= 0) {
          return { isPass: false, requisito: "requisito 0" }
        }
        return { isPass: false, requisito: "requisito 1" }
      }
      return { isPass: true }
    },
    "pseudo-palavras": (size: number, all: number): { isPass: boolean, requisito?: Requisitos } => {
      const paramWords = calcParams(45, steps[0].data.length)
      const paramPseudWords = calcParams(15, all)
      const phase = respostas["palavras"] <= paramWords || size <= paramPseudWords
      if (phase) {
        const paramWords = calcParams(45, steps[0].data.length)
        const paramPseudWords = calcParams(15, all)
        const phase2 = respostas["palavras"] <= paramWords && size <= paramPseudWords;
        if (phase2) {
          return { isPass: false, requisito: "requisito 1" }
        }
        return { isPass: false, requisito: "requisito 2" }
      }
      return { isPass: true }
    },
    "frases": (size: number, all: number): { isPass: boolean, requisito?: Requisitos } => {
      const paramsPhares = calcParams(25, all)
      const phase3 = size <= paramsPhares
      if (phase3)
        return { isPass: false, requisito: "requisito 3" }
      return { isPass: true }
    },
    "texto": (size?: number, all?: number): { isPass: boolean, requisito?: Requisitos } => {
      return { isPass: true }
    },
    "questões": (size: number, all: number): { isPass: boolean, requisito?: Requisitos } => {
      if (all == 0) {
        const phase = respostas["texto"] <= steps[3].data.length;
        if (phase) {
          const phase2 = respostas.texto <= 0;
          if (phase2) {
            return { isPass: false, requisito: "requisito 5" }
          }
          return { isPass: false, requisito: "requisito 6" }
        }
        return { isPass: true }
      } else {
        alert("sem quest")
        const param = calcParams(50, steps[3].data.length)
        const phase = size <= all || respostas["palavras"] <= param;
        if (phase) {
          const phase2 = size <= 0;
          if (phase2) {
            return { isPass: false, requisito: "requisito 5" }
          }
          return { isPass: false, requisito: "requisito 6" }
        }

        return { isPass: true }
      }

    },
  }

  const notifySteps = (req: Requisitos) => {
    const messages = {
      "requisito 0": "Você não leu a quantidade minimo, infelizmente classificaremos como não avaliado",
      "requisito 1": "Você não atendeu requisito minimo, infelizmente classificaremos como não leitor",
      "requisito 2": "Você não atendeu requisito minimo, infelizmente classificaremos como leitor de silabas",
      "requisito 3": "Você não atendeu requisito minimo, infelizmente classificaremos como leitor de palavras",
      "requisito 4": "Você não atendeu algum requisito minimo, infelizmente classificaremos como leitor de frases",
      "requisito 5": "Você não atendeu algum requisito minimo, classificaremos como leitor sem fluencia",
      "requisito 6": "Você atendeu os requisitos o classificaremos com leitor com fluencia",
    }

    toast.error(messages[req])
  }
  const steps_element = useRef<Stepper>(null);
  // const erroNotify = () => alert("Error")
  const handlePassSteps = (step: "palavras" | "pseudo-palavras" | "frases" | "texto" | "questões", index: number) => {
    const stepLogic = stepsLogic[step](respostas[step], steps[index].data.length)
    if (!stepLogic.isPass) {
      notifySteps(stepLogic.requisito ?? "requisito 0")
      encerrar()
    } else steps_element.current?.nextCallback();


  }
  const encerrar = () => {
    steps_element.current?.setActiveStep(5);
  };

  const encerrar_avaliacao_api = () => {


  }

  const [visible, setVisible] = useState(false)
  const onOpen = () => setVisible(true)
  type Performance = {
    palavras : number,
    pseudo_palavras : number,
    frases : number,
    textos : number,
    questoes : number,
    level : string
  }
  const [performance,setPerfomance] = useState<Performance>({
    palavras : 0,
    pseudo_palavras : 0,
    frases : 0,
    textos : 0,
    questoes : 0,
    level : "NOT_EVALUATED"
  })
  const [student,setStudent] = useState<Student>()
  const calcPercentual = (selecionadas: number, todas: number): number => todas != 0 ? Math.floor((selecionadas / todas) * 100) : 0
  const DesempenhoModal = () => {
    const PBDesempenho = (props: { value: number, label: string }) => {
      return <div>
        <h5 className="mb-2">{props.label}</h5>
        <ProgressBar className="w-4/6  bg-gray-1" value={props.value ?? 0} />
      </div>
    }

    const niveisLeitores = {
      NOT_EVALUATED: 'Não avaliado',
      NON_READER: 'Não leitor',
      SYLLABLE_READER: 'Leitor de sílabas',
      WORD_READER: 'Leitor de palavras',
      SENTENCE_READER: 'Leitor de frases',
      TEXT_READER_WITHOUT_FLUENCY: 'Leitor de texto sem fluência',
      TEXT_READER_WITH_FLUENCY: 'Leitor de texto com fluência'
    }
    return <Dialog className="w-1/2" visible={visible} onHide={() => setVisible(false)}>
      <div className="p-4  text-black">
        {/* details of student */}
        <h2>Desempenho do aluno</h2>
        <section className="mt-2 flex justify-start flex-col b-0 b-l-3 roundedpy-3 px-1">
          <p>
            <strong>nome :</strong> {student?.name ?? "Sem nome"}
          </p>
          <p>
            <strong>Nível do Leitor :</strong> {niveisLeitores[performance.level]}
          </p>
        </section>
        {/* performance of student */}
        <section className="">
          <div className="mt-3 flex flex-col gap-2 px-1 py-2">
            <h4>desempenho</h4>
            <PBDesempenho value={performance.palavras} label="palavras" />
            <PBDesempenho value={performance.pseudo_palavras} label="pseudo palavras" />
            <PBDesempenho value={performance.frases} label="frases" />
            <PBDesempenho value={performance.textos} label="textos" />
            <PBDesempenho value={performance.questoes} label="questões" />
          </div>
        </section>
      </div>
    </Dialog>
  }

  return (
    <>
      <DesempenhoModal></DesempenhoModal>
      <Base>
        <BoxDefault
          title="Realizar Avaliação de Leitura"
          subtitle="Avalie a fluência de leitura em três etapas"
        ></BoxDefault>

        {!mut.isSuccess && (
          <section
            title="Selecione a Avaliação"
            className="mt-4 w-full px-2 py-9 rounded-xl border border-solid border-gray-2 shadow-md"
          >
            <h1 className="c-blue-950 text-xl">Selecione avaliação</h1>
            <form
              className="grid grid-cols-3 gap-x-2 gap-y-4 mt-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const response = await mut.mutateAsync();
                setStudent({...response.student})
                mutRealizar.mutate(response.assessment.id);
                
              }}
            >
              <div>
                <label htmlFor="" className="c-blue-950 font-bold">Escolas</label>
                <Select
                  className="mt-2"
                  placeholder="selecione a escola"
                  options={optionSchool}
                  isLoading={queries[0].isLoading}
                  onChange={(inp) =>
                    setStates((e) => ({ ...e, school: inp?.value ?? 0 }))
                  }
                />
              </div>

              <div>
                <label htmlFor="" className="c-blue-950 font-bold">Turmas</label>
                <Select
                  className="mt-2"
                  placeholder="selecione a turma"
                  options={optionClass}
                  isLoading={queries[1].isLoading}
                  onChange={(inp) =>
                    setStates((e) => ({ ...e, classSchool: inp?.value ?? 0 }))
                  }
                />
              </div>
              <div>
                <label htmlFor="" className="c-blue-950 font-bold">Estudantes</label>
                <Select
                  className="mt-2"
                  placeholder="selecione o estudante"
                  options={optionStudents}
                  isLoading={queries[2].isLoading}
                  onChange={(inp) =>
                    setStates((e) => ({ ...e, student: inp?.value ?? 0 }))
                  }
                />
              </div>
              <div>
                <label htmlFor="" className="c-blue-950 font-bold">Avaliações</label>
                <Select
                  className="mt-2"
                  placeholder="selecione a avaliação"
                  isLoading={queries[3].isLoading}
                  options={optionAssements}
                  onChange={(inp) =>
                    setStates((e) => ({ ...e, assements: inp?.value ?? 0 }))
                  }
                />
              </div>
              <div>
                <label htmlFor="" className="c-blue-950 font-bold">Eventos</label>
                <Select
                  className="mt-2"
                  placeholder="selecione o evento"
                  options={optionEvents}
                  isLoading={queries[4].isLoading}
                  onChange={(inp) =>
                    setStates((e) => ({ ...e, events: inp?.value ?? 0 }))
                  }
                />
              </div>
              <Button>iniciar avaliação</Button>
            </form>
          </section>
        )}

        <main className="h-full w-full">
          {mut.isSuccess && (
            <Stepper
              linear
              ref={steps_element}
              className="p-4 mt-8 shadow-2xl rounded-xl border border-solid border-gray-2"
              headerPosition="left" >
              {steps.map((item, index) => (
                <StepperPanel key={item.nameStep} header={item.nameStep}>
                  <main className="h-full w-full mt-8">
                    <header className="p-4 flex flex-col gap-4">
                      <div className="w-full flex justify-between">
                        <h1>Etapa - {item.nameStep}</h1>
                        <div className="flex gap-4">
                          {
                            item.nameStep === "palavras" && <button
                              onClick={encerrar}
                              className="p-2 border-none rounded-md bg-red-6 hover:bg-red text-white"
                            >
                              encerrar
                            </button>
                          }

                          <Timer onStart={() => {
                            setIsDisabled(false)
                          }} onEnd={() => {
                            setIsDisabled(true)
                          }} max={1 / 2} />
                        </div>
                      </div>
                      <p>
                        Instrução: Peça para o aluno ler as {item.nameStep} abaixo
                        em voz alta. Marque as palavras que o aluno conseguir ler
                        corretamente. O tempo máximo para esta atividade é de 1
                        minuto.
                      </p>
                    </header>

                    {item.nameStep !== "texto" ? (
                      <section className="p-4 grid grid-cols-4 gap-2">
                        {item.data.length !== 0 ? (
                          item.data.map((e) => (
                            <OptionSelect
                              key={`${item.nameStep}-${e}`}
                              value={e}
                              step={item.nameStep}
                              active={!!picked[item.nameStep]?.[e]}
                              onToggle={() => handleToggle(item.nameStep, e)}
                            />
                          ))
                        ) : (
                          <button
                            onClick={() => steps_element.current?.nextCallback()}
                            className="px-4 py-2 text-lg rounded-md border-none 
                                     flex items-center justify-center gap-4
                                     hover:bg-blue-8 bg-blue-6 text-white w-fit h-fit"
                          >
                            passar<MdArrowRight />
                          </button>
                        )}
                      </section>
                    ) : (
                      <section className="p-4 grid grid-cols-1 gap-2">
                        {item.data.map((e) => (
                          <OptionSelect
                            key={`${item.nameStep}-${e}`}
                            value={e}
                            step={item.nameStep}
                            active={!!picked[item.nameStep]?.[e]}
                            onToggle={() => handleToggle(item.nameStep, e)}
                          />
                        ))}
                      </section>
                    )}

                    <footer className="flex justify-end">
                      <button
                        className={`${isDisabled ? "bg-blue" : "bg-gray"} hover:opacity-50 text-white border-none px-4 py-5 rounded-xl`}
                        onClick={() => {
                          if (isDisabled) handlePassSteps(item.nameStep as "palavras", index)
                        }}
                      >
                        proxima etapa
                      </button>
                    </footer>
                  </main>
                </StepperPanel>
              ))}

              <StepperPanel header="Resultado">
                <main className="h-full overflow-hidden flex flex-col items-center mt-4">
                  <div>
                    <MdCheck className="text-[10rem] rounded-full p-4 bg-gray-2" />
                  </div>
                  <p className="text-xl font-medium text-gray-700 mb-2">
                    A avaliação foi finalizada com sucesso!
                  </p>
                  <p className="text-gray-600 mb-6">
                    Os dados foram registrados no sistema.
                  </p>
                  <div className="flex gap-2">
                    <ButtonTerciary onClick={() => {
                      setVisible(true)
                      const perf : Performance = {
                        palavras : respostas.palavras / steps[0].data.length,
                        frases : respostas.frases / steps[1].data.length,
                        pseudo_palavras : respostas["pseudo-palavras"] / steps[2].data.length,
                        textos : respostas.textos / steps[3].data.length,
                        questoes : respostas.questoes / steps[4].data.length,
                        level : "NOT_EVALUATED"
                      }
                      setPerfomance({...perf})
                    }}>ver resultado</ButtonTerciary>
                    <ButtonSecundary
                      onClick={() => steps_element.current?.setActiveStep(0)}
                    >
                      realizar nova avaliação
                    </ButtonSecundary>
                    <Button>voltar ao dashboard</Button>
                  </div>
                </main>
              </StepperPanel>
            </Stepper>
          )}
        </main>
      </Base>
    </>
  );
}

export default Realizar;
