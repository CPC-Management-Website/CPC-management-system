import email
import os
import smtplib
import ssl

from dotenv import load_dotenv

load_dotenv()

PORT = 465  # For SSL
SMTP_SERVER = "smtp.gmail.com"
SENDER_EMAIL = os.getenv('EMAIL_ADDR')
SENDER_PASSWORD = os.getenv('EMAIL_PASSWD')
CONTEXT = ssl.create_default_context()


def init_email():
    server = smtplib.SMTP_SSL(SMTP_SERVER, PORT, context=CONTEXT)
    server.login(SENDER_EMAIL, SENDER_PASSWORD)
    return server


def get_message(subject, recipient, body):
    message = email.message.EmailMessage()
    message.add_header("Subject", subject)
    message.add_header("To", recipient)
    message.set_content(body)
    return message.as_string()


def send_password_emails(emails: list[dict[str, str]]):
    server = init_email()
    for em in emails:
        name = em["name"]
        recipient = em["email"]
        password = em["password"]
        subject = "ASUFE CPC Account Password"
        body = f"Dear {name}, your ASUFE CPC Account Password is {password}"
        message = get_message(subject, recipient, body)
        server.sendmail(SENDER_EMAIL, recipient, message)
    # message = getMessage(name,password)


def send_password_reset_email(recipient, password):
    server = init_email()
    subject = "ASUFE CPC Account Password Reset"
    body = (f"Please note that your ASUFE CPC account password has been reset, "
            f"your new password is {password}")
    message = get_message(subject, recipient, body)
    server.sendmail(SENDER_EMAIL, recipient, message)


def send_password_reset_link(recipient, link):
    server = init_email()
    subject = "ASUFE CPC Account Password Reset Link"
    body = f"Visit {link} to reset your password. The link expires in 10 minutes."
    message = get_message(subject, recipient, body)
    server.sendmail(SENDER_EMAIL, recipient, message)

# send_password_emails(
#     emails=[{"name": "Mohamed Ayman", "password": "yourpassword",
#              "email": "mohameddalash01@gmail.com"}])
