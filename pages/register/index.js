import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

const RegisterForm = () => {
  const supabaseClient = useSupabaseClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { mutate, isSuccess, isLoading, isError } = useMutation(async ({ email, password }) => {
    const { data, error } = await supabaseClient.auth.signUp({ email, password });

    if (error) {
      throw error;
    }

    return data;
  });

  function submit(data) {
    mutate({
      email: data.email,
      password: data.password,
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="w-full flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        E-Mail
        <input
          {...register("email", {
            required: "E-Mail is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          className="w-full input input-bordered"
          type="email"
          placeholder="E-Mail"
        />
        {errors.email && <span className="text-error">{errors.email.message}</span>}
      </label>
      <label className="flex flex-col gap-2">
        Password
        <input
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          className="w-full input input-bordered"
          type="password"
          placeholder="Password"
          required
        />
        {errors.password && <span className="text-error">{errors.password.message}</span>}
      </label>
      {isSuccess && (
        <div className="flex flex-col gap-0 justify-start items-start alert alert-success">
          <p className="font-bold">Success!</p>
          <p>Check your E-Mail for to confirm your registration.</p>
        </div>
      )}
      {isError && (
        <div className="flex flex-col gap-0 justify-start items-start alert alert-error">
          <p className="font-bold">Error!</p>
          <p>Something went wrong. Please try again.</p>
        </div>
      )}
      <div className="flex gap-2">
        <button className="btn btn-primary" type="submit" disabled={isLoading || isSuccess}>
          Sign Up
        </button>
      </div>
    </form>
  );
};

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <section className="flex flex-col gap-8 max-w-xl w-full bg-neutral p-8 rounded-lg">
        <header>
          <h1 className="text-xl font-bold">Register</h1>
        </header>
        <RegisterForm />
      </section>
    </div>
  );
};

export default RegisterPage;
