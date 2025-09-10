type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, ...props  }: ButtonProps) => (
  <button
    className="w-fit border-none h-fit mt-auto py-4 px-5 rounded-md bg-blue-950 text-white font-semibold hover:bg-blue-900 transition"
    {...props}>
    {children}
  </button>
);
export const ButtonSecundary = ({ children, ...props  }: ButtonProps) => (
  <button
    className="flex gap-4 items-center w-fit border-none h-fit mt-auto py-4 px-5 rounded-md bg-green-400 text-white font-semibold hover:text-green-300 hover:bg-green-700 transition"
    {...props}>
    {children}
  </button>
);
export const ButtonTerciary = ({ children, ...props  }: ButtonProps) => (
  <button
    className="w-fit border-none h-fit mt-auto py-4 px-5 rounded-md bg-gray-4 text-white hover:bg-gray-500 font-semibold transition"
    {...props}>
    {children}
  </button>
);