function Button({
    children,
    onClick,
    disabled = false,
    primary = false,
}) {
    return (
        <button
            className={primary ? "button primary" : "button"}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default Button;