import { useEffect,useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./RiskMeter.css";

function RiskMeter(){

    const [riskScore,setRiskScore]=useState(0);

    useEffect(()=>{

        const loadRisk=async()=>{

            try{

                const token=localStorage.getItem("token");

                const res=await axios.get(

                    "http://127.0.0.1:5000/api/admin/users",

                    {

                        headers:{
                            Authorization:`Bearer ${token}`
                        }

                    }

                );

                const employees=res.data;

                if(employees.length===0){

                    setRiskScore(0);

                    return;

                }

                const total=employees.reduce(

                    (sum,item)=>sum+item.riskScore,

                    0

                );

                setRiskScore(

                    Math.round(total/employees.length)

                );

            }

            catch(err){

                console.log(err);

            }

        };

        loadRisk();

    },[]);



    let riskLevel="Low";

    if(riskScore>=70){

        riskLevel="High";

    }

    else if(riskScore>=40){

        riskLevel="Medium";

    }



    return(

        <motion.div

            className="risk-meter-card"

            initial={{
                opacity:0,
                y:30
            }}

            animate={{
                opacity:1,
                y:0
            }}

            transition={{
                duration:0.6
            }}

        >

            <h2>

                Organization Risk Score

            </h2>



            <div className="risk-circle">

                <div className="risk-number">

                    {riskScore}%

                </div>

            </div>



            <h3>

                {riskLevel} Risk

            </h3>



            <p>

                AI calculated risk level based on employee activity patterns.

            </p>



            <div className="risk-bar">

                <div

                    className="risk-progress"

                    style={{

                        width:`${riskScore}%`

                    }}

                >

                </div>

            </div>

        </motion.div>

    );

}

export default RiskMeter;