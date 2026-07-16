def calculate_risk(action):

    mapping={

        "Viewed Customers Database":5,

        "Updated Customer Record":15,

        "Generated Monthly Report":20,

        "Exported Database":80,

        "Deleted Customer Record":95,

        "Attempted Admin File Access":100

    }

    return mapping.get(action,5)


def ai_explanation(risk):

    if risk>=90:

        return "Critical insider threat detected. Session should be locked immediately."

    elif risk>=70:

        return "Highly suspicious privileged operation detected."

    elif risk>=40:

        return "Repeated sensitive activities observed."

    else:

        return "Behaviour appears normal."