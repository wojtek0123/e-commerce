import { useAuthStore } from '@e-commerce/delivery-manager/auth/data-access';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Tokens, User } from '@e-commerce/shared/api-models';
import { useNavigate } from 'react-router-dom';

type LoginForm = {
  email: string;
  password: string;
};

export function Login() {
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
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="email">Email</label>
          <InputText
            id="email"
            invalid={!!errors.email}
            {...register('email', { required: true })}
          />
          {errors.email && <span className="text-red-300">Invalid email</span>}
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="password">Password</label>
          <InputText
            id="password"
            type="password"
            className="w-full"
            invalid={!!errors.password}
            {...register('password', { required: true })}
          />
          {errors.password && (
            <span className="text-red-300">Invalid password</span>
          )}
        </div>
        {mutation.isError && <span className="text-red-300">{}</span>}
        <Button
          type="submit"
          label="Log in"
          className="mt-2 w-full"
          loading={mutation.isLoading}
        />
      </form>
    </>
  );
}

export default Login;
