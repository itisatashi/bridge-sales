import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Phone } from 'lucide-react';

import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Select from '@/components/common/Select';
import Card from '@/components/common/Card';
import { useAuthStore } from '@/store/auth.store';
import { useNotificationsStore } from '@/store/notifications.store';
import { NotificationType, UserRole } from '@/types';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  phone?: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, error, isLoading } = useAuthStore();
  const { addNotification } = useNotificationsStore();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: UserRole.AGENT,
      phone: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(
        data.name, 
        data.email, 
        data.password, 
        data.role as UserRole
      );
      
      // Check if registration was successful (no error)
      if (!error) {
        addNotification({
          type: NotificationType.SUCCESS,
          title: 'Registration Successful',
          message: 'Your account has been created successfully!',
          duration: 3000,
        });
        navigate('/dashboard');
      }
    } catch (err) {
      // Error is handled by the store
    }
  };

  const roleOptions = [
    { value: UserRole.AGENT, label: 'Sales Agent' },
    { value: UserRole.ADMIN, label: 'Administrator' },
  ];

  return (
    <Card className="shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Sign up to get started with Bridge Sales
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            label="Full Name"
            leftIcon={<User className="w-5 h-5" />}
            error={errors.name?.message}
            fullWidth
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
          />
        </div>

        <div>
          <Input
            label="Email Address"
            type="email"
            leftIcon={<Mail className="w-5 h-5" />}
            error={errors.email?.message}
            fullWidth
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
        </div>

        <div>
          <Input
            label="Password"
            type="password"
            leftIcon={<Lock className="w-5 h-5" />}
            error={errors.password?.message}
            fullWidth
            showPasswordToggle
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
        </div>

        <div>
          <Input
            label="Confirm Password"
            type="password"
            leftIcon={<Lock className="w-5 h-5" />}
            error={errors.confirmPassword?.message}
            fullWidth
            showPasswordToggle
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match',
            })}
          />
        </div>

        <div>
          <Input
            label="Phone Number (Optional)"
            leftIcon={<Phone className="w-5 h-5" />}
            error={errors.phone?.message}
            fullWidth
            {...register('phone', {
              pattern: {
                value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                message: 'Invalid phone number format',
              },
            })}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Create Account
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </Card>
  );
};

export default RegisterPage;
