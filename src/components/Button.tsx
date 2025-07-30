type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, ...props }: ButtonProps) => (
  <button
    className="w-fit border-none h-fit mt-auto py-4 px-5 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
    {...props}>
    {children}
  </button>
);