import os
import smtplib
import time

from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


def send_email(to_email, subject, body):

    sender = os.getenv("GMAIL_EMAIL")
    password = os.getenv("GMAIL_APP_PASSWORD")

    msg = MIMEText(body)

    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = to_email

    for attempt in range(3):
        try:
            with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10) as server:
                server.login(sender, password)
                server.send_message(msg)
            print(f"Email sent successfully to {to_email} on attempt {attempt+1}")
            return
        except Exception as e:
            print(f"SMTP error on attempt {attempt+1}: {e}")
            if attempt == 2:
                raise
            time.sleep(2)


def send_task_assigned_email(recipient_email, task_title, assigner_name, assigner_email):
    subject = "New Task Assigned"
    body = f"""
Hello,

A new task has been assigned to you by {assigner_name} ({assigner_email}).

Task: {task_title}

Please login to TaskFlow to view details: {FRONTEND_URL}/dashboard
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

View it here: {FRONTEND_URL}/dashboard

Regards,
TaskFlow
"""

    send_email(
        recipient_email,
        subject,
        body
    )