import { useAuthStore } from '@e-commerce/delivery-manager/auth/data-access';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Tokens, User } from '@e-commerce/shared/api-models';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

type LoginForm = {
  email: string;
  password: string;
};

export function Login() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      axios.post<{ user: User; tokens: Tokens }>(
        'http://localhost:3000/auth/login',
        { email, password },
      ),
    onSuccess({ data: { user, tokens } }) {
      authenticate(user, tokens);

      navigate('/');
    },
    onError(error) {
      if (error instanceof AxiosError) {
        setError(
          error.response?.data?.message ?? 'Error occurred while logging in',
        );
      }
      console.error(error);
    },
  });
  const { authenticate } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit: SubmitHandler<LoginForm> = ({ email, password }) => {
    mutation.mutate({ email, password });
  };

  return (
    <>
      <div className="flex flex-col w-full mb-8">
        <h2 className="text-3xl xl:text-4xl">Welcome!</h2>
        <div className="flex items-center text-base">
          <span>You can log in into delivery manager if you have access</span>
        </div>
      </div>

      <form
        className="flex flex-col gap-2 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="fieldset">
          <legend className="fieldset-legend">What is your email?</legend>
          <input
            type="text"
            className={'input w-full ' + (errors.email ? 'input-error' : '')}
            placeholder="Type here"
            {...register('email', {
              required: true,
              pattern: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
            })}
          />
          {errors.email && (
            <span className="fieldset-label text-error text-base">
              Email is invalid
            </span>
          )}
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">What is your password?</legend>
          <input
            type="password"
            className={'input w-full ' + (errors.password ? 'input-error' : '')}
            placeholder="Type here"
            {...register('password', { required: true })}
          />
          {errors.password && (
            <span className="fieldset-label text-error text-base">
              Password is required
            </span>
          )}
        </fieldset>

        {error && <span className="text-error">{error}</span>}
        <button
          className="btn btn-primary mt-2 w-full"
          type="submit"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading && (
            <span className="loading loading-spinner"></span>
          )}
          Log in
        </button>
      </form>
    </>
  );
}

export default Login;
