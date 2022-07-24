type ButtonProps = {
    onClick?: () => void,
    children: any,
    disabled?: boolean
    moreClasses?: string
}

const Button = ({children, onClick, disabled, moreClasses}: ButtonProps) => {
    return (
        <button
            className={`min-w-[150px] max-h-12 p-2 rounded text-center bg-main-300 enabled:hover:bg-main-200 duration-300 text-lg flex justify-center items-center gap-1 shadow ${disabled ? "opacity-50" : ""} ${moreClasses}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default Button;