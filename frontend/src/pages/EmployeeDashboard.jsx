import {
    startRecording,
    stopRecording,
    captureScreenshot
} from "../services/screenRecorder";

import "../css/dashboard.css";
import axios from "axios";
import {useState,useEffect} from "react";

function EmployeeDashboard(){

const token=localStorage.getItem("token");

const employee={

name:localStorage.getItem("name"),

id:localStorage.getItem("employee_id"),

department:"Database Administration",

role:"Employee"

};

const[riskScore,setRiskScore]=useState(15);

const[status,setStatus]=useState("Secure");

const[activities,setActivities]=useState([

"Logged into AegisVault AI"

]);

const[permissions,setPermissions]=useState([]);

const[isRecording,setIsRecording]=useState(false);

const[loading,setLoading]=useState(true);

useEffect(()=>{

fetchPermissions();

},[]);

const fetchPermissions=async()=>{

try{

const res=await axios.get(

"http://127.0.0.1:5000/api/activity/my-permissions",

{

headers:{

Authorization:`Bearer ${token}`

}

}

);

setPermissions(res.data.permissions);

setLoading(false);

}
catch(err){

console.log(err);

alert("Unable to load permissions.");

}

};

const hasAccess=(action)=>{

return permissions.includes(action);

};

const startSecureSession=async()=>{

const allow=window.confirm(

"AegisVault AI needs permission to capture your screen during this secure work session.\n\nClick OK to continue."

);

if(!allow){

return;

}

try{

const started=await startRecording();

if(started){

setIsRecording(true);

setStatus("Monitoring");

alert("Secure monitoring has started.");

}

}
catch(error){

alert("Screen sharing permission denied.");

}

};

const stopSecureSession=async()=>{

try{

await stopRecording(token);

setIsRecording(false);

setStatus("Secure");

alert("Session recording uploaded successfully.");

}
catch(error){

alert("Unable to upload recording.");

}

};

const logActivity=async(action)=>{

if(!hasAccess(action)){

alert("❌ Request Denied\n\nYou don't have permission to perform this action.");

return;

}

try{

const res=await axios.post(

"http://127.0.0.1:5000/api/activity/log",

{

action

},

{

headers:{

Authorization:`Bearer ${token}`

}

}

);

setActivities(prev=>[

`${new Date().toLocaleTimeString()} - ${action}`,

...prev

]);

setRiskScore(res.data.risk);

if(res.data.status){

setStatus(res.data.status);

}

if(res.data.risk>=80){

await captureScreenshot(token);

}

if(res.data.locked){

alert("Your account has been locked by Security Team.");

await stopRecording(token);

localStorage.clear();

window.location.href="/login";

}

}
catch(error){

console.log(error);

alert("Unable to perform action.");

}

};

if(loading){

return(

<div className="employee-dashboard">

<h2 className="loading">

Loading Dashboard...

</h2>

</div>

);

}

return(

<div className="employee-dashboard">

<div className="dashboard-navbar">

<div>

<h2>AegisVault AI</h2>

<p>Secure Employee Workspace</p>

</div>

<div className="session-buttons">

{

!isRecording?

<button
className="start-session"
onClick={startSecureSession}
>

Start Secure Session

</button>

:

<button
className="stop-session"
onClick={stopSecureSession}
>

End Secure Session

</button>

}

<button

className="logout-btn"

onClick={async()=>{

if(isRecording){

await stopRecording(token);

}

localStorage.clear();

window.location.href="/login";

}}

>

Logout

</button>

</div>

</div>

<div className="dashboard-container">

<div className="profile-card">

<h2>{employee.name}</h2>

<p><strong>Employee ID :</strong> {employee.id}</p>

<p><strong>Department :</strong> {employee.department}</p>

<p><strong>Role :</strong> {employee.role}</p>

<div className="status-badge">

{status}

</div>

</div>

<div className="session-card">

<h2>Current Session</h2>

<p>

Recording Status :

<b>

{

isRecording?

" Active"

:

" Not Started"

}

</b>

</p>

<p>

Permission Count :

<b>

{permissions.length}

</b>

</p>

<p>

Authorized Actions Available

</p>

</div>

<div className="actions-card">

<h2>Available Actions</h2>

<div className="action-buttons">

<button

disabled={!hasAccess("Viewed Customers Database")}

onClick={()=>logActivity("Viewed Customers Database")}

>

View Customers

</button>

<button

disabled={!hasAccess("Updated Customer Record")}

onClick={()=>logActivity("Updated Customer Record")}

>

Update Customer

</button>

<button

disabled={!hasAccess("Generated Monthly Report")}

onClick={()=>logActivity("Generated Monthly Report")}

>

Generate Report

</button>

<button

disabled={!hasAccess("Exported Database")}

onClick={()=>logActivity("Exported Database")}

>

Export Database

</button>

<button

disabled={!hasAccess("Deleted Customer Record")}

onClick={()=>logActivity("Deleted Customer Record")}

>

Delete Customer

</button>

<button

disabled={!hasAccess("Attempted Admin File Access")}

onClick={()=>logActivity("Attempted Admin File Access")}

>

Open Admin Files

</button>

</div>

</div>

<div className="activity-card">

<h2>Recent Activity</h2>

<ul>

{

activities.map((activity,index)=>(

<li key={index}>

{activity}

</li>

))

}

</ul>

</div>

</div>

</div>

);

}

export default EmployeeDashboard;