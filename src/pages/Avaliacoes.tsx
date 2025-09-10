import Base from "../BaseComponent"
import BoxDefault from "../components/BoxDefault";
import { Button as ButtonPrime } from "primereact/button";
import Table from "../components/Tables";
import { useRef, useState, type RefObject } from "react";
import { Button } from "../components/Button";
import { useMutation, useQueries } from "@tanstack/react-query";
import { deleteAvaliacao, getAvaliacao, getAvaliacoes, postAvaliacao, putAvaliacao } from "../api/api-avaliacoes";
import { deleteEventos, getEvento, getEventos, postEventos, putEventos, type EventResponse } from "../api/api-eventos";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Chip } from "primereact/chip";
import { toast } from "react-toastify";
import { InputTextarea } from "primereact/inputtextarea";
import { MdAdd } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import type AvaliacaoLeitura from "../api/api-avaliacoes";
import {  useForm } from "react-hook-form";


function Avaliacoes() {
    const [isEvent, setIsEvent] = useState(false)
    const queries = useQueries(
        {
            queries: [
                {
                    queryKey: ["eventos"],
                    queryFn: getEventos
                },
                {
                    queryKey: ["avaliações"],
                    queryFn: getAvaliacoes
                },
            ],
        }
    )




    const PassStep = (text: string, onclick: () => void) => {
        return <button className="
        p-3 transition
        text-gray-4 text-md 
        border-0 bg-transparent
         focus:text-blue-6  focus:border-b-blue-6 
        focus:border-b-2 
        hover:border-b-gray-2 hover:border-b-2
        hover:text-gray-6
         " onClick={onclick}>
            {text}
        </button>
    }




    interface Phrase {
        text: string; // Texto da frase
    }

    interface Question {
        text: string; // Enunciado da questão
        options: string[]; // Opções de resposta
    }



    const Avaliacoes = () => {
        const [open, setOpen] = useState(false)
        const [post, setPost] = useState(true)
        const defaultAssement: AvaliacaoLeitura = {
            name: "",
            gradeRange: "RANGE_1_2",
            phrases: [],
            questions: [],
            text: "",
            pseudowords: [],
            totalPseudowords: 0,
            totalWords: 0,
            words: []
        }
        const [assement, setAssement] = useState<AvaliacaoLeitura>({
            name: "",
            gradeRange: "RANGE_1_2",
            phrases: [],
            questions: [],
            text: "",
            pseudowords: [],
            totalPseudowords: 0,
            totalWords: 0,
            words: []
        })
        function removeItem<T>(list: T[], item: T): T[] {
            return list.filter(i => i !== item);
        }
        const [id, setId] = useState<number>()
        const updateAvaliacao = async (id: number) => {
            setPost(false)
            const body = await getAvaliacao(id)
            setId(id)
            setOpen(true)
            setAssement({ ...body })

        }

        const QuestionForm = ({ text, options, id }: Question & { id: number }) => {

            const autoRemove = (index: number) => {
                setAssement(prev => {
                    // se não existir a questão, só retorna o estado anterior
                    if (!prev.questions[id]) return prev;

                    const updatedQuestions = prev.questions.map((q, i) =>
                        i === id
                            ? { ...q, options: q.options.filter((_, j) => j !== index) } // remove a option
                            : q
                    );

                    return { ...prev, questions: updatedQuestions };
                });

            }


            const startAlphabet = "A".charCodeAt(0);
            const internInputRef = useRef<HTMLInputElement>(null)
            const removeQuestion = () => {
                const filterQuest = assement.questions.filter((_, i) => i != id)
                assement.questions = filterQuest
                setAssement({ ...assement })
            }
            return (
                <div className="bg-gray-2 p-4 mt-3">
                    <div className="flex justify-between">
                        <div>
                            <label><h4>Enunciado da questão</h4></label>
                            <InputText
                                className="w-full mt-2 p-2"
                                placeholder="coloque o enunciado"
                                defaultValue={text}
                                onChange={(event) => {
                                    assement.questions[id].text = event.target.value
                                }}
                                ref={internInputRef}
                            />
                        </div>
                        <ButtonPrime type="button" severity="danger" onClick={removeQuestion} className="w-fit  h-fit p-2">
                            <IoMdTrash />
                        </ButtonPrime>
                    </div>
                    <div className="flex flex-col mt-2">
                        <div className="flex flex-col gap-3">
                            <h4>Alternativas</h4>

                            {options.map((e, index) => (
                                <div className="p-inputgroup flex-1">
                                    <InputText className="p-2" placeholder={`Alternativa ${String.fromCharCode(startAlphabet + index)}`} />
                                    <ButtonPrime type="button" content={e} onClick={() => autoRemove(index)} icon="pi pi-times" className="p-button-danger" />
                                </div>
                            ))}
                        </div>
                        <div className="flex mt-2 items-end justify-between">
                            <ButtonPrime
                                type="button"
                                onClick={() => {
                                    assement.questions[id].options.push('')
                                    setAssement({ ...assement })
                                }}
                                className="bg-transparent b-0  text-blue-7"
                            >
                                <MdAdd />
                                Adicionar alternativa
                            </ButtonPrime>
                        </div>
                    </div>
                </div>
            );
        };
        const inputWords = useRef<HTMLInputElement>(null)
        const inputPseud = useRef<HTMLInputElement>(null)
        const inputPhrases = useRef<HTMLInputElement>(null)
        const onPush = (field: string, fieldRef: RefObject<HTMLInputElement>, max: number) => {
            console.log(assement)
            if (fieldRef?.current?.value.length > 0 && fieldRef?.current?.value.length <= max) {
                const chips = ((fieldRef?.current?.value) as string).split(/[.,]/g)
                for (const item of chips) assement[field].push(item.trim())
                setAssement({ ...assement })
            } else {
                toast.error("adicione um item nesse campo")
            }
        }
        const onPushPhrase = (field: string, fieldRef: RefObject<HTMLInputElement>, max: number) => {
            if (fieldRef?.current?.value.length > 0 && fieldRef?.current?.value.length <= max) {
                const chips = ((fieldRef?.current?.value) as string).split(/[.]/).map(e => ({ text: e }))
                for (const item of chips) assement[field].push(item)
                setAssement({ ...assement })
            } else {
                toast.error("adicione um item nesse campo")
            }
        }

        const [display, show] = useState()

        const onPop = (field: string, value: string) => {
            assement[field] = removeItem(assement[field], value)
            setAssement({ ...assement })
        }
        return <>
            <Dialog visible={open} className="w-3/6" onHide={() => setOpen(false)}>
                <section className="px-8 py-4">
                    <h2>Nova avaliação</h2>
                    <form action="" className="mt-3 flex flex-col gap-4" onSubmit={(ev) => {
                        ev.preventDefault()
                        assement.totalPseudowords = assement.pseudowords.length
                        assement.totalWords = assement.words.length
                        if (post) {
                            postAvaliacao(assement)
                        } else {
                            putAvaliacao(assement, id ?? 0)
                        }

                    }}>
                        <div className="flex flex-col">
                            <label htmlFor="" className="mb-2">Nome da Avaliação</label>
                            <InputText onChange={(e) => {
                                assement.name = e.target.value
                                setAssement({ ...assement })
                            }} className="h-8 p-2" placeholder="ex : Avaliação 123" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="" className="mb-2">Faixa de Série</label>
                            <Dropdown placeholder="Selecione uma faixa de série" onChange={(e) => {
                                assement.gradeRange = e.value
                                setAssement(assement)
                                // show(assement.gradeRange)
                            }} value={assement.gradeRange} panelClassName="p-3" options={[{ value: "RANGE_1_2", label: "1º ano ao 2º ano" }, { value: "RANGE_3_5", label: "3º ano ao 5º ano" }, { value: "RANGE_6_9", label: "6º ano ao 9º ano" }]} className="h-8 p-1" />
                        </div>
                        <div className="mt-3">
                            {/* items chips e palavras */}
                            <header>
                                <div>
                                    <div className="flex flex-col">
                                        <h3 className="mb-2">Palavras</h3>
                                        <label htmlFor="" className="mt-2 mb-2">Adicione até 60 pseudo-palavras para a avaliação</label>
                                        <div className="p-inputgroup flex-1">
                                            <InputText ref={inputWords} className="p-2" placeholder="Digite palavras separadas por vírgula ou pressione Enter" />
                                            <ButtonPrime onClick={() => { onPush("words", inputWords, 200) }} icon="pi pi-plus" className="bg-blue-9" type="button" />
                                        </div>
                                    </div>
                                </div>
                            </header>
                            <section className="mt-4 bg-gray-1 p-4 w-full grid cols-8 gap-x-2">
                                {
                                    assement.words.map(e => <Chip onRemove={(e) => {
                                        onPop("words", e.value)
                                    }} className="bg-green-5 w-fit b-1 b-solid b-green-6 text-white px-1/10 flex gap-2 justify-between" label={e} removable />)
                                }
                            </section>
                        </div>
                        <div className="mt-3">
                            {/* items chips e pseud */}
                            <header>
                                <div>
                                    <div className="flex flex-col">
                                        <h3 className="mb-2  text-blue-9">Pseudopalavras</h3>
                                        <label htmlFor="" className="mt-2 mb-2">Adicione até 60 pseudo-palavras para a avaliação</label>
                                        <div className="p-inputgroup flex-1">
                                            <InputText ref={inputPseud} className="p-2" placeholder="Digite pseudo-palavras separadas por vírgula ou pressione Enter" />
                                            <ButtonPrime onClick={() => { onPush("pseudowords", inputPseud, 60) }} icon="pi pi-plus" className="bg-blue-9" type="button" />
                                        </div>
                                    </div>
                                </div>
                            </header>
                            <section className="mt-4 bg-gray-1 p-4 w-full grid cols-8 gap-x-2">
                                {
                                    assement.pseudowords.map(e => <Chip onRemove={(e) => { onPop("pseudowords", e.value) }} className="bg-green-5 w-fit b-1 b-solid b-green-6 text-white px-1/10 flex gap-2 justify-between" label={e} removable />)
                                }
                            </section>
                        </div>
                        <div className="mt-3">
                            {/* items chips e phrase */}
                            <header>
                                <div>
                                    <div className="flex flex-col">
                                        <h3 className="mb-2  text-blue-9">Frases</h3>
                                        <label htmlFor="" className="mt-2 mb-2">Adicione frases para a avaliação</label>
                                        <div className="p-inputgroup flex-1">
                                            <InputText ref={inputPhrases} className="p-2" placeholder="Digite pseudo-palavras separadas por vírgula ou pressione Enter" />
                                            <ButtonPrime onClick={() => { onPushPhrase("phrases", inputPhrases, 400) }} icon="pi pi-plus" className="bg-blue-9" type="button" />
                                        </div>
                                    </div>
                                </div>
                            </header>
                            <section className="mt-4 bg-gray-1 p-4 w-full grid cols-1 gap-x-2">
                                {
                                    assement.phrases.map(e => <Chip onRemove={(ev) => { onPop("phrases", ev.value) }} className="bg-green-5 text-sm w-fit b-1 b-solid b-green-6 text-white px-1/10 flex gap-2 justify-between" label={e.text} removable />)
                                }
                            </section>
                        </div>
                        <div className="mt-3">
                            {/* items chips e text */}
                            <header>
                                <div>
                                    <div className="flex flex-col">
                                        <h3 className="mb-2  text-blue-9">Texto</h3>
                                        <label htmlFor="" className="mt-2 mb-2">Adicione o texto para a avaliação</label>
                                        <div className="p-inputgroup flex-1">
                                            <InputTextarea value={assement.text} onChange={(e) => {
                                                assement.text = e.target.value;
                                                setAssement({ ...assement })
                                            }} cols={7} rows={10} />
                                        </div>
                                    </div>
                                </div>
                            </header>
                        </div>
                        <div className="mt-3">
                            {/* items chips e answers */}
                            <header>
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="mb-2 text-blue-9">Questões de Múltipla Escolha</h3>
                                        <h5 className="mt-2 mb-2">Adicione questões relacionadas ao texto</h5>
                                    </div>
                                    <Button type="button" onClick={() => {
                                        assement.questions.push({
                                            id: 0,
                                            assessmentId: 0,
                                            text: "",
                                            options: []
                                        })
                                        setAssement({ ...assement })
                                    }}>
                                        criar questão
                                    </Button>
                                </div>
                                <section className="bg-gray-1 grid cols-1 p-5 mt-3">
                                    {
                                        assement.questions.length === 0 ? <p>
                                            Nenhuma questão adicionada
                                            Clique em "Nova Questão" para adicionar
                                        </p> : assement.questions.map((e, i) => <QuestionForm {...e} id={i} />)
                                    }

                                </section>
                            </header>
                        </div>
                        <Button type="submit">
                            criar nova avalição
                        </Button>
                    </form>
                </section>
            </Dialog>
            <BoxDefault title="Avaliações" subtitle="Gerencie os avaliações">
                <Button onClick={() => {
                    setOpen(true)
                    setPost(true)
                    setAssement({ ...defaultAssement })
                }}>
                    nova avaliação
                </Button>
            </BoxDefault>
            {queries[1].isSuccess && <Table rows={queries[1].data ?? []} title="" deleteCallbacks={deleteAvaliacao} editCallbacks={updateAvaliacao} isAct />}
        </>
    }
    const Eventos = () => {
        const [open, setOpen] = useState(false)
        const [id, setId] = useState(0)
        const [event, setEvent] = useState<EventResponse>()
        const [post,setPost] = useState(false)
        const { register, handleSubmit, reset } = useForm<{ name: string }>({
            defaultValues: event
        })
        const mutPost = useMutation(
            {
                mutationFn: async (data: { name: string }) => sendSubmitEvent(data)
            }
        )
        const mutDelete = useMutation(
            {
                mutationFn: async (id: number) => deleteEventFn(id)
            }
        )
        const mutPut = useMutation(
            {
                mutationFn : async (body : { name : string }) => putEventos({...body},id)
            }
        )
        const onEdit = async (id: number) => {
            const response = await getEvento(id)
            setId(id)
            setEvent(response)
            setOpen(true)
            reset(response)
        }
        const sendSubmitEvent = (data: { name: string }) => {
            postEventos(data)
        }
        const deleteEventFn = (id: number) => {
            deleteEventos(id)
        }
        const UpdateEvent = () => {
            return <Dialog visible={open} onHide={() => setOpen(false)}>
                <section className="px-8 py-4">
                    <h2>Novo evento de avaliação</h2>
                    <form action="" className="mt-3 flex flex-col gap-4" onSubmit={handleSubmit((e) => {
                        if(post) {
                            mutPost.mutateAsync(e)
                        } else {
                            mutPut.mutateAsync(e)
                        }

                    })}>
                        <div className="flex flex-col">
                            <label className="mb-2">nome do evento</label>
                            <InputText {...register("name")} className="h-8 p-2" placeholder="ex : evento 123" />
                        </div>
                        <Button type="submit">
                            criar
                        </Button>
                    </form>
                </section>
            </Dialog>

        }
        return <>
            <UpdateEvent />
            <BoxDefault title="Eventos" subtitle="Gerencie as eventos">
                <Button onClick={() => { 
                    setEvent(undefined)
                    reset({ name : ""})
                    setOpen(true) 
                }}>
                    novo evento
                </Button>
            </BoxDefault>
            {queries[0].isSuccess && <Table rows={queries[0].data ?? []} title="" deleteCallbacks={mutDelete.mutateAsync} editCallbacks={onEdit} isAct />}
        </>
    }
    return <Base>
        <header className="border-0 pt-4 border-b border-gray-100 border-solid flex gap-3">
            {PassStep("Avaliações", () => (setIsEvent(false)))}
            {PassStep("Eventos", () => (setIsEvent(true)))}
        </header>
        <main className="mt-4">
            {
                isEvent ? <Eventos /> : <Avaliacoes />
            }
        </main>
    </Base >
}

export default Avaliacoes