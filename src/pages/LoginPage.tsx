import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

const LoginPage = () => {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Get login function and state from auth store
  const { login, isLoading, error, clearError } = useAuthStore();
  
  // Navigation hook to redirect after login
  const navigate = useNavigate();
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    clearError();
    
    try {
      // Call login function from auth store
      await login(email, password);
      
      // If successful, navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the store
      console.error('Login failed:', error);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-2">Bridge Sales</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
        </div>
        
        {/* Login card */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Show error message if there is one */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 dark:bg-red-900/20 dark:border-red-500/50">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
            
            {/* Email input */}
            <Input
              label="Email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@example.com"
              required
              autoFocus
            />
            
            {/* Password input */}
            <Input
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              helperText="Hint: Use 'password' for demo accounts"
            />
            
            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Sign in
            </Button>
            
            {/* Demo account info */}
            <div className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
              <p>Demo Accounts:</p>
              <p>Agent: agent@example.com / password</p>
              <p>Admin: admin@example.com / password</p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;