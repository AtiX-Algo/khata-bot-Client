import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Login = () => {
  const { googleSignIn, signIn, user } = useAuth(); // 👈 Auth functions
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // Handler for email/password login
  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login Error:', error.message);
      // TODO: Show user-facing error message
    }
  };

  // Handler for Google login
  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Google Sign-In Error:', error.message);
    }
  };

  // If user is already logged in
  if (user) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <h1 className="text-5xl font-bold">Welcome back, {user.displayName}!</h1>
          <p className="py-6">You are already logged in.</p>
        </div>
      </div>
    );
  }

  // Otherwise show login form
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        {/* Google Login */}
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">Access your dashboard to view sales reports and insights.</p>
          <button onClick={handleGoogleLogin} className="btn btn-secondary mt-4">
            Sign in with Google
          </button>
        </div>

        {/* Email/Password Form */}
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form onSubmit={handleLogin} className="card-body">
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input
                type="email"
                name="email"
                placeholder="email"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Password</span></label>
              <input
                type="password"
                name="password"
                placeholder="password"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </form>

          {/* Link to Register page */}
          <p className="text-center mb-4">
            New here? <Link to="/register" className="link link-primary">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
