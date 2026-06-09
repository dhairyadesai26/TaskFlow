import importlib
import os

supabase = importlib.import_module("supabase")
create_client = supabase.create_client
from dotenv import load_dotenv
load_dotenv()
supabase=create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")

);

