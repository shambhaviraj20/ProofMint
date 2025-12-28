import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Download, Search, Shield, CheckCircle, FileText, Hash, Clock, Loader2, AlertCircle } from 'lucide-react';

const ProofGenerator = () => {
  const { actor, principal } = useAuthStore();
  const [ideaId, setIdeaId] = useState('');
  const [proofRecord, setProofRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateProof = async () => {
    if (!ideaId.trim()) return;
    
    setLoading(true);
    setError('');
    setProofRecord(null);

    try {
      const result = await actor.getIdea(ideaId);
      
      if ('err' in result) {
        setError(result.err);
        setLoading(false);
        return;
      }

      const ideaData = result.ok;
      
      const proof = {
        ideaId: ideaData.id,
        title: ideaData.title,
        description: ideaData.description,
        creator: ideaData.creator.toText(),
        timestamp: ideaData.timestamp, // Keep as BigInt for display
        timestampString: ideaData.timestamp.toString(), // Convert for JSON
        status: Object.keys(ideaData.status)[0],
        proofHash: ideaData.proofHash,
        category: ideaData.category,
        tags: ideaData.tags,
        version: Number(ideaData.version), // Convert BigInt to Number
        ipfsHash: ideaData.ipfsHash.length > 0 ? ideaData.ipfsHash[0] : null,
        isVerified: true
      };
      
      setProofRecord(proof);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching idea:', err);
      setError('Failed to fetch idea. Please try again.');
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    try {
      const milliseconds = Number(timestamp) / 1_000_000;
      return new Date(milliseconds).toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const downloadProof = () => {
    if (!proofRecord) return;

    // Convert all BigInt values to strings for JSON serialization
    const proofData = {
      certificate: {
        type: "Idea Ownership Certificate",
        description: "This certificate proves ownership and timestamp of the creative idea on the Internet Computer blockchain",
        legalNotice: "This document can be used as evidence in intellectual property disputes"
      },
      idea: {
        id: proofRecord.ideaId,
        title: proofRecord.title,
        description: proofRecord.description,
        category: proofRecord.category,
        tags: proofRecord.tags,
        status: proofRecord.status
      },
      blockchain: {
        creator: proofRecord.creator,
        timestamp: formatDate(proofRecord.timestamp),
        timestampNanoseconds: proofRecord.timestampString, // Use string version
        proofHash: proofRecord.proofHash,
        version: proofRecord.version,
        ipfsHash: proofRecord.ipfsHash
      },
      verification: {
        isVerified: proofRecord.isVerified,
        platform: "ProofMint - Internet Computer",
        network: "Internet Computer Blockchain"
      },
      generatedAt: new Date().toISOString(),
      generatedBy: principal.toText()
    };

    const blob = new Blob([JSON.stringify(proofData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proofmint-certificate-${proofRecord.ideaId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-10 h-10 text-yellow-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Generate Proof Certificate</h2>
            <p className="text-gray-400 text-sm">Create verifiable proof of your idea ownership</p>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-300">
            Enter the ID of an idea you want to generate a proof certificate for. The certificate contains blockchain-verified data.
          </p>
        </div>

        <div className="flex space-x-3 mb-6">
          <input
            type="text"
            value={ideaId}
            onChange={(e) => setIdeaId(e.target.value)}
            placeholder="Enter idea ID (e.g., idea_0)"
            className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          <button
            onClick={generateProof}
            disabled={loading || !ideaId.trim()}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {proofRecord && (
          <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-lg font-semibold text-white">Proof Record Found</span>
              </div>
              <button
                onClick={downloadProof}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Certificate</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Idea ID</p>
                <code className="text-sm text-yellow-400 font-mono">{proofRecord.ideaId}</code>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <span className="text-sm text-green-400 font-medium">{proofRecord.status}</span>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Creator</p>
                <code className="text-sm text-blue-400 font-mono break-all">{proofRecord.creator}</code>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Timestamp</p>
                <span className="text-sm text-gray-300">{formatDate(proofRecord.timestamp)}</span>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Version</p>
                <span className="text-sm text-gray-300">v{proofRecord.version}</span>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Category</p>
                <span className="text-sm text-indigo-400">{proofRecord.category}</span>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Title</p>
              <h3 className="text-lg font-semibold text-white">{proofRecord.title}</h3>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Description</p>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{proofRecord.description}</p>
            </div>

            {proofRecord.tags && proofRecord.tags.length > 0 && (
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {proofRecord.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-slate-700 text-gray-300 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-xs text-gray-400 mb-2">Blockchain Proof Hash</p>
              <code className="text-sm text-yellow-400 font-mono break-all">{proofRecord.proofHash}</code>
            </div>

            {proofRecord.ipfsHash && (
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">IPFS Hash</p>
                <code className="text-sm text-blue-400 font-mono break-all">{proofRecord.ipfsHash}</code>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProofGenerator;
