import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import localStorage from "redux-persist/es/storage";
import { setTokens } from "../redux/actions";

const Auth = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
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
            login(email: "${formValues.email}", password: "${formValues.password}") {
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
                createUser(userInput: {email: "${formValues.email}", password: "${formValues.password}"}){
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
        console.log(response);
        let { data } = await response.json();
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
              {/* <Link to={`/`} activeClassName="current"> */}
              Submit
              {/* </Link> */}
            </button>
            <Link
              className="inline-block align-baseline font-bold text-sm text-bg-primary hover:text-blue-800"
              to={`/`}
            >
              {isLogin ? "Switch to Signup" : "Switch to Signin"}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Auth;
