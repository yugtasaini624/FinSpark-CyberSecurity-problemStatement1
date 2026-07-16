import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import {
    FiUsers,
    FiAlertTriangle,
    FiActivity,
    FiCheckCircle
} from "react-icons/fi";

import "./KPICards.css";

function KPICards(){

    const [dashboard,setDashboard] = useState({

        totalEmployees:0,

        criticalAlerts:0,

        totalEvidence:0,

        activeEmployees:0

    });

    useEffect(()=>{

        const loadDashboard = async()=>{

            try{

                const token = localStorage.getItem("token");

                const res = await axios.get(

                    "http://127.0.0.1:5000/api/admin/dashboard",

                    {

                        headers:{

                            Authorization:`Bearer ${token}`

                        }

                    }

                );

                setDashboard(res.data);

            }

            catch(err){

                console.log(err);

            }

        };

        loadDashboard();

    },[]);



    const cards=[

        {

            title:"Total Employees",

            value:dashboard.totalEmployees,

            icon:<FiUsers/>

        },

        {

            title:"Critical Alerts",

            value:dashboard.criticalAlerts,

            icon:<FiAlertTriangle/>

        },

        {

            title:"Evidence Collected",

            value:dashboard.totalEvidence,

            icon:<FiActivity/>

        },

        {

            title:"Active Employees",

            value:dashboard.activeEmployees,

            icon:<FiCheckCircle/>

        }

    ];



    return(

        <div className="kpi-container">

            {

                cards.map((card,index)=>(

                    <motion.div

                        className="kpi-card"

                        key={index}

                        initial={{
                            opacity:0,
                            y:30
                        }}

                        animate={{
                            opacity:1,
                            y:0
                        }}

                        transition={{
                            duration:0.5,
                            delay:index*0.1
                        }}

                    >

                        <div className="kpi-icon">

                            {card.icon}

                        </div>

                        <div>

                            <h3>

                                {card.value}

                            </h3>

                            <p>

                                {card.title}

                            </p>

                        </div>

                    </motion.div>

                ))

            }

        </div>

    );

}

export default KPICards;