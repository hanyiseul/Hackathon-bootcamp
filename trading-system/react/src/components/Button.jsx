const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
  className = "",
  ...props // 넘어온 나머지 속성들을 전부 전달 (확장성 막으려면 생략하고 사용할 속성들만 명시하기)
}) => {
  const baseStyle = `
    py-3
    rounded-lg
    text-sm font-semibold
    transition
  `;

  const variants = {
    primary: `
      bg-gray-900 text-white
      hover:bg-black
    `,
    danger: `
      bg-red-500 text-white
      hover:bg-red-600
    `,
    outline: `
      border border-gray-300
      text-gray-700
      bg-white
      hover:bg-gray-100
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyle}
        ${variants[variant]}
        ${disabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;