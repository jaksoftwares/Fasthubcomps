'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', isAdmin: false });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailConfirmModal, setShowEmailConfirmModal] = useState<{ open: boolean; message?: string }>({
    open: false,
    message: '',
  });

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password match on signup
    if (!isLogin && formData.password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Logged in!');
        onClose();
        setFormData({ email: '', password: '', name: '', isAdmin: false });
        setConfirmPassword('');
        setShowPassword(false);
      } else {
        await register(formData.name, formData.email, formData.password, formData.isAdmin);
        toast.success('Account created successfully!');
        onClose();
        setFormData({ email: '', password: '', name: '', isAdmin: false });
        setConfirmPassword('');
        setShowPassword(false);
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong. Please try again.';

      // When signup succeeded but requires email confirmation, show special modal
      if (!isLogin && message.toLowerCase().includes('account created successfully')) {
        setShowEmailConfirmModal({
          open: true,
          message,
        });
        toast.success('Account created. Please confirm your email to continue.');
        onClose();
        setFormData({ email: '', password: '', name: '', isAdmin: false });
        setConfirmPassword('');
        setShowPassword(false);
        setIsLoading(false);
        return;
      }

      // Login-specific friendly handling for unconfirmed email
      if (
        isLogin &&
        (message.toLowerCase().includes('confirm your email') || message.toLowerCase().includes('email not confirmed'))
      ) {
        toast.error('Please confirm your email from the link we sent to your inbox before logging in.');
      } else {
        toast.error(message);
      }
    }

    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  if (!isOpen && !showEmailConfirmModal.open) return null;

  return (
    <>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">{isLogin ? 'Sign In' : 'Create Account'}</h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        required={!isLogin}
                      />
                    </div>
                    {confirmPassword && formData.password !== confirmPassword && (
                      <p className="text-sm text-red-500">Passwords do not match</p>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    id="showPassword"
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="showPassword" className="text-sm text-gray-700 flex items-center space-x-1 cursor-pointer">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span>Show Password</span>
                  </Label>
                </div>

                {/* Admin registration checkbox removed for signup by request */}
                {/* {!isLogin && (
                  <div className="flex items-center space-x-2">
                    <input
                      id="isAdmin"
                      name="isAdmin"
                      type="checkbox"
                      checked={formData.isAdmin}
                      onChange={(e) => setFormData(prev => ({ ...prev, isAdmin: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <Label htmlFor="isAdmin" className="text-sm text-gray-700">
                      Register as Admin
                    </Label>
                  </div>
                )} */}
               

                <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
                  {isLoading
                    ? isLogin
                      ? 'Signing In...'
                      : 'Creating Account...'
                    : isLogin
                    ? 'Sign In'
                    : 'Create Account'}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setConfirmPassword('');
                      setShowPassword(false);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AuthModal;
