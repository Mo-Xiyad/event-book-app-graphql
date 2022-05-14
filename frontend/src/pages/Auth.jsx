import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import localStorage from "redux-persist/es/storage";
import { setTokens } from "../redux/actions";

const Auth = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formValues, setForm] = useState({
    email: null,
    password: null,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    const { email, password } = formValues;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    let requestBody = {
      query: `
        query {
            login(email: "${email}", password: "${password}") {
                token
                userId
                tokenExpiration
            }
        }
        `,
    };
    if (!isLogin) {
      requestBody = {
        query: `
            mutation{
                createUser(userInput: {email: "${email}", password: "${password}"}){
                    email
                }
            }
        `,
      };
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        let { data } = await response.json();
        // localStorage.setItem("TOKENS", JSON.stringify(data.login.token));
        navigate("/events");
        dispatch(setTokens(data.login));
      } else {
        let { errors } = await response.json();
        throw new Error("error: " + JSON.stringify(errors));
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };
  // useEffect(() => {
  //   console.log(auth);
  // }, [formValues]);
  return (
    <div className="flex h-screen justify-center">
      <div className="w-full max-w-sm self-center">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {isLogin ? (
            <h1 className="text-3xl font-bold text-center"> Sign in </h1>
          ) : (
            <h1 className="text-3md font-bold text-center">
              {" "}
              Fill in the form to create an account
            </h1>
          )}
        </div>
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={(e) => submitHandler(e)}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              onChange={(e) =>
                setForm({
                  ...formValues,
                  email: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="***********"
              onChange={(e) =>
                setForm({
                  ...formValues,
                  password: e.target.value,
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-secondary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {isLogin ? "login" : "Create"}
            </button>
            <button
              className="bg-zinc-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Switch to Signup" : "Switch to Signin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Auth;
