import React, { useState, useEffect } from 'react';


function D2 () {
    const [fetchDataBackend, setfetchDataBackend] = useState([{}]);
    const [counter, setcounter] = useState(0);
    
    

    useEffect(() => {
        if(counter === 0){
            return;
        }
        const req = fetch("./apidb"); //apidb - aby ste videli rozdiel
        req.then(res => res.json())
        .then(data => setfetchDataBackend(data))
        .catch(err => {
            
            console.log(`ERRROR ${err}`)
        })

      
    }, [counter]);

    return ( 
        <div className="pokus">
            {(typeof fetchDataBackend === "undefined" )?
            (<p>click the button to obtain data</p>):
            (fetchDataBackend.map((data,i) => (<p key={i}>{data.id} {data.name} {data.isic}</p>)))
            }
            
            <button onClick={() => setcounter(counter+1)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                load all:{counter}
            </button>
        </div>
    );
}

export default D2;