import Base from "../BaseComponent"
import Table, { type FiltersColumn } from "../components/Tables"
import BoxDefault from "../components/BoxDefault";
import { Button } from "../components/Button";
import { defaultMode } from "../config/api-config";
import { useQuery } from "@tanstack/react-query";
import { escolas, Mockschools, type School } from "../api/api-escolas";


function Escolas() {

    const { data } = useQuery<School[]>({
        queryKey: ["escolas"],
        queryFn: escolas,
        enabled : true
    })


    console.log(data)

    const filters: FiltersColumn = {
        "name": { ...defaultMode }
    }
    const filterDrops: FiltersColumn = {
        "region": { ...defaultMode },
        "group": { ...defaultMode }
    }
    return <Base>
        <BoxDefault title="Escolas" subtitle="Gerencie as escolas do sistema">
            <Button>
                criar nova escola
            </Button>
        </BoxDefault>
        <Table isAct={true} rows={data ??Mockschools} filterInputs={filters} filterDrops={filterDrops} options={[["SUL", "NORTE", "LESTE", "OESTE"], ["GRUPO A", "GRUPO B", "GRUPO C", "GRUPO D"]]} title="Lista de Escolas" />
    </Base>

}

export default Escolas