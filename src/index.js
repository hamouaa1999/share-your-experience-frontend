import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { getPostsByTag } from './assets/posts';
import { AuthContextProvider } from './contexts/AuthContext';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Profile from './components/Profile';
import Post from './components/Post';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: getPostsByTag
  },
  {
    path: '/auth-signup',
    element: <SignupForm /> 
  },
  {
    path: '/auth-login',
    element: <LoginForm />
  },
  {
    path: '/users/:id',
    element: <Profile  />,
    loader: getPostsByTag
  },
  {
    path: '/posts/:id',
    element: <Post />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();