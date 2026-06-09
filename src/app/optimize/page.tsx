"use client";

import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, FileText, CheckCircle2, Loader2, Copy, Check, Sparkles } from "lucide-react";
import { extractPdfText } from "@/lib/pdfClient";
import { extractActionPlan, ActionPlan } from "@/lib/geminiClient";
import { motion, AnimatePresence } from "framer-motion";

export default function OptimizePage() {
  const [jobDescription, setJobDescription] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const processResume = async () => {
    if (!pdfFile || !jobDescription) {
      setError("Please upload a resume and paste a job description.");
      return;
    }
    setError(null);
    setIsProcessing(true);
    setActionPlan(null);

    try {
      // 1. Extract text from PDF
      const arrayBuffer = await pdfFile.arrayBuffer();
      const bufferForExtraction = arrayBuffer.slice(0);
      const resumeText = await extractPdfText(bufferForExtraction);

      // 2. Send to Gemini for Action Plan
      const plan = await extractActionPlan(resumeText, jobDescription);
      setActionPlan(plan);
    } catch (err: any) {
      setError(err.message || "An error occurred during processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 pb-20">
      {/* LEFT PANEL: Inputs */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-5/12 flex flex-col gap-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Fix My CV</h1>
          <p className="text-zinc-400">Identify missing ATS keywords and get exact, copy-pasteable bullet points to naturally integrate them.</p>
        </div>

        <GlassCard className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">1. Upload Current Resume (PDF)</label>
            <div className="border-2 border-dashed border-white/20 hover:border-blue-500/50 transition-colors rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-black/20" onClick={() => document.getElementById("pdf-upload")?.click()}>
              <input id="pdf-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
              {pdfFile ? (
                <>
                  <FileText className="w-8 h-8 text-blue-400 mb-3" />
                  <p className="text-sm font-medium text-white">{pdfFile.name}</p>
                  <p className="text-xs text-zinc-500 mt-1">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-zinc-400 mb-3" />
                  <p className="text-sm font-medium text-white">Click to upload or drag and drop</p>
                  <p className="text-xs text-zinc-500 mt-1">PDF format only</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2 flex-1 flex flex-col">
            <label className="text-sm font-medium text-zinc-300">2. Paste Target Job Description</label>
            <Textarea 
              placeholder="Paste the raw job description here..."
              className="flex-1 min-h-[200px] bg-black/40 border-white/10 resize-none focus-visible:ring-blue-500"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="relative group mt-2">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <button 
              onClick={processResume}
              disabled={isProcessing}
              className="relative w-full flex items-center justify-center gap-2 bg-zinc-950 px-8 py-4 rounded-lg leading-none flex items-center divide-x divide-zinc-600 font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-80 disabled:hover:scale-100"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                  <span className="pl-3">Analyzing ATS Match...</span>
                </>
              ) : (
                <span className="text-lg">Generate Action Plan</span>
              )}
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* RIGHT PANEL: Recommendations */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-7/12 flex flex-col"
      >
        <GlassCard className="flex-1 flex flex-col h-full bg-zinc-900/50">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            Actionable Recommendations
          </h2>

          {!actionPlan && !isProcessing && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
              <FileText className="w-16 h-16 text-zinc-500 mb-4" />
              <p className="text-lg text-zinc-400 font-medium">No resume processed yet</p>
              <p className="text-sm text-zinc-500 mt-2 max-w-sm">Upload a PDF and paste a JD to get specific bullet points to copy-paste into your resume.</p>
            </div>
          )}

          {isProcessing && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-zinc-400 animate-pulse">Running Gemini AI analysis...</p>
            </div>
          )}

          <AnimatePresence>
            {actionPlan && !isProcessing && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col gap-6"
              >
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-400">Analysis Complete</h3>
                    <p className="text-sm text-green-300/80 mt-1">
                      {actionPlan.missingSkills.length === 0 
                        ? "Your resume already contains all required technical skills!" 
                        : `Identified ${actionPlan.missingSkills.length} missing technical keywords. Copy the suggestions below into your editor.`}
                    </p>
                  </div>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
                  {/* Circular Score Indicator */}
                  <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                      <circle 
                        cx="50" cy="50" r="45" fill="none" 
                        stroke={actionPlan.atsScore >= 75 ? "#22c55e" : actionPlan.atsScore >= 50 ? "#eab308" : "#ef4444"} 
                        strokeWidth="8" 
                        strokeDasharray="283" 
                        strokeDashoffset={283 - (283 * actionPlan.atsScore) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white">{actionPlan.atsScore}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                      ATS Match Score
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {actionPlan.atsFeedback}
                    </p>
                  </div>
                </div>

                {actionPlan.missingSkills.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {actionPlan.missingSkills.map((kw, i) => (
                        <motion.span 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          key={kw} 
                          className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium"
                        >
                          Missing: {kw}
                        </motion.span>
                      ))}
                    </div>

                    <div className="space-y-4">
                      {actionPlan.recommendations.map((rec, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + (i * 0.1) }}
                          className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col gap-3 group relative hover:border-blue-500/50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-1 rounded">Target Section: {rec.section}</span>
                              <p className="text-sm text-zinc-400 mt-2">Integrate keyword: <span className="text-zinc-200 font-semibold">{rec.keyword}</span></p>
                            </div>
                            <button 
                              onClick={() => handleCopy(rec.suggestion, i)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                              title="Copy suggestion"
                            >
                              {copiedIndex === i ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                          <div className="bg-zinc-950 rounded-lg p-3 border border-white/5 mt-1 font-mono text-sm text-zinc-300">
                            {rec.suggestion}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>
    </div>
  );
}
