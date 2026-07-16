import {useEffect,useState} from "react";
import axios from "axios";
import {motion} from "framer-motion";
import {FiCpu,FiAlertCircle} from "react-icons/fi";
import "./AIInvestigation.css";

function AIInvestigation(){

    const [report,setReport]=useState(null);

    useEffect(()=>{

        loadReport();

    },[]);

    const loadReport=async()=>{

        try{

            const token=localStorage.getItem("token");

            const users=await axios.get(

                "http://127.0.0.1:5000/api/admin/users",

                {

                    headers:{
                        Authorization:`Bearer ${token}`
                    }

                }

            );

            if(users.data.length===0){

                return;

            }

            const risky=users.data.sort(

                (a,b)=>b.riskScore-a.riskScore

            )[0];

            const reportRes=await axios.get(

                `http://127.0.0.1:5000/api/admin/ai-report/${risky.id}`,

                {

                    headers:{
                        Authorization:`Bearer ${token}`
                    }

                }

            );

            setReport(reportRes.data);

        }

        catch(err){

            console.log(err);

        }

    };

    return(

        <motion.div

            className="ai-investigation-card"

            initial={{opacity:0,y:30}}

            animate={{opacity:1,y:0}}

            transition={{duration:0.6}}

        >

            <div className="ai-header">

                <FiCpu/>

                <h2>AI Investigation</h2>

            </div>

            {

                report ?

                <>

                <div className="ai-status">

                    <FiAlertCircle/>

                    <span>{report.employee}</span>

                </div>

                <div className="ai-details">

                    <p><strong>Risk :</strong> {report.riskScore}%</p>

                    <p><strong>Trust :</strong> {report.trustScore}%</p>

                    <p><strong>Level :</strong> {report.riskLevel}</p>

                    <p><strong>Recommendation :</strong> {report.recommendation}</p>

                </div>

                <button

                    className="investigate-btn"

                    onClick={loadReport}

                >

                    Refresh AI Analysis

                </button>

                </>

                :

                <p>No investigation available.</p>

            }

        </motion.div>

    );

}

export default AIInvestigation;