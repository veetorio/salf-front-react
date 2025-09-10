import { FilterMatchMode } from "primereact/api"

export const URL = import.meta.env.VITE_API_URL
export const LOCAL = import.meta.env.VITE_MUNICIPIO
export const defaultMode = {
    value: '',
    matchMode: FilterMatchMode.EQUALS
}