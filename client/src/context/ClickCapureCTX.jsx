import React,{useState,useContext} from "react";

const ClickCapure = React.createContext();
const ClickCapureUpdate = React.createContext();

export function useClickCapture(){
    return useContext(ClickCapure);
}

export function useClickCapureUpdate(){
    return useContext(ClickCapureUpdate);
}


export function ClickCapureParent({children}){
    const [Click, setClick] = useState("none");

    function switchClick(value) {
        setClick(value);
    }


    return (
        <ClickCapure.Provider value={Click}>
            <ClickCapureUpdate.Provider value={switchClick}>
                {children}
            </ClickCapureUpdate.Provider>
        </ClickCapure.Provider>
    )
}


