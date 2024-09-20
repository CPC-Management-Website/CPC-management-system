def email_doesnt_exist():
    return {"Error": "Email does not exist"}, 401


def incorrect_password():
    return {"Error": "Incorrect Password"}, 402


def email_already_registered():
    return {"Error": "This email is already registered"}, 403


def vjudge_already_registered():
    return {"Error": "This vjudge handle is already registered"}, 403


def user_already_registered_bulk(already_registered):
    message = (
        "These users have either emails or vjudge handles that are already "
        "registered:\n"
    )
    for email in already_registered:
        message += email + "\n"
    print(message)
    return {"Error": message}, 405


def registration_closed():
    return {"Error": "Registration is currently closed!"}, 400


def emails_do_not_exist(nonexistent_emails):
    message = (
        "These emails either do not exist or there is no mentor with the given "
        "email on the system or the trainee or mentor is not registered in the "
        "current season:\n"
    )
    for email in nonexistent_emails:
        message += email + "\n"
    print(message)
    return {"Error": message}, 405


def emails_do_not_exist_register_file(nonexistent_emails):
    message = "These emails do not exist:\n"
    for email in nonexistent_emails:
        message += email + "\n"
    print(message)
    return {"Error": message}, 405


def contest_already_registered():
    return {"Error": "This contest ID is already registered"}, 406


def invalid_date_format():
    return {"Error": "Invalid date format"}, 411


def user_already_enrolled():
    return {"Error": "User already enrolled in current season"}, 412
