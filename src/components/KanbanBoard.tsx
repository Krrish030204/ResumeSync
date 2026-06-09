"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type ApplicationStatus = "Wishlist" | "Applied" | "Interviewing" | "Rejected";

export interface JobApplication {
  id: string;
  company_name: string;
  job_title: string;
  date_applied: string;
  keywords_added: string[];
  status: ApplicationStatus;
}

const COLUMNS: ApplicationStatus[] = ["Wishlist", "Applied", "Interviewing", "Rejected"];

export function KanbanBoard() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("resume_sync_jobs");
    if (saved) {
      try {
        setJobs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse jobs", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("resume_sync_jobs", JSON.stringify(jobs));
    }
  }, [jobs, isLoaded]);

  const handleAddJob = () => {
    if (!newCompany.trim() || !newTitle.trim()) return;
    
    const newJob: JobApplication = {
      id: Date.now().toString(),
      company_name: newCompany.trim(),
      job_title: newTitle.trim(),
      date_applied: new Date().toISOString().split("T")[0],
      keywords_added: [], // No keywords for manual addition
      status: "Wishlist",
    };
    
    setJobs([...jobs, newJob]);
    setNewCompany("");
    setNewTitle("");
    setIsAddModalOpen(false);
  };

  const deleteJob = (id: string) => {
    setJobs(jobs.filter(j => j.id !== id));
  };

  const moveJob = (id: string, newStatus: ApplicationStatus) => {
    setJobs(jobs.map(j => (j.id === id ? { ...j, status: newStatus } : j)));
  };

  if (!isLoaded) return null;

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Application Tracker</h1>
          <p className="text-zinc-400 mt-1">Manage your job search pipeline.</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger
            render={
              <Button className="bg-white text-black hover:bg-zinc-200 gap-2">
                <Plus className="w-4 h-4" /> Add Application
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md bg-zinc-950/90 backdrop-blur-xl border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Add New Application</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Company Name</label>
                <input 
                  type="text" 
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Google"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Job Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Frontend Engineer"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <Button 
                onClick={handleAddJob}
                disabled={!newCompany.trim() || !newTitle.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
              >
                Save Application
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 items-start pb-10 overflow-x-auto">
        {COLUMNS.map((column, index) => {
          const columnJobs = jobs.filter(j => j.status === column);
          return (
            <motion.div 
              key={column} 
              className="flex flex-col min-w-[280px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-semibold text-zinc-300">{column}</h3>
                <span className="text-xs bg-white/10 text-zinc-300 py-1 px-2 rounded-full">
                  {columnJobs.length}
                </span>
              </div>
              <div className="flex flex-col gap-3 min-h-[200px]">
                <AnimatePresence>
                  {columnJobs.map(job => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                    >
                      <GlassCard className="p-4 cursor-grab active:cursor-grabbing hover:border-white/20 transition-colors group relative">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-white truncate pr-6">{job.job_title}</h4>
                          <button 
                            onClick={() => deleteJob(job.id)}
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-zinc-400">{job.company_name}</p>
                        <p className="text-xs text-zinc-500 mt-1">Applied: {job.date_applied}</p>
                        
                        {job.keywords_added.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {job.keywords_added.slice(0, 3).map(kw => (
                              <span key={kw} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/20">
                                {kw}
                              </span>
                            ))}
                            {job.keywords_added.length > 3 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10">
                                +{job.keywords_added.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="mt-4 flex gap-1">
                          <select 
                            className="bg-black/40 text-xs text-zinc-300 border border-white/10 rounded-md p-1 w-full outline-none focus:border-blue-500"
                            value={job.status}
                            onChange={(e) => moveJob(job.id, e.target.value as ApplicationStatus)}
                          >
                            {COLUMNS.map(col => (
                              <option key={col} value={col}>{col}</option>
                            ))}
                          </select>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {columnJobs.length === 0 && (
                  <div className="border border-dashed border-white/10 rounded-2xl h-24 flex items-center justify-center text-sm text-zinc-600">
                    Drop here
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
