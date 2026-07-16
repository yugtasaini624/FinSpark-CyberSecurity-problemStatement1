import {useEffect,useState} from "react";
import axios from "axios";
import {motion} from "framer-motion";
import {FiCheckCircle,FiUnlock} from "react-icons/fi";
import "./ApprovalCard.css";

function ApprovalCard(){

    const [employee,setEmployee]=useState(null);

    useEffect(()=>{

        loadEmployee();

    },[]);

    const loadEmployee=async()=>{

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

            const locked=res.data.find(

                user=>user.locked

            );

            setEmployee(locked);

        }

        catch(err){

            console.log(err);

        }

    };

    const unlockEmployee=async()=>{

        try{

            const token=localStorage.getItem("token");

            await axios.post(

                `http://127.0.0.1:5000/api/admin/unlock/${employee.id}`,

                {},

                {

                    headers:{
                        Authorization:`Bearer ${token}`
                    }

                }

            );

            alert("Employee Unlocked");

            loadEmployee();

        }

        catch(err){

            console.log(err);

        }

    };

    return(

        <motion.div

            className="approval-card"

            initial={{opacity:0,y:30}}

            animate={{opacity:1,y:0}}

            transition={{duration:0.6}}

        >

            <h2>Investigation Approval</h2>

            {

                employee ?

                <>

                <div className="approval-info">

                    <p><strong>Employee :</strong> {employee.name}</p>

                    <p><strong>ID :</strong> {employee.employee_id}</p>

                    <p><strong>Department :</strong> {employee.department}</p>

                    <p><strong>Risk :</strong> {employee.riskScore}%</p>

                    <p><strong>Status :</strong> Locked</p>

                </div>

                <div className="approval-actions">

                    <button

                        className="approve-btn"

                        onClick={unlockEmployee}

                    >

                        <FiUnlock/>

                        Unlock Employee

                    </button>

                </div>

                </>

                :

                <p>No locked employees.</p>

            }

        </motion.div>

    );

}

export default ApprovalCard;