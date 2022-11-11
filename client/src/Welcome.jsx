// import {Link} from "react-router-dom";
// import Button from "./components/Button";
import img from "./img/Capture.png" // je tam aj svg ale nvedel som ho inmportovat pre ukazku je to len img 
import Login from "./user/Login";
import Signup from "./user/Signup";
import LoginBtn from "./user/LoginBtn";
import {ClickCapureParent} from "./context/ClickCapureCTX"; 


function Welcome(){     //styling is not done yet (add background for example)
    // const Click = useClickCapture();
    // const switchClick = useClickCapureUpdate();
    // console.log(switchClick)
    // setClick("none");
    // console.log(Click)
    // function setClick(e) {
    //     console.log(e);
    // }
    // const Click = "none";
    return (
        <ClickCapureParent>
        <div className={"flex-col content-center space-y-5 "}>
            <img className={"flex-col w-1/3 mx-auto mt-8 sm:max-h-screen xl:h-[30vh]"} src={img} alt="Logo"  ></img> 
            <div className={"flex-col  mx-auto"}>
                
                <LoginBtn></LoginBtn>
                <Login></Login>
                <Signup></Signup>
                
            </div>
        </div>
        </ClickCapureParent>
    )
}

export default Welcome;