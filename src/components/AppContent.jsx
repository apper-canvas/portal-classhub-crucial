import { createContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '@/store/userSlice';
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Students from "@/components/pages/Students";
import Classes from "@/components/pages/Classes";
import Grades from "@/components/pages/Grades";
import Attendance from "@/components/pages/Attendance";
import Login from '@/components/pages/Login';
import Signup from '@/components/pages/Signup';
import Callback from '@/components/pages/Callback';
import ErrorPage from '@/components/pages/ErrorPage';
import ResetPassword from '@/components/pages/ResetPassword';
import PromptPassword from '@/components/pages/PromptPassword';

export const AuthContext = createContext(null);

function AppContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

useEffect(() => {
    const initializeApperSDK = async () => {
      try {
        // Check if ApperSDK is loaded
        if (!window.ApperSDK) {
          console.log("Waiting for Apper SDK to load...");
          
          // Wait for SDK to load with comprehensive timeout and retry logic
          let attempts = 0;
          const maxAttempts = 60; // 12 seconds total (60 * 200ms)
          
          while (!window.ApperSDK && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 200));
            attempts++;
            
            // Log progress every 5 seconds
            if (attempts % 25 === 0) {
              console.log(`Still waiting for SDK... (${attempts * 200}ms elapsed)`);
            }
          }
          
          if (!window.ApperSDK) {
            throw new Error("Apper SDK failed to load after timeout. Please check your internet connection and refresh the page.");
          }
        }
        
        // Enhanced connectivity checks
        if (!navigator.onLine) {
          throw new Error("No internet connection detected. Please check your network connection and try again.");
        }
        
        const { ApperClient, ApperUI } = window.ApperSDK;
        
        // Verify SDK components are available
        if (!ApperClient || !ApperUI) {
          throw new Error("Apper SDK components are not available. Please refresh the page and try again.");
        }
        
        const client = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        
        ApperUI.setup(client, {
          target: '#authentication',
          clientId: import.meta.env.VITE_APPER_PROJECT_ID,
          view: 'both',
          onSuccess: function (user) {
            setIsInitialized(true);
            let currentPath = window.location.pathname + window.location.search;
            let redirectPath = new URLSearchParams(window.location.search).get('redirect');
            const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                               currentPath.includes('/callback') || currentPath.includes('/error') || 
                               currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
            
            if (user) {
              if (redirectPath) {
                navigate(redirectPath);
              } else if (!isAuthPage) {
                if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                  navigate(currentPath);
                } else {
                  navigate('/');
                }
              } else {
                navigate('/');
              }
              dispatch(setUser(JSON.parse(JSON.stringify(user))));
            } else {
              if (!isAuthPage) {
                navigate(
                  currentPath.includes('/signup')
                    ? `/signup?redirect=${currentPath}`
                    : currentPath.includes('/login')
                    ? `/login?redirect=${currentPath}`
                    : '/login'
                );
              } else if (redirectPath) {
                if (
                  !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
                ) {
                  navigate(`/login?redirect=${redirectPath}`);
                } else {
                  navigate(currentPath);
                }
              } else if (isAuthPage) {
                navigate(currentPath);
              } else {
                navigate('/login');
              }
              dispatch(clearUser());
            }
          },
          onError: function(error) {
            console.error("Authentication failed:", error);
            setIsInitialized(true);
            // Enhanced error logging for debugging
            if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
              console.error("Network-related authentication error - check connectivity");
            }
          }
        });
        
        console.log("Apper SDK initialized successfully");
        
      } catch (error) {
        console.error("SDK initialization failed:", error);
        setIsInitialized(true);
        
        // Enhanced error categorization
        if (error.message.includes('timeout') || error.message.includes('failed to load')) {
          console.error("SDK loading timeout - likely network connectivity issue");
        } else if (error.message.includes('components are not available')) {
          console.error("SDK partially loaded but components missing - try refreshing");
        } else if (error.message.includes('No internet connection')) {
          console.error("Network connectivity issue detected");
        } else {
          console.error("Unknown SDK initialization error:", error.message);
        }
      }
    };
    
    initializeApperSDK();
  }, [navigate, dispatch]);

  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  if (!isInitialized) {
    return (
      <div className="loading flex items-center justify-center p-6 h-screen w-full bg-background">
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4"></path>
          <path d="m16.2 7.8 2.9-2.9"></path>
          <path d="M18 12h4"></path>
          <path d="m16.2 16.2 2.9 2.9"></path>
          <path d="M12 18v4"></path>
          <path d="m4.9 19.1 2.9-2.9"></path>
          <path d="M2 12h4"></path>
          <path d="m4.9 4.9 2.9 2.9"></path>
        </svg>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
        <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="classes" element={<Classes />} />
          <Route path="grades" element={<Grades />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>
      </Routes>
    </AuthContext.Provider>
  );
}

export default AppContent;