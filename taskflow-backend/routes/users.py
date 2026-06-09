from flask import Blueprint, jsonify
from utils.supabase_client import supabase

user_bp = Blueprint("users", __name__)

@user_bp.route("/api/users/<user_id>", methods=["DELETE"])
def delete_account(user_id):
    try:
        # First, delete tasks created by or assigned to this user
        try:
            supabase.table("tasks").delete().eq("created_by", user_id).execute()
        except Exception:
            pass

        try:
            supabase.table("tasks").delete().eq("assigned_to", user_id).execute()
        except Exception:
            pass

        # Delete user from public users table
        try:
            supabase.table("users").delete().eq("id", user_id).execute()
        except Exception as table_err:
            print(f"Error deleting from users table: {table_err}")

        # Delete user from Supabase Auth
        supabase.auth.admin.delete_user(user_id)

        return jsonify({"message": "User deleted successfully"}), 200

    except Exception as e:
        print(f"Delete account error: {e}")
        return jsonify({"error": str(e)}), 500
