function Button({
                    type = 'primary',      //or 'secondary'
                    children,
                    onClick,
                    className = '',
                    disabled = false,
                    isBlock = true,        //if the button is a block element (class block)
                }) {

    const textSize = 'text-base lg:text-lg';

    const padding = 'px-4 lg:px-7 py-1 lg:py-3';

    const color = {
        primary: 'text-white',
        secondary: 'text-blue-500',
    };

    const backgroundColors = {
        primary: 'bg-blue-500',
        secondary: 'bg-white',
    };

    const border = {
        primary: 'border-2 border-blue-500 rounded',
        secondary: 'border-2 border-blue-500 rounded',
    };

    const disabledStyle = disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'transition-all duration-200 ease-in-out hover:cursor-pointer font-bold';

    const hoverStyle = {
        primary: 'hover:bg-blue-700 hover:scale-110 hover:border-blue-700',
        secondary: 'hover:bg-blue-500 hover:text-white hover:scale-110'
    }


    let baseClasses = [
        'uppercase',
        textSize,
        border[type],
        backgroundColors[type],
        color[type],
        padding,
        disabledStyle,
        hoverStyle[type]
    ];

    if (className) {
        baseClasses = [...baseClasses, ...className.split(' ')];
    }
    if (isBlock) {
        baseClasses = [...baseClasses, 'block w-full'];
    }

    return (
        <button onClick={onClick} className={baseClasses.join(' ')} disabled={disabled}>
            <div className={'flex flex-row gap-4 place-content-center'}>
                {children}
            </div>
        </button>
    )
}

export default Button;