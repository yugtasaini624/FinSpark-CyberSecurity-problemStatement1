const employeeData = [
    {
        id:1,
        name:"Rahul Sharma",
        role:"Software Engineer",
        department:"Engineering",
        risk:"High",
        status:"Under Investigation",
        riskScore:85,
        lastActivity:"10:30 AM",
        threats:[
            "Suspicious login pattern",
            "Multiple failed authentication attempts"
        ]
    },


    {
        id:2,
        name:"Priya Singh",
        role:"Data Analyst",
        department:"Analytics",
        risk:"Low",
        status:"Safe",
        riskScore:20,
        lastActivity:"09:15 AM",
        threats:[]
    },


    {
        id:3,
        name:"Arjun Mehta",
        role:"System Admin",
        department:"IT Security",
        risk:"Medium",
        status:"Monitoring",
        riskScore:55,
        lastActivity:"11:45 AM",
        threats:[
            "Unusual network activity"
        ]
    },


    {
        id:4,
        name:"Sneha Verma",
        role:"HR Manager",
        department:"Human Resource",
        risk:"Low",
        status:"Safe",
        riskScore:15,
        lastActivity:"08:30 AM",
        threats:[]
    }

];


export default employeeData;