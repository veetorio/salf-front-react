import { IoMdEye } from "react-icons/io"
import InputWithIcon from "./components/InputWithIcon"
import { LOCAL , URL } from "./config/api-config"
import { MdEmail } from "react-icons/md"
import { Button } from "./components/Button"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { storeLogin } from "./contexts/login"
export interface Login {
  email : string,
  password : string
}
function App() {
  const nav = useNavigate()
  const { setUser } = storeLogin()
  const request = async(data : Login) => {
    return await axios.post(URL + "auth/login",data)
  }
  const { register , handleSubmit } = useForm<Login>()
  const sendData = async (body : Login) => {
    const response = await toast.promise(
      request(body),
      {
        pending : "verificando credenciais",
        success : "bem vindo no salf " + LOCAL,
        error : "as credencias não existem"
      })
      if(response.status === 200){
        setUser(response.data)
        localStorage.setItem("user",JSON.stringify(response.data))
        nav("/dashboard")
      }
      
    

    
    // iniciar navegação
    
  }
  return (
    <main className='bg-slate-1 flex items-center justify-center h-screen w-screen font-sans'>

      <section className="bg-white w-1/3 shadow-md p-4 rounded-md" >
        <h1 className="text-blue-7">SALF {LOCAL}</h1>
        <h3 className="text-slate-4">Sistema de Avaliação de Leitura e Fluência</h3>
        <form action="" className="h-full w-full py-5 flex flex-col gap-5" onSubmit={handleSubmit(sendData,() => {
          console.trace()
        })}>
          <div>
            <label htmlFor="" className="font-500">email</label>
            <InputWithIcon field={register("email")} icon={<MdEmail className="c-gray"/>} placeholder="email@exemplo.com" />
          </div>
          <div>
            <label htmlFor="" className="font-500">senha</label>
            <InputWithIcon icon={<IoMdEye className="c-gray"/>} field={register("password")} type="password" placeholder="senha"/>
          </div>
          <Button>Enviar</Button>
        </form>
        <footer>
          <h5 className="text-slate-4">
            Esqueceu sua senha? Entre em contato com o administrador do sistema.
          </h5>
        </footer>
      </section>
    </main>
  )
}

export default App
