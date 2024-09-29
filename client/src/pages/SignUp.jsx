import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
  // state for changing the input:
  const [formData, setFormData] = useState({});
  // state for loading:
  const [loading, setLoading] = useState(false);
  // state for error handling:
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // handle change event for input fields:
  const handleChangeInput = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // handle submit the form and fetch the data:
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg focus:outline-none"
          id="username"
          onChange={handleChangeInput}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg focus:outline-none"
          id="email"
          onChange={handleChangeInput}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg focus:outline-none"
          id="password"
          onChange={handleChangeInput}
        />
        <button
          disabled={loading}
          className="bg-slate-700  text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loadiing..." : "  Sign up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-4">
        <p>Alresdy,Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700  underline font-semibold ">
            Sign in
          </span>
        </Link>
      </div>
      {error && (
        <p className="text-red-600 font-semibold italic text-sm">{error}</p>
      )}
    </div>
  );
};

export default SignUp;
