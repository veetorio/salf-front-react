import Base from "../BaseComponent"
import BoxDefault from "../components/BoxDefault";
import Table from "../components/Tables";
import { useState } from "react";
import { Button } from "../components/Button";
import { useQueries } from "@tanstack/react-query";
import { getAvaliacoes } from "../api/api-avaliacoes";
import { getEventos } from "../api/api-eventos";


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

  

    const Avaliacoes = () => {
        return <>
            <BoxDefault title="Avaliações" subtitle="Gerencie os avaliações">
                <Button>
                    nova avaliação
                </Button>
            </BoxDefault>
            {queries[1].isSuccess && <Table rows={queries[1].data ?? []} title="" deleteCallbacks={() => { }} editCallbacks={() => { }} isAct />}
        </>
    }
    const Eventos = () => {
        return <>
            <BoxDefault title="Eventos" subtitle="Gerencie as eventos">
                <Button>
                    novo evento
                </Button>
            </BoxDefault>
            {queries[0].isSuccess && <Table rows={queries[0].data ?? []} title="" deleteCallbacks={() => { }} editCallbacks={() => { }} isAct />}
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