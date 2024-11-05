import axios from "axios";
import './candidateSignupNew.css'
import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { FcAbout } from "react-icons/fc";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import Swal from "sweetalert2";
import Loading from "../../../Component/Loading/loading";
import ApiConstants from "../../../Services/apiconstants";

export default function CandidateSignup() {
    const { promiseInProgress } = usePromiseTracker();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const [setIsSubmitting] = useState(true);
    const [disable, setDisable] = useState(true);
    const [errorMessage, SetErrorMessage] = useState("")


    const onSubmit = (data) => {
        trackPromise(
            axios
                .post(ApiConstants.SIGNUP, {
                    fullname: data.fullname,
                    email: data.email,
                    password: data.password,
                    policyCheck:true
                })
                .then((response) => {
                    Swal.fire({
                        title: "Registration successful ",
                        html: "Please check your inbox for registration email from Skilltera and verify your email using the link provided in the email. Please  do check your spam folder in case you do not see the email in your inbox.",
                        icon: "success",
                        allowOutsideClick: true,
                        allowEscapeKey: true,
                        allowEnterKey: true,
                        confirmButtonText: "Ok",
                    });
                    reset();
                })
                .catch((error) => {

                    SetErrorMessage(error.response.data.error)

                    // if (error.message === "Request failed with status code 500") {
                    //   Swal.fire({
                    //     title: error.response.data.error,
                    //     icon: "info",
                    //     width: 400,
                    //     height: 100,
                    //   });
                    // }
                    //  else if (error.message === "Network Error") {
                    //   Swal.fire({
                    //     title: "Backend not connected",
                    //     icon: "info",
                    //     width: 400,
                    //     height: 100,
                    //   });
                    // }
                })
        );
    };

    const reCaptchaSubmit = (value) => {
        setIsSubmitting(false);
        setDisable(false)
    };

    //rak

    function showHint() {
        alert(
            "1. At least 8 characters \n 2. At least one special char \n 3. At least one number \n 4. At least one upper and one lower case char. \n "
        );
    }

    // ............clearInputFiled after filldata.....

    const formRef = useRef();


    return (
        <>
            {promiseInProgress === true ? (
                <Loading />
            ) : null}
            <div className='candidate-login-form'>
            <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
    <div className="modal-body">
        <div className="mb-1">
            <input
                type="text"
                className="form-control candidate-signup-form-control"
                id="formGroupExampleInput"
                placeholder="Full Name"
                {...register("fullname", { required: true, minLength: 3 })}
                onClick={() => SetErrorMessage("")}
            />
            {errors.fullname && (
                <p style={{ color: "red" }}>Enter valid name minimum 3 letters</p>
            )}
        </div>
        <div className="mb-1">
            <input
                type="email"
                className="form-control candidate-signup-form-control"
                id="exampleFormControlInput1"
                placeholder="E-mail"
                {...register("email", {
                    required: true,
                    pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: <p>Invalid Email</p>,
                    },
                })}
                onClick={() => SetErrorMessage("")}
            />
            {errors.email && (
                <p style={{ color: "red" }}>Enter the valid email</p>
            )}
        </div>
        <div className="mb-1">
            <input
                type="password"
                className="form-control candidate-signup-form-control"
                id="inputPassword"
                placeholder="Password"
                {...register("password", {
                    required: true,
                    pattern: { value: /^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$/ },
                })}
                onClick={() => SetErrorMessage("")}
            />
            {errors.password && (
                <p style={{ color: "red" }}>
                    Please enter the password{" "}
                    <button onClick={showHint} className="showHint">
                        {" "}
                        <FcAbout />
                    </button>{" "}
                </p>
            )}
        </div>
        <div className="mb-1">
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="policyCheck"
                    {...register("policyCheck", { required: true })}
                />
                <label className="form-check-label" htmlFor="policyCheck">
                    I agree to the{" "}
                    <a href="#" data-bs-toggle="modal" data-bs-target="#agreementModal">
                        terms and conditions
                    </a>
                </label>
            </div>
            {errors.checkbox && (
                <p style={{ color: "red" }}>You must agree to the terms and conditions</p>
            )}
        </div>
        <div className="mt-4 mb-1 d-flex justify-content-center">
            <ReCAPTCHA
                sitekey="6Lc1UbwfAAAAAFN7tTEMmUWZEQJ0Sxbr0HQ1SGiM"
                onChange={reCaptchaSubmit}
            />
        </div>
        <div className="d-flex justify-content-center mt-3">
            <button
                type="submit"
                className="candidate-signup-buttonSend"
                disabled={disable}
            >
                Signup
            </button>
        </div>
    </div>
    <div className="d-flex justify-content-center" style={{ color: "red" }}>
        {errorMessage}
    </div>
</form>

{/* agreementModal */}

<div className="modal fade" id="agreementModal" tabIndex="-1" aria-labelledby="agreementModalLabel" aria-hidden="true">
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="agreementModalLabel">Terms and Conditions</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <p>Here are the terms and conditions...</p>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

            </div>
        </>
    )
}