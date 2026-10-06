import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import SubjectCatalog from './components/SubjectCatalog';
import Footer from './components/Footer';
import FAB from './components/FAB';
import NotesPage from './pages/NotesPage';
import ProtectedRoute from './components/ProtectedRoute';
import SignInLayout from './components/features/auth/layouts/SignInLayout';
import SignUpLayout from './components/features/auth/layouts/SignUpLayout';
import SignInForm from './components/features/auth/pages/SignInForm';
import SignUpForm from './components/features/auth/pages/SignUpForm';
import TodoPage from './pages/TodoPage';
import AdminPage from './pages/AdminPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import { SubjectsProvider } from './context/SubjectsContext';



function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    window.__toggleTheme = () => setDarkMode(prev => !prev);
    return () => {
      delete window.__toggleTheme;
    };
  }, []);

  useEffect(() => {
    console.log('theme set:', localStorage.getItem('theme'), 'classes:', document.documentElement.className);
  }, [darkMode]);

  const router = createBrowserRouter([
      {
        path: '/',
        element: (
          <div className="bg-background text-on-surface selection:bg-primary/30 selection:text-primary min-h-screen transition-colors duration-300">
            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <main className="pt-24 pb-20">
              <Hero />
              <SubjectCatalog />
            </main>
            <Footer />
            <FAB />
          </div>
        ),
      },

      {
        path: '/notes',
        element: (
          <ProtectedRoute redirectTo="/signup">
            <div className="flex min-h-screen flex-col bg-background text-on-surface">
              <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <main className="flex-1 pt-24 pb-12">
                <NotesPage />
              </main>
              <Footer />
            </div>
          </ProtectedRoute>
        ),
      },

      {
        path: '/todo',
        element: (
          <ProtectedRoute redirectTo="/signup">
            <div className="flex min-h-screen flex-col bg-background text-on-surface">
              <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <main className="flex-1 pt-24 pb-8">
                <TodoPage />
              </main>
              <Footer />
            </div>
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin',
        element: (
          <div className="bg-background text-on-surface min-h-screen">
            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <main className="pt-16 pb-20">
              <AdminPage />
            </main>
            <Footer />
          </div>
        ),
      },
      {
        path: '/subjects/:subjectId',
        element: (
          <ProtectedRoute redirectTo="/signup">
            <div className="bg-background text-on-surface min-h-screen">
              <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <main className="pt-16 pb-20">
                <SubjectDetailPage />
              </main>
              <Footer />
            </div>
          </ProtectedRoute>
        ),
      },
      {
        path: '/signin',
        element: (
          <SignInLayout>
            <SignInForm />
          </SignInLayout>
        ),
      },
      {
        path: '/signup',
        element: (
          <SignUpLayout>
            <SignUpForm />
          </SignUpLayout>
        ),
      },
  ]);

  return (
    <SubjectsProvider>
      <RouterProvider router={router} />
    </SubjectsProvider>
  );
}

export default App;