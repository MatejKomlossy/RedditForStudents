import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import useAlert from "../hooks/useAlrert";
function D3 () {
    const [dataFromBackend, setDataFromBackend] = useState([{}]);
    const [counter, setCounter] = useState(1);

   // jednotny hook pre alert window
   const[showAlert, setShowAlert,
       alertType, setAlertType,
       alertTitle, setAlertTitle,
       alertContext, setAlertContext] = useAlert();


    useEffect(() => {
        if(counter === 1){
            return;
        }
        const req = fetch("./apidb2",{
           method:"POST",
           headers:{"Content-Type":"application/json"},
           body: JSON.stringify({"maximum":counter}) 
        });
        req.then(res => res.json()).then(data => {
            if (counter > 5 ){
                throw new Error("Maximal counter has been reached");
            }
            setDataFromBackend(data);
            setShowAlert(true);
            setAlertType('success');
            setAlertTitle("Data has been retrieved");
            setAlertContext("data has been retrieved");
        
        }).catch(err => {
            setShowAlert(true);
            setAlertType('error');
            setAlertTitle("Something went WRONG!");
            setAlertContext(`${err}`);
            console.log(`ERRROR ${err}`)
        })
    }, [counter]);

    return ( 
        
        <div className="pokus">
            {showAlert && <Alert type={alertType} title={alertTitle} context={alertContext}/>}

            {(typeof dataFromBackend === "undefined" )?
            (<p>click the button to obtain data</p>):
            (dataFromBackend.map((data,i) => (<p key={i}>{data.id} {data.name}</p>)))
            }
            
            <button onClick={() => setCounter(counter+1)} className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                load up :{counter}
            </button>
        </div>
    );
}

export default D3;