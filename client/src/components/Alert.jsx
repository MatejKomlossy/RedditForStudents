import React, {useState, useEffect, useRef} from 'react';

function Alert({
     type = 'error',      //or 'success' , 'warning' , 'info'
     children,
     onClick,
     className = '',
     disabled = false,
     isBlock = true,        //if the button is a block element (class block)
     title = "",
     context = "",
    }){

    const [visibility, setVisibility] = useState("visible");

    useEffect(() => {
      mainDivRef.current.style.visibility = visibility;
    }, [visibility]);

    useEffect(() => {
      setVisibility("visible");
    }, [type,title,context]);

    const mainDiv = {
        success: 'fixed top-0 left-0 right-0  text-base lg:text-lg flex max-w rounded bg-green-100 text-green-700 shadow-md shadow-green-500/20',
        error: 'fixed top-0 left-0 right-0  text-base lg:text-lg flex max-w rounded bg-rose-100 text-rose-700 shadow-md shadow-rose-500/20',
        warning: 'fixed top-0 left-0 right-0  text-base lg:text-lg flex max-w bg-amber-100 text-amber-700 shadow-md shadow-amber-500/20',
        info: 'fixed top-0 left-0 right-0  text-base lg:text-lg flex max-w rounded bg-sky-100 text-sky-700 shadow-md shadow-sky-500/20'
    }

    const svg = {
        success: 'M20 16v-6h2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2h8v2H8v12h12m-9.09-8.92L14 10.17l6.59-6.59L22 5l-8 8l-4.5-4.5l1.41-1.42M16 20v2H4a2 2 0 0 1-2-2V7h2v13h12Z',
        error: 'M12 13q.425 0 .713-.288Q13 12.425 13 12V7.975q0-.425-.287-.7Q12.425 7 12 7t-.712.287Q11 7.575 11 8v4.025q0 .425.288.7q.287.275.712.275Zm0 4q.425 0 .713-.288Q13 16.425 13 16t-.287-.713Q12.425 15 12 15t-.712.287Q11 15.575 11 16t.288.712Q11.575 17 12 17Zm0 5q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-10Zm0 8q3.325 0 5.663-2.337Q20 15.325 20 12t-2.337-5.663Q15.325 4 12 4T6.338 6.337Q4 8.675 4 12t2.338 5.663Q8.675 20 12 20Z',
        warning: 'M12 12.5ZM2.725 21q-.575 0-.85-.5t0-1l9.25-16Q11.4 3 12 3t.875.5l9.25 16q.275.5 0 1t-.85.5ZM12 10q-.425 0-.712.287Q11 10.575 11 11v3q0 .425.288.712q.287.288.712.288t.713-.288Q13 14.425 13 14v-3q0-.425-.287-.713Q12.425 10 12 10Zm0 8q.425 0 .713-.288Q13 17.425 13 17t-.287-.712Q12.425 16 12 16t-.712.288Q11 16.575 11 17t.288.712Q11.575 18 12 18Zm-7.55 1h15.1L12 6Z',
        info: 'M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74c0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z'
    }

    const btnClose = {
        success: 'border-green-200 px-5 hover:bg-green-200',
        error: 'border-rose-200 px-5 hover:bg-rose-200',
        warning: 'border-amber-200 px-5 hover:bg-amber-200',
        info: 'border-sky-200 px-5 hover:bg-sky-200',
    }

    const close = function () {
        setVisibility("hidden");
    }

    const mainDivRef = useRef();

    return (
    <div className={mainDiv[type]} ref={mainDivRef} >

        <div className="flex-auto ">
          <div className="flex items-center gap-4 p-4">
            <div className="shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d={svg[type]}/></svg>
            </div>
            <div className="space-y-1">
              <p className="font-bold capitalize">{title}</p>
              <p className="text-sm">{context}</p>
            </div>
          </div>
        </div>
        <div className={"flex cursor-pointer items-center border-l px-10" + btnClose[type]} onClick={() => close()}>
          <button className="">
            <svg width="28" height="28" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" /></svg>
          </button>
        </div>
    </div>
    )
}
export default Alert;