import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/auth-context';
import Header from '../components/layout/header';
import Card from '../components/ui/card';
import Button from '../components/ui/button';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Todo Management App
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500">
              A clean, professional todo application for managing your tasks efficiently.
            </p>
            <div className="mt-10">
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => router.push('/login')}
                  variant="primary"
                  size="lg"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push('/register')}
                  variant="outline"
                  size="lg"
                >
                  Register
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Organize Tasks</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Create and organize your tasks with priority levels and due dates.
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Track Progress</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Mark tasks as complete and track your progress over time.
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Secure Access</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Your data is securely stored and accessible only to you.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;