import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiImage, FiVideo } from "react-icons/fi";
import "./EvidenceGallery.css";

function EvidenceGallery() {

    const [evidence, setEvidence] = useState([]);

    useEffect(() => {

        const loadEvidence = async () => {

            try {

                const token = localStorage.getItem("token");

                const res = await axios.get(

                    "http://127.0.0.1:5000/api/activity/evidence",

                    {

                        headers: {
                            Authorization: `Bearer ${token}`
                        }

                    }

                );

                setEvidence(res.data);

            }

            catch (err) {

                console.log(err);

            }

        };

        loadEvidence();

    }, []);



    return (

        <motion.div

            className="evidence-card"

            initial={{
                opacity: 0,
                y: 30
            }}

            animate={{
                opacity: 1,
                y: 0
            }}

            transition={{
                duration: 0.6
            }}

        >

            <h2>

                Evidence Gallery

            </h2>



            <div className="evidence-grid">

                {

                    evidence.map((item) => (

                        <div

                            className="evidence-item"

                            key={item.id}

                        >

                            <div className="evidence-icon">

                                {

                                    item.screenshot

                                        ?

                                        <FiImage />

                                        :

                                        <FiVideo />

                                }

                            </div>



                            <div>

                                <h4>

                                    {item.employee_name}

                                </h4>

                                <p>

                                    {item.action}

                                </p>

                                <p>

                                    Risk : {item.risk_score}%

                                </p>

                                <span>

                                    {item.status}

                                </span>

                                <br />

                                {

                                    item.screenshot &&

                                    <a

                                        href={`http://127.0.0.1:5000/uploads/screenshots/${item.screenshot}`}

                                        target="_blank"

                                        rel="noreferrer"

                                    >

                                        View Screenshot

                                    </a>

                                }

                                <br />

                                {

                                    item.recording &&

                                    <a
                                        href={`http://127.0.0.1:5000/api/admin/recording/${item.recording}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        View Recording
                                    </a>

                                }

                            </div>

                        </div>

                    ))

                }

            </div>

        </motion.div >

    );

}

export default EvidenceGallery;