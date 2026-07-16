import { useEffect,useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";
import "./EmployeeList.css";

function EmployeeList(){

    const [employees,setEmployees]=useState([]);

    useEffect(()=>{

        const loadEmployees=async()=>{

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

                setEmployees(res.data);

            }

            catch(err){

                console.log(err);

            }

        };

        loadEmployees();

    },[]);



    const getRisk=(score)=>{

        if(score>=80){

            return "High";

        }

        if(score>=50){

            return "Medium";

        }

        return "Low";

    };



    return(

        <motion.div

            className="employee-list-card"

            initial={{
                opacity:0,
                x:-30
            }}

            animate={{
                opacity:1,
                x:0
            }}

            transition={{
                duration:0.6
            }}

        >

            <div className="section-title">

                <h2>

                    Employee Risk Overview

                </h2>

            </div>



            <div className="employee-table">

                {

                    employees.map((employee)=>(

                        <div

                            className="employee-row"

                            key={employee.id}

                        >

                            <div className="employee-info">

                                <div className="employee-avatar">

                                    <FiUser/>

                                </div>

                                <div>

                                    <h4>

                                        {employee.name}

                                    </h4>

                                    <span>

                                        {employee.employee_id}

                                    </span>

                                </div>

                            </div>



                            <div>

                                {employee.department}

                            </div>



                            <div className={`risk ${getRisk(employee.riskScore).toLowerCase()}`}>

                                {getRisk(employee.riskScore)}

                            </div>



                            <div className="status">

                                {

                                    employee.locked

                                    ?

                                    "Locked"

                                    :

                                    "Active"

                                }

                            </div>

                        </div>

                    ))

                }

            </div>

        </motion.div>

    );

}

export default EmployeeList;