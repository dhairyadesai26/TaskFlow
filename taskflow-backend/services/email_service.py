import os
import requests
import time
from dotenv import load_dotenv

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

def send_email(to_email, subject, body):
    api_key = os.getenv("BREVO_API_KEY")
    sender_email = os.getenv("GMAIL_EMAIL")

    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": api_key,
        "content-type": "application/json"
    }
    
    payload = {
        "sender": {"email": sender_email, "name": "TaskFlow App"},
        "to": [{"email": to_email}],
        "subject": subject,
        "htmlContent": f"<p>{body.replace(chr(10), '<br>')}</p>"
    }

    for attempt in range(3):
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            response.raise_for_status()
            print(f"Email sent successfully via Brevo to {to_email} on attempt {attempt+1}")
            return
        except Exception as e:
            print(f"Brevo API error on attempt {attempt+1}: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print("Response text:", e.response.text)
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
    send_email(recipient_email, subject, body)
