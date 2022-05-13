import React from "react";
import { Link } from "react-router-dom";

const SignIn = () => {
  return (
    <div className="flex h-screen justify-center">
      <div className="w-full max-w-sm self-center">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              for="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              for="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="*********"
            />
            {/* <p className="text-red-500 text-xs italic">
              Please choose a password.
            </p> */}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-secondary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              <Link to={`/`} activeClassName="current">
                SignIn
              </Link>
            </button>
            <Link
              className="inline-block align-baseline font-bold text-sm text-bg-primary hover:text-blue-800"
              to={`/auth`}
              activeClassName="current"
            >
              Switch to Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignIn;
