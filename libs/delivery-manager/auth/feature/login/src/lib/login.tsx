import { useAuthStore } from '@e-commerce/delivery-manager/auth/data-access';
import { useEffect } from 'react';
import { Button } from 'primereact/button';

export function Login() {
  const state = useAuthStore();

  useEffect(() => {
    state.login('email', 'password');
  }, []);

  return (
    <div className="">
      <h1 className="text-red-500">Welcome to Login!</h1>

      <Button label="Click me" icon="pi pi-plus" />
    </div>
  );
}

export default Login;
