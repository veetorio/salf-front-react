
import { Column, type ColumnPassThroughOptions } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { useState } from 'react'
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { MdDelete, MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'

interface TableProps<T extends object> {
    title: string,
    rows: T[],
    filter: string[],
    isViewFilter: string[],
    isAct? : boolean
}

function Table<U extends object>(props: TableProps<U>) {
    const buttons = () => {
        return <div className='gap-2'>
            <button className='c-orange-6 border-none text-xl bg-transparent hover:c-orange-9 p-2'>
                <MdEdit/>
            </button>
            <button className='c-red-6 border-none text-xl bg-transparent hover:c-red-9 p-2'>
                <MdDelete/>
            </button>
        </div>
    }
    const translation = {
        "role": "tipo",
        "name": "nome",
        "email": "email",
        "id": "id"
    }
    const cols: string[] = Object.keys(props.rows[0])
    const [global, setGlobal] = useState<string>()
    return <div className="h-1/2 w-full mt-4 border-1 border-gray shadow-md p-4 rounded-xl">
        <header className='w-full flex flex flex-col gap-4'>
            <h1 className='c-blue-9'>{props.title}</h1>
            <div className='w-full bg-gray-1 p-2 flex gap-2 border-t-gray'>
                {
                    props.isViewFilter.map(() => <InputText placeholder="Search" className='p-2' onChange={(e) => setGlobal(e.target.value)} /> )
                }
            </div>
        </header>
        <DataTable 
            value={props.rows} 
            filters={{
            global: {
                value: global,
                matchMode: "contains"
            }
        }}
            globalFilterFields={props.filter}
        >
            {
                cols.map(e => <Column field={e} header={translation[e]} headerClassName='p-2' bodyClassName={'p-2'}/>)
            }{
                props.isAct ? <Column field='actions' headerClassName='ações' className='p-2' body={buttons}/> : ''
            }
        </DataTable>
    </div>
}

export default Table