import { useAuthStore } from '@e-commerce/delivery-manager/auth/data-access';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type LoginForm = {
  email: string;
  password: string;
};

export function Login() {
  const state = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    state.login(data.email, data.password);
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
        {state.error && <span className="text-red-300">{state.error}</span>}
        <Button type="submit" label="Log in" className="mt-2 w-full" />
      </form>
    </>
  );
}

export default Login;
