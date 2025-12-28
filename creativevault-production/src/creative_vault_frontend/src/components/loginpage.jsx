import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Shield, Lock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const Loginpage = () => { // RENAMED: Component name changed to Loginpage
  const { login } = useAuthStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    const toastId = toast.loading('Connecting to Internet Identity...');
    try {
      await login();
      toast.success('Successfully connected!', { id: toastId });
    } catch (error) {
      toast.error('Login failed. Please try again.', { id: toastId });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 text-white">
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl p-8 text-center">
        
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">
            ProofMint
          </h1>
          <p className="text-gray-400 mt-2">Secure Your Creativity with Blockchain</p>
        </div>

        <div className="space-y-4 text-left mb-8">
          <FeatureItem text="Immutable Timestamps" />
          <FeatureItem text="Cryptographic Proof-of-Authorship" />
          <FeatureItem text="Decentralized & Secure Storage" />
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="w-full flex items-center justify-center px-6 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-300 disabled:bg-blue-800 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Connecting...
            </>
          ) : (
            <>
              <Lock className="w-6 h-6 mr-3" />
              Login or Sign Up
            </>
          )}
        </button>
        
        <p className="text-xs text-gray-500 mt-6">
          Powered by Internet Identity on the Internet Computer
        </p>
      </div>
    </div>
  );
};

const FeatureItem = ({ text }) => (
  <div className="flex items-center text-gray-300">
    <Zap className="w-4 h-4 mr-3 text-yellow-400 flex-shrink-0" />
    <span>{text}</span>
  </div>
);

export default Loginpage; // RENAMED: Exporting the new component name