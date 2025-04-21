
import React from 'react';
import Layout from '@/components/Layout';
import LoginForm from '@/components/LoginForm';

const Login: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to <span className="text-brand-purple">msjhatial</span> design</h1>
            <p className="text-muted-foreground mt-2">Create and manage your design portfolio with ease.</p>
          </div>
          
          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">Login or Create Account</h2>
            <LoginForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
