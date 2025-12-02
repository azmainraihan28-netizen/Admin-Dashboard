import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for Employee Credentials
    if (username === 'admin' && password === 'aci123') {
      setError('');
      onLogin('employee');
    } 
    // Check for Admin Credentials
    else if (username === '31303' && password === '31303') {
      setError('');
      onLogin('admin');
    }
    else {
      setError('Invalid username or password');
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-950/50 p-8 space-y-8 border border-transparent dark:border-slate-700">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mb-6">
            <span className="text-3xl font-bold">N</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Nexus Portal</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <Input 
            label="Username" 
            type="text" 
            placeholder="Enter ID" 
            value={username}
            onChange={handleInputChange(setUsername)}
            required 
          />
          <div className="space-y-1">
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={handleInputChange(setPassword)}
              required 
            />
            <div className="flex justify-end pt-1">
              <a href="#" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                Forgot password?
              </a>
            </div>
          </div>

          <Button type="submit" fullWidth className="h-11">
            Sign in
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <ShieldCheck size={14} /> Protected System
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};