import { useAuthStore } from '@e-commerce/delivery-manager/auth/data-access';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Tokens, User } from '@e-commerce/shared/api-models';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

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
        `${import.meta.env.VITE_API_URL}/auth/login`,
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
        <fieldset className="flex flex-col gap-1">
          <label htmlFor="email">What is your email?</label>
          <InputText
            id="email"
            type="text"
            invalid={!!errors.email}
            className="w-full"
            placeholder="Type email"
            {...register('email', {
              required: true,
              pattern: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
            })}
          />
          {errors.email && (
            <span className="text-red-300 text-base">Email is invalid</span>
          )}
        </fieldset>

        <fieldset className="flex flex-col gap-1">
          <label htmlFor="password">What is your password?</label>
          <InputText
            id="password"
            type="password"
            placeholder="Type password"
            className="w-full"
            invalid={!!errors.password}
            {...register('password', { required: true })}
          />
          {errors.password && (
            <span className="text-red-300 text-base">Password is required</span>
          )}
        </fieldset>

        {error && <span className="text-red-300">{error}</span>}
        <Button
          className="mt-2 w-full"
          type="submit"
          loading={mutation.isLoading}
          disabled={mutation.isLoading}
          label="Log in"
        />
      </form>
    </>
  );
}

export default Login;
