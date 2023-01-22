type ButtonProps = {
  onClick?: () => void;
  children: any;
  disabled?: boolean;
  moreClasses?: string;
};

const Button = ({ children, onClick, disabled, moreClasses }: ButtonProps) => {
  return (
    <button
      className={`flex max-h-12 min-w-[150px] items-center justify-center gap-1 rounded bg-main-300 p-2 text-center text-lg shadow duration-300 enabled:hover:bg-main-200 ${
        disabled ? "opacity-50" : ""
      } ${moreClasses || ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
