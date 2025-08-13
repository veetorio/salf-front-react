import { useEffect, useState } from "react"
import { Button } from "./Button"

export const Timer = (props: { max: number}) => {
    const [time, setTime] = useState<number>(props.max * 60 || 0)
    const [active, setActive] = useState<boolean>(false)

    useEffect(() => {
        let contador: never
        if (active) {
            contador = setInterval(() => {
                setTime((e) => {
                    if (e <= 0) {
                        setActive(false)
                        return 0
                    };
                    return e - 1
                })
            }, 1000)
        }
        return () => clearInterval(contador)
    }, [active])

    const minutos = String(Math.floor(time / 60)).padStart(2, '0');
    const segundos = String(time % 60).padStart(2, '0');
    const tempo = `${minutos}:${segundos}`
    return <div className="flex items-center gap-2">
        <Button onClick={() => (setActive(!active)) }>
            {
                active ? 'pausar' : 'iniciar'
            }
        </Button>
        <div className="font-bold bg-gray-1 p-4 rounded-md">
            {tempo}
        </div>
    </div>

}