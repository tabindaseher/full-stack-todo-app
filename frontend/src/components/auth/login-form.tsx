import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/input';
import Button from '../ui/button';

interface LoginFormInputs {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormInputs) => void;
  loading?: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading, error }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch
  } = useForm<LoginFormInputs>({
    mode: 'onBlur',
  });

  const [showPassword, setShowPassword] = useState(false);

  const watchedEmail = watch('email');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Email address"
          type="email"
          required
          placeholder="name@example.com"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          error={errors.email?.message}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
            error={errors.password?.message}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          fullWidth
          loading={loading}
        >
          Sign in
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;