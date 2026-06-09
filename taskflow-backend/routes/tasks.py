import threading
import traceback
from flask import Blueprint, request, jsonify
from datetime import datetime

from utils.supabase_client import supabase

from services.email_service import (
    send_task_assigned_email,
    send_task_completed_email,
)

task_bp = Blueprint("tasks", __name__)

def run_in_background(target, *args):
    def wrapper():
        try:
            print(f"Starting background task: {target.__name__}")
            target(*args)
            print(f"Successfully completed background task: {target.__name__}")
        except Exception as e:
            print(f"ERROR in background task {target.__name__}: {str(e)}")
            traceback.print_exc()
    threading.Thread(target=wrapper).start()


# ==========================
# GET ALL TASKS
# ==========================
@task_bp.route("/api/tasks", methods=["GET"])
def get_tasks():
    try:
        result = (
            supabase.table("tasks")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        return jsonify(result.data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================
# CREATE TASK
# ==========================
@task_bp.route("/api/tasks", methods=["POST"])
def create_task():
    try:
        data = request.get_json()

        title = data.get("title")
        description = data.get("description")
        assigned_to = data.get("assigned_to")
        created_by = data.get("created_by")

        if not title:
            return jsonify({"error": "Title is required"}), 400

        if not assigned_to:
            return jsonify({"error": "Assigned user is required"}), 400

        if not created_by:
            return jsonify({"error": "Creator is required"}), 400

        if assigned_to == created_by:
            return jsonify({"error": "You cannot assign a task to yourself"}), 400

        task_result = (
            supabase.table("tasks")
            .insert(
                {
                    "title": title,
                    "description": description,
                    "assigned_to": assigned_to,
                    "created_by": created_by,
                    "status": "pending",
                }
            )
            .execute()
        )

        try:
            assigned_user = (
                supabase.table("users")
                .select("*")
                .eq("id", assigned_to)
                .single()
                .execute()
            )

            creator_user = (
                supabase.table("users")
                .select("*")
                .eq("id", created_by)
                .single()
                .execute()
            )

            if assigned_user.data and creator_user.data:
                run_in_background(
                    send_task_assigned_email,
                    assigned_user.data["email"],
                    title,
                    creator_user.data.get("full_name", "Unknown"),
                    creator_user.data.get("email", "Unknown")
                )

        except Exception as email_error:
            print("Assignment email failed:", email_error)

        return jsonify(task_result.data), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================
# COMPLETE TASK
# ==========================
@task_bp.route("/api/tasks/<task_id>/complete", methods=["PATCH"])
def complete_task(task_id):
    try:

        task_result = (
            supabase.table("tasks")
            .select("*")
            .eq("id", task_id)
            .single()
            .execute()
        )

        if not task_result.data:
            return jsonify({"error": "Task not found"}), 404

        task = task_result.data

        update_result = (
            supabase.table("tasks")
            .update(
                {
                    "status": "completed",
                    "completed_at": datetime.utcnow().isoformat(),
                }
            )
            .eq("id", task_id)
            .execute()
        )

        try:
            creator = (
                supabase.table("users")
                .select("*")
                .eq("id", task["created_by"])
                .single()
                .execute()
            )

            assignee = (
                supabase.table("users")
                .select("*")
                .eq("id", task["assigned_to"])
                .single()
                .execute()
            )

            if creator.data and assignee.data:
                run_in_background(
                    send_task_completed_email,
                    creator.data["email"],
                    task["title"],
                    assignee.data.get("full_name", "Unknown")
                )

        except Exception as email_error:
            print("Completion email failed:", email_error)

        return jsonify(update_result.data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================
# DELETE TASK
# ==========================
@task_bp.route("/api/tasks/<task_id>", methods=["DELETE"])
def delete_task(task_id):
    try:

        result = (
            supabase.table("tasks")
            .delete()
            .eq("id", task_id)
            .execute()
        )

        return jsonify(result.data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================
# GET SINGLE TASK
# ==========================
@task_bp.route("/api/tasks/<task_id>", methods=["GET"])
def get_task(task_id):
    try:

        result = (
            supabase.table("tasks")
            .select("*")
            .eq("id", task_id)
            .single()
            .execute()
        )

        return jsonify(result.data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500