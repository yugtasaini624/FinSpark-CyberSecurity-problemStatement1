import { useEffect,useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./Timeline.css";

function Timeline(){

    const [events,setEvents]=useState([]);

    useEffect(()=>{

        const loadTimeline=async()=>{

            try{

                const token=localStorage.getItem("token");

                const res=await axios.get(

                    "http://127.0.0.1:5000/api/admin/live-feed",

                    {

                        headers:{
                            Authorization:`Bearer ${token}`
                        }

                    }

                );

                setEvents(res.data);

            }

            catch(err){

                console.log(err);

            }

        };

        loadTimeline();

    },[]);



    return(

        <motion.div

            className="timeline-card"

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

                Investigation Timeline

            </h2>



            <div className="timeline">

                {

                    events.map((event,index)=>(

                        <div

                            className="timeline-item"

                            key={index}

                        >

                            <div className="timeline-dot"></div>

                            <div className="timeline-content">

                                <span>

                                    {event.time}

                                </span>

                                <h4>

                                    {event.employee}

                                </h4>

                                <p>

                                    {event.action}

                                </p>

                                <small>

                                    Risk : {event.risk}%

                                </small>

                            </div>

                        </div>

                    ))

                }

            </div>

        </motion.div>

    );

}

export default Timeline;