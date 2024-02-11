import smtplib, ssl
import email
import os
from dotenv import load_dotenv

load_dotenv()

port = 465  # For SSL
smtp_server = "smtp.gmail.com"
sender_email = os.getenv('EMAIL_ADDR')
sender_password = os.getenv('EMAIL_PASSWD')
context = ssl.create_default_context()
server = None


def initEmail():
    server = smtplib.SMTP_SSL(smtp_server, port, context = context)
    server.login(sender_email, sender_password)
    return server

def getMessage(subject, recepient, body):
    message = email.message.EmailMessage()
    message.add_header("Subject", subject)
    message.add_header("To", recepient)
    message.set_content(body)
    return message.as_string()

# def getMessage(name,recepient,password):
#     message = email.message.EmailMessage()
#     message.add_header("Subject", "ASUFE CPC Account Password")
#     message.add_header("To",recepient)
#     body = "Dear " + name + ", your ASUFE CPC Account Password is " + password
#     message.set_content(body)
#     return message.as_string()

# def getResetMessage(recepient,password):
#     message = email.message.EmailMessage()
#     message.add_header("Subject", "ASUFE CPC Account Password Reset")
#     message.add_header("To",recepient)
#     body = "Please note that your ASUFE CPC account password has been reset, your new password is " + password
#     message.set_content(body)
#     return message.as_string()

def sendPasswordEmails(emails : list[dict[str, str]]):
    server = initEmail()
    for em in emails:
        name = em["name"]
        recepient = em["email"]
        password = em["password"]
        subject = "ASUFE CPC Account Password"
        body =  "Dear " + name + ", your ASUFE CPC Account Password is " + password
        message = getMessage(subject,recepient,body)
        server.sendmail(sender_email, recepient, message)
    # message = getMessage(name,password)

def sendPasswordResetEmail(recepient,password):
    server = initEmail()
    subject = "ASUFE CPC Account Password Reset"
    body = "Please note that your ASUFE CPC account password has been reset, your new password is " + password
    message = getMessage(subject,recepient,body)
    server.sendmail(sender_email, recepient, message)

def sendPasswordResetLink(recepient, link):
    server = initEmail()
    subject = "ASUFE CPC Account Password Reset Link"
    body = f"Visit {link} to reset your password. The link expires in 10 minutes."
    message = getMessage(subject,recepient,body)
    server.sendmail(sender_email,recepient,message)

# sendPasswordEmails(emails = [{"name":"Mohamed Ayman","password":"yourpassword","email":"mohameddalash01@gmail.com"}])