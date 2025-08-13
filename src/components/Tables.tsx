
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { useState } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'
import { FilterMatchMode } from 'primereact/api'
import { Button } from './Button'

interface TableProps<T extends object> {
    title: string,
    rows: T[],
    filterInputs?: FiltersColumn,
    filterDrops?: FiltersColumn,
    options?: string[][]
    isAct?: boolean,
    editCallbacks: (id: number) => void,
    deleteCallbacks: (id: number) => void,

}
interface RowData {
    [key: string]: string
}
export type FiltersColumn = Record<string, { value: string, matchMode: FilterMatchMode }>
const translation: Record<string, string> = {
    "role": "tipo",
    "name": "nome",
    "email": "email",
    "id": "id",
    "group": "grupo",
    "region": "regiao",
    "school": "escola",
    "totalStudents": "total de alunos",
    "turn": "turno",
    "grade": "série",
    "classGroup": "turma",
    "text": "texto",
    "totalWords": "total de palavras",
    "totalPseudowords": "total de pseudo-palavras",
    "questions": "questões",
    "phrases": "frases",
    totalClasses: "total de turmas",
    status : "status",
    

}
function Table<U extends object>(props: TableProps<U>) {
    const buttons = (row: RowData) => {

        return <div className='gap-2'>
            <button className='c-orange-6 border-none text-xl bg-transparent hover:c-orange-9 p-2'
                onClick={() => {
                    props.editCallbacks(Number(row.id))
                }}>
                <MdEdit />
            </button>
            <button className='c-red-6 border-none text-xl bg-transparent hover:c-red-9 p-2'
                onClick={() => {
                    props.deleteCallbacks(Number(row.id))
                }} >
                <MdDelete />
            </button>
        </div>
    }

    const cols: string[] = Object.keys(props.rows[0])

    const [filter, setFilter] = useState<FiltersColumn>(

        {
            ...props.filterInputs,
            ...props.filterDrops
        }

    )
    const inputsFilter = Object.keys(props.filterInputs ?? {})
    const dropsFilter = Object.keys(props.filterDrops ?? {})


    const setChange = (field: string, value: string) => {
        setFilter(
            (prev) => {
                return {
                    ...prev,
                    [field]: {
                        value,
                        matchMode: FilterMatchMode.CONTAINS
                    }
                }
            }
        )
    }

    const bodyTemplate = (rowData: RowData, props: { field: string }) => {
        const value = rowData[props.field];
        if (props.field === 'role') {
            switch (value) {
                case 'ADMIN':
                    return <span className="bg-blue-200 text-xs px-2 text-blue-6 p-1 rounded-full">{value}</span>;
                case 'COORDINATOR':
                    return <span className="bg-purple-200 text-xs px-2 text-purple-6 p-1 rounded-full">{value}</span>;
                case 'APPLICATOR':
                    return <span className="bg-green-200 text-xs px-2 text-green-6 p-1 rounded-full">{value}</span>;
                case 'MANAGER':
                    return <span className="bg-pink-200 text-xs px-2 text-pink-6 p-1 rounded-full">{value}</span>;
            }
        } if (props.field === 'status') {
            switch (props.field.toLowerCase()) {
                case 'ACTIVE':
                    return <span className="bg-green-200 text-xs px-2 text-green-6 p-1 rounded-full">{value}</span>;
                default :
                    return <span className="bg-red-200 text-xs px-2 text-red-6 p-1 rounded-full">{value}</span>;
            }
        }
        return <span>{value}</span>;
    };
    const clear = () => {
        setFilter({})
    }
    return <div className="h-fit w-full mt-4 border-solid border-1 border-gray-2 shadow-md p-4 rounded-xl">
        <header className='w-full flex flex flex-col gap-4'>
            <h1 className='c-blue-950'>{props.title}</h1>
            <div className='flex flex-wrap w-full bg-gray-1 p-2 flex gap-2'>
                {
                    inputsFilter.map(item => <InputText placeholder={`pesquise por ${translation[item]}`} className='p-2' onChange={(e) => setChange(item, e.target.value)} />)
                }{
                    dropsFilter.map((item, i) => <Dropdown options={(props.options ?? [[]])[i]} value={(filter[item] || { value: '' }).value} className='p-2 w-fit' panelClassName='px-2 py-4 border-none' placeholder={`pesquise por ${translation[item]}`} onChange={(e) => setChange(item, e.target.value)} />)
                }
                <Button onClick={clear}>Limpar filtros</Button>
            </div>
        </header>
        <DataTable
            value={props.rows ?? []}
            filters={filter}
            onFilter={(e) => setFilter(e)}
            autoSave=''
            emptyMessage="nenhum item foi encontrado"
            className='p-4'

        >
            {
                cols.map(e => <Column field={e} header={translation[e]} body={bodyTemplate} headerClassName='p-2 text-xs' bodyClassName={'p-2 text-sm'} />)
            }{
                props.isAct && <Column field='act' header='ações' className='p-2' body={buttons} />
            }
        </DataTable>
    </div>
}

export default Table