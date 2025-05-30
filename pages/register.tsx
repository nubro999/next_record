// pages/register.tsx
import RegisterForm from '../app/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Record</h1>
          <p className="mt-2 text-sm text-gray-600">Create your account to start journaling</p>
        </div>
        
        <RegisterForm />
      </div>
    </div>
  );
}
