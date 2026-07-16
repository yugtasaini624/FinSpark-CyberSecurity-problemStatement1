def check_permission(role, action):


    permissions = {


        "employee":[

            "Viewed Customers Database",

            "Updated Customer Record",

            "Generated Monthly Report"

        ],


        "manager":[

            "Viewed Customers Database",

            "Updated Customer Record",

            "Generated Monthly Report",

            "Exported Database"

        ],


        "admin":[

            "Viewed Customers Database",

            "Updated Customer Record",

            "Generated Monthly Report",

            "Exported Database",

            "Deleted Customer Record",

            "Attempted Admin File Access"

        ]

    }



    if action in permissions.get(role, []):

        return True, role


    return False, "manager"