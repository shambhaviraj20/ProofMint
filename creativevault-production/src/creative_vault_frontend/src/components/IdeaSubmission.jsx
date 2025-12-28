import React, { useState } from "react";
import { Sparkles, Send, Tag, Globe, Hash, ShieldCheck, AlertTriangle, Loader2, FileText } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useIdeaStore } from "../store/ideaStore";
import { analyzeIdea } from "../services/semanticApi";
import toast from "react-hot-toast";

const IdeaSubmission = () => {
  const { actor } = useAuthStore();
  const { submitIdea } = useIdeaStore();

  // Unified form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    category: "General",
    ipfsHash: ""
  });

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["General", "DeFi", "NFT", "DAO", "Social", "Infrastructure", "Gaming"];

  // Helper to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset analysis if critical fields change to force re-verification
    if (name === 'title' || name === 'description') {
      setAnalysis(null);
    }
  };

  const getAllIdeaTexts = async (actor) => {
    if (!actor) return [];
    try {
      // Ensure this method exists on your backend or store logic
      const ideas = await actor.getPublicFeed([], [], []);
      return ideas.map(i => `${i.title} ${i.description}`);
    } catch (err) {
      console.warn("Could not fetch existing texts for analysis", err);
      return [];
    }
  };

  const handleAnalyze = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please enter a title and description first");
      return;
    }

    setLoading(true);
    try {
      const existingTexts = await getAllIdeaTexts(actor);
      const res = await analyzeIdea(formData.title, formData.description, existingTexts);
      setAnalysis(res);
      
      if (res.risk_level === "HIGH") {
        toast.error("High similarity detected! Adjust your idea.");
      } else {
        toast.success("Analysis complete. Safe to submit.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Semantic analysis failed. Is the Python backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!analysis) return toast.error("Please analyze your idea first to prove uniqueness.");
    if (analysis.risk_level === "HIGH") return toast.error("Cannot submit: High similarity risk.");
    if (!actor) return toast.error("Wallet not connected.");

    setIsSubmitting(true);
    try {
      // Parse tags from comma-separated string
      const tagArray = formData.tags.split(',').map(t => t.trim()).filter(t => t !== "");

      await submitIdea(actor, {
        title: formData.title,
        description: formData.description,
        status: { Public: null }, // Correct variant syntax
        ipfsHash: formData.ipfsHash ? [formData.ipfsHash] : [], // Correct Option syntax
        tags: tagArray,
        category: formData.category,
        // Correct Option wrapper for semantic data
        semantic: analysis
          ? [{
              score: BigInt(Math.floor(analysis.similarity_score * 100)),
              risk: analysis.risk_level,
            }]
          : [],
      });

      toast.success("🚀 Idea successfully minted on-chain!");
      
      // ✅ RESET FORM LOGIC
      setFormData({
        title: "",
        description: "",
        tags: "",
        category: "General",
        ipfsHash: ""
      });
      setAnalysis(null);

    } catch (e) {
      console.error(e);
      toast.error("Submission failed. See console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for risk badge color
  const getRiskColor = (level) => {
    switch (level) {
      case "HIGH": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "MEDIUM": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default: return "bg-green-500/20 text-green-400 border-green-500/50";
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Mint Your Intellectual Property
        </h1>
        <p className="text-slate-400 mt-2">
          Secure your ideas on the Internet Computer with AI-powered uniqueness verification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: INPUT FORM */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700 shadow-xl">
            
            {/* Title Input */}
            <div className="mb-4">
              <label className="block text-slate-400 text-sm font-semibold mb-2">Title</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                <input
                  name="title"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all outline-none placeholder-slate-600"
                  placeholder="e.g. Decentralized Solar Grid"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Category & Tags Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-slate-400 text-sm font-semibold mb-2">Category</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                  <select
                    name="category"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-white appearance-none outline-none cursor-pointer"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm font-semibold mb-2">Tags (comma separated)</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                  <input
                    name="tags"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-white outline-none placeholder-slate-600"
                    placeholder="e.g. energy, p2p, blockchain"
                    value={formData.tags}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* IPFS Hash Input */}
            <div className="mb-4">
              <label className="block text-slate-400 text-sm font-semibold mb-2">
                IPFS / Resource Link <span className="text-slate-600 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                <input
                  name="ipfsHash"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-white outline-none placeholder-slate-600 font-mono text-sm"
                  placeholder="ipfs://QmHash..."
                  value={formData.ipfsHash}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Description Input */}
            <div className="mb-2">
              <label className="block text-slate-400 text-sm font-semibold mb-2">Full Description</label>
              <textarea
                name="description"
                className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-white min-h-[150px] outline-none placeholder-slate-600 leading-relaxed"
                placeholder="Describe your innovation in detail..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: ACTION & ANALYSIS */}
        <div className="space-y-6">
          
          {/* Action Card */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col gap-3">
            <h3 className="text-white font-bold text-lg mb-2">Actions</h3>
            
            <button
              onClick={handleAnalyze}
              disabled={loading || !formData.title || !formData.description}
              className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                analysis 
                  ? "bg-slate-700 text-slate-300 cursor-default" 
                  : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black shadow-lg shadow-orange-500/20"
              }`}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {loading ? "AI Analyzing..." : analysis ? "Re-Analyze" : "1. Analyze Similarity"}
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !analysis || analysis.risk_level === "HIGH"}
              className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                !analysis || analysis.risk_level === "HIGH"
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg shadow-green-500/20"
              }`}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
              {isSubmitting ? "Minting..." : "2. Submit to Chain"}
            </button>
          </div>

          {/* Analysis Results Card */}
          {analysis && (
            <div className={`p-6 rounded-2xl border backdrop-blur-sm animate-fade-in ${
              analysis.risk_level === "HIGH" ? "bg-red-900/10 border-red-500/30" : "bg-slate-900/50 border-slate-700"
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-200 font-bold">Semantic Report</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(analysis.risk_level)}`}>
                  {analysis.risk_level} RISK
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-slate-400 mb-1">
                    <span>Uniqueness Score</span>
                    <span>{100 - analysis.similarity_score}%</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        analysis.risk_level === "HIGH" ? "bg-red-500" : "bg-green-500"
                      }`}
                      style={{ width: `${100 - analysis.similarity_score}%` }} 
                    />
                  </div>
                </div>

                <div className="flex gap-3 items-start bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  {analysis.risk_level === "HIGH" 
                    ? <AlertTriangle className="text-red-400 w-5 h-5 shrink-0" />
                    : <ShieldCheck className="text-green-400 w-5 h-5 shrink-0" />
                  }
                  <p className="text-sm text-slate-300 leading-snug">
                    {analysis.message}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default IdeaSubmission;