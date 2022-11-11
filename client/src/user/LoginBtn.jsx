import Button from "../components/Button";

import {useClickCapture,useClickCapureUpdate} from "../context/ClickCapureCTX"; 


export function LoginBtn(){     //styling is not done yet (add background for example)
    const switchClick = useClickCapureUpdate();
    const Click = useClickCapture();
    
    const isactive = {
        display: Click === "none" ? "block" : "none"
    }

    return (
            <div className ="w-1/3 min-w-max mx-auto " style={isactive}>
                 <Button type={'primary'} children={'Log In'}  onClick={ () => switchClick("login")}/>
                 <div className={"text-center text-2xl my-2"}>OR</div>
                <Button type={'secondary'} children={'Create an Account'} onClick={ () => switchClick("register")}/>
            </div>
    )
}

export default LoginBtn;