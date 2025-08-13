type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, ...props  }: ButtonProps) => (
  <button
    className="w-fit border-none h-fit mt-auto py-4 px-5 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
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
    className="w-fit border-none h-fit mt-auto py-4 px-5 rounded-md bg-gray-400 text-white-9  hover:text-gray-300 hover:bg-gray-700 font-semibold hover:bg-gray-700 transition"
    {...props}>
    {children}
  </button>
);