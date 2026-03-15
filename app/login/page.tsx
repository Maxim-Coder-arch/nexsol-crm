import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="login-container">
      <Suspense fallback={
        <div className="login-card">
          <div className="login-logo">
            <div className="logotype-company" />
            <span>NEXSOL CRM</span>
          </div>
          <h1>Загрузка...</h1>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}