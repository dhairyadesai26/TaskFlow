import os
import smtplib

from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()


def send_email(to_email, subject, body):

    sender = os.getenv("GMAIL_EMAIL")
    password = os.getenv("GMAIL_APP_PASSWORD")

    msg = MIMEText(body)

    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = to_email

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(sender, password)
        server.send_message(msg)


def send_task_assigned_email(recipient_email, task_title, assigner_name, assigner_email):
    subject = "New Task Assigned"
    body = f"""
Hello,

A new task has been assigned to you by {assigner_name} ({assigner_email}).

Task: {task_title}

Please login to TaskFlow to view details.
"""

    send_email(recipient_email, subject, body)


def send_task_completed_email(
    recipient_email,
    task_title,
    assignee_name
):

    subject = "Task Completed"

    body = f"""
Hello,

The following task has been completed by {assignee_name}:

Task: {task_title}

Regards,
TaskFlow
"""

    send_email(
        recipient_email,
        subject,
        body
    )