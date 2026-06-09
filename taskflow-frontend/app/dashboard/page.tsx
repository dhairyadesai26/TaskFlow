"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import api from "@/app/lib/api";

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  assigned_to: string;
  created_by: string;
  created_at: string;
}

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/";
      return;
    }

    setCurrentUser(user);

    await syncUser(user);
    await fetchUsers();
    await fetchTasks();
  };

  const syncUser = async (user: any) => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!data) {
      await supabase.from("users").insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
      });
    }
  };

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .order("full_name");

    setUsers(data || []);
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createTask = async () => {
    if (!title.trim()) {
      alert("Task title required");
      return;
    }

    if (!assignedTo) {
      alert("Please assign task");
      return;
    }

    try {
      await api.post("/tasks", {
        title,
        description,
        assigned_to: assignedTo,
        created_by: currentUser.id,
      });

      setTitle("");
      setDescription("");
      setAssignedTo("");

      await fetchTasks();
      alert("Task created successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  const completeTask = async (taskId: string) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      await fetchTasks();
      alert("Task completed successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      await fetchTasks();
      alert("Task deleted successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const deleteAccount = async () => {
    if (!currentUser) return;
    const confirmed = window.confirm("Are you sure you want to completely delete your account? This action cannot be undone.");
    if (!confirmed) return;

    try {
      await api.delete(`/users/${currentUser.id}`);
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("Failed to delete account. Please try again.");
    }
  };

  const getUserName = (id: string) => {
    const user = users.find((u) => u.id === id);
    return user?.full_name || user?.email || "Unknown";
  };

  const getAvatarUrl = (id: string) => {
    const user = users.find((u) => u.id === id);
    return user?.avatar_url || "";
  };

  const getFallbackAvatar = (name?: string, email?: string) => {
    const validName = name && name.trim() !== "" && name !== "Unknown" ? name : (email && email.trim() !== "" ? email : "User");
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(validName)}&background=6366f1&color=fff&size=128`;
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden font-sans selection:bg-[#8b5cf6]/30 pb-20">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[150px] animate-pulse-slow mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[150px] animate-pulse-slow mix-blend-screen" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl p-6 lg:p-10 animate-fade-in">
        
        <div className="mb-12 rounded-full p-4 pl-6 pr-4 bg-[#0f172a]/80 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between border border-white/10 shadow-2xl shadow-black/50">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            {currentUser && (
              <img 
                src={currentUser.user_metadata?.avatar_url || getFallbackAvatar(currentUser.user_metadata?.full_name, currentUser.email)} 
                onError={(e) => { 
                  if (!e.currentTarget.src.includes('ui-avatars.com')) {
                    e.currentTarget.src = getFallbackAvatar(currentUser.user_metadata?.full_name, currentUser.email);
                  }
                }}
                alt="Avatar" 
                className="w-12 h-12 rounded-full ring-2 ring-[#8b5cf6]/50 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
              />
            )}
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Welcome back</p>
              <h1 className="text-xl font-bold text-white">
                {currentUser?.user_metadata?.full_name || 'User'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="px-6 py-2.5 rounded-full bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 font-semibold transition-all text-sm"
            >
              Sign Out
            </button>
            <button
              onClick={deleteAccount}
              className="px-6 py-2.5 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 font-semibold transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] text-sm"
            >
              Delete Account
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 mb-12">
          
          <div className="lg:col-span-8 bg-[#0f172a]/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4f46e5] to-[#8b5cf6]"></div>
            
            <h2 className="mb-8 text-2xl font-extrabold flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4f46e5]/20 to-[#8b5cf6]/20 flex items-center justify-center border border-[#4f46e5]/30 shadow-inner">
                <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              </div>
              Create New Task
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Task Title</label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/50 focus:border-[#8b5cf6] transition-all text-white placeholder-gray-500 shadow-inner"
                    placeholder="e.g. Launch Marketing Campaign"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                  <textarea
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/50 focus:border-[#8b5cf6] transition-all text-white placeholder-gray-500 resize-none shadow-inner"
                    rows={3}
                    placeholder="Add details about the task..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2 flex flex-col md:flex-row md:items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Assign To</label>
                    <div className="relative">
                      <select
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-5 py-4 appearance-none focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/50 focus:border-[#8b5cf6] transition-all text-white shadow-inner"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                      >
                        <option value="" className="bg-slate-900">Select a team member...</option>
                        {users.filter(u => u.id !== currentUser?.id).map((user) => (
                          <option key={user.id} value={user.id} className="bg-slate-900">
                            {user.full_name} ({user.email})
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={createTask}
                    className="w-full md:w-auto h-[58px] px-8 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#8b5cf6] text-white font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mt-4 md:mt-0"
                  >
                    Create Task
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#0f172a]/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400"></div>
            <h2 className="mb-6 text-xl font-extrabold flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center border border-emerald-400/20">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              Team
            </h2>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
                >
                  <img
                    src={user.avatar_url || getFallbackAvatar(user.full_name, user.email)}
                    onError={(e) => { 
                      if (!e.currentTarget.src.includes('ui-avatars.com')) {
                        e.currentTarget.src = getFallbackAvatar(user.full_name, user.email);
                      }
                    }}
                    alt={user.full_name || user.email || 'User'}
                    className="h-12 w-12 rounded-full ring-2 ring-transparent group-hover:ring-emerald-400/50 transition-all shadow-lg"
                  />
                  <div className="overflow-hidden">
                    <p className="font-bold truncate text-white">
                      {user.full_name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="bg-[#0f172a]/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-extrabold flex items-center gap-3 text-white">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
              </div>
              Active Tasks
            </h2>
            <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-gray-300 shadow-inner">
              {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-3xl bg-black/20">
              <p className="text-gray-400 font-semibold text-lg">No tasks found. Create one above!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="group rounded-3xl border border-white/10 bg-black/40 p-6 hover:bg-[#0f172a] hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:border-white/20 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-full h-1 ${task.status === 'completed' ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-[#4f46e5] to-[#8b5cf6]'}`}></div>
                  
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <h3 className="text-xl font-bold text-white leading-tight flex-1">
                      {task.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-inner ${task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#4f46e5]/20 text-[#8b5cf6] border border-[#4f46e5]/30'}`}>
                      {task.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400 mb-8 flex-1 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="mt-auto space-y-5">
                    <div className="flex items-center justify-between text-sm pt-5 border-t border-white/10">
                      <div className="flex -space-x-3">
                        <img 
                          src={getAvatarUrl(task.created_by) || getFallbackAvatar(getUserName(task.created_by))}
                          onError={(e) => { 
                            if (!e.currentTarget.src.includes('ui-avatars.com')) {
                              e.currentTarget.src = getFallbackAvatar(getUserName(task.created_by));
                            }
                          }}
                          className="w-10 h-10 rounded-full border-2 border-[#0f172a] z-10 shadow-lg"
                          title={`Created by: ${getUserName(task.created_by)}`}
                          alt=""
                        />
                        <img 
                          src={getAvatarUrl(task.assigned_to) || getFallbackAvatar(getUserName(task.assigned_to))}
                          onError={(e) => { 
                            if (!e.currentTarget.src.includes('ui-avatars.com')) {
                              e.currentTarget.src = getFallbackAvatar(getUserName(task.assigned_to));
                            }
                          }}
                          className="w-10 h-10 rounded-full border-2 border-[#0f172a] z-0 shadow-lg"
                          title={`Assigned to: ${getUserName(task.assigned_to)}`}
                          alt=""
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">Created</p>
                        <span className="text-sm font-bold text-gray-300">
                          {new Date(task.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      {task.status !== "completed" && task.assigned_to === currentUser?.id && (
                        <button
                          onClick={() => completeTask(task.id)}
                          className="flex-1 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white py-3 text-sm font-bold transition-all border border-emerald-500/20 hover:shadow-[0_0_15px_rgba(52,211,153,0.4)]"
                        >
                          Complete
                        </button>
                      )}
                      
                      {task.created_by === currentUser?.id && (
                        <button
                          onClick={() => deleteTask(task.id)}
                          className={`${(task.status !== "completed" && task.assigned_to === currentUser?.id) ? "w-auto px-5" : "flex-1"} rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white py-3 text-sm font-bold transition-all border border-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]`}
                        >
                          {(task.status !== "completed" && task.assigned_to === currentUser?.id) ? (
                            <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          ) : "Delete Task"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}