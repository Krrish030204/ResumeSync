"use client";

import { useEffect, useState } from "react";
import { Settings, Key } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function SettingsModal() {
  const [open, setOpen] = useState(false);
  const [geminiKey, setGeminiKey] = useState("");

  useEffect(() => {
    // Load from local storage on mount
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) setGeminiKey(savedKey);
  }, []);

  const handleSave = () => {
    localStorage.setItem("gemini_api_key", geminiKey);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white" />
        }
      >
        <Settings className="w-5 h-5" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-zinc-950/90 backdrop-blur-xl border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            Preferences
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Configure your client-side API keys. Keys are stored locally in your browser.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="api-key" className="text-zinc-300 flex items-center gap-2">
              <Key className="w-4 h-4" />
              Google AI Studio API Key (Gemini)
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="bg-black/50 border-white/10 focus-visible:ring-blue-500"
            />
            <p className="text-xs text-zinc-500">
              Get a free API key from <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Google AI Studio</a>.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)} className="hover:bg-white/10">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
