import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import ApiConstants from "../../../Services/apiconstants";
import Swal from "sweetalert2";
import "./candidateSignup.css";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import Loading from "../../../Component/Loading/loading";
import { Interceptor } from "../../../ErrorStatus/errorStatus"

export default function CandidateSignup() {
  const { promiseInProgress } = usePromiseTracker();
  const formRef = useRef();


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [id, setId] = useState("");
  const [token, setToken] = useState("");
  useEffect(() => {
    setId(JSON.parse(sessionStorage.getItem("ADMIN")).admin._id);
    setToken(JSON.parse(sessionStorage.getItem("ADMIN")).token);
  }, []);
  const onSubmit = (data) => {

    trackPromise(
      axios
        .post(
          ApiConstants.ADMIN_CANDIDATE_SIGNUP,
          {
            email: data.email,
            password: data.password,
            fullname: data.fullName,
          },
          {
            headers: {
              Accept: "application/json",
              "Content-type": "application/json",
              token: token,
              _id: id,
              "Access-Control-Allow-Origin": true,
              "Access-Control-Allow-Methods": "GET, POST, PATCH",
            },
          }
        )
        .then((response) => {
          Swal.fire({
            title: response.data.message,
            icon: "success",
            width: 400,
            height: 100,
          });
          reset();
        })
        .catch((error) => {
          if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
            Interceptor(error.response.status)
          }
        })
    );
  };
  return (
    <>
      <div className="main-box-admin-candidate">
        {promiseInProgress === true ? (
          <Loading />
        ) : null}
        <h2 className="d-flex justify-content-center">
          Candidate Admin Signup
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
          <div className="mb-3">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              className="form-control border-top-0 border-left-0 border-right-0"
              placeholder="Full Name"
              {...register("fullName", {
                required: true,
                message: <p>Invalid Full Name</p>,
              })}
            />
            {errors.fullName && (
              <p style={{ color: "red" }}>Enter the valid Full Name</p>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="email" >Email address</label>
            <input
              id="email"
              type="email"
              className="form-control border-top-0 border-left-0 border-right-0"
              placeholder="Email"
              {...register("email", {
                required: true,
                pattern: {
                  value:
                   /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Entered value does not match email format",
                },
              })}
            />
            {errors.email && (
              <p style={{ color: "red" }}>Enter the valid email </p>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="password" >Password</label>
            <input
              id="password"
              type="password"
              className="form-control border-top-0 border-left-0 border-right-0"
              placeholder="Password"
              {...register("password", {
                required: true,
                pattern: { value: /^(?=.*?[A-Za-z])(?=.*?\d).{6,}$/ },
              })}
            />
            {errors.password && (
              <p style={{ color: "red" }}>Enter the strong password </p>
            )}

            {/* <p style={{ 'color': 'red' }}>  {errors.password?.type === 'required' && "Password is required" }  </p> */}
          </div>
          <div className="row mt-2 ml-2">
            <button type="submit" className="btn btn-primary" >
              Create
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
