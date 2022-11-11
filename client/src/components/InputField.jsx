import {useRef} from "react";

function InputField({
        id,
        type = 'text',
        placeholder,
        value,
        label,
        onChange = (event) => {},
        ...rest
    }){
    const inputRef = useRef();

    return (
        <div
            className={`border transition duration-150 ease-in-out focus-within:border-primary border-gray-gray4`}
            onClick={() => inputRef.current.focus()}    //focuses input after clicking inside the div (even when not clicking on the <input> itself
        >
            {label &&
                <label
                    htmlFor={id}
                    className={`text-xs text-primary font-light placeholder-gray-gray4 px-2 pt-1.5`}
                >
                    {label}
                </label>
            }
            <input
                type={type}
                className={"w-full px-2 pb-1.5 text-primary outline-none text-base font-light rounded-md"}
                id={id}
                placeholder={placeholder}
                ref={inputRef}
                value={value}
                onChange={onChange}
                {...rest}
            />
        </div>
    )
}

export default InputField;