import axios from "axios";
import './signupRefNew.css'
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { FcAbout } from "react-icons/fc";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../../Component/Loading/loading";
import ApiConstants from "../../../Services/apiconstants";
import Mixpanel from '../../../Services/mixpanel';
import { Interceptor } from "../../../ErrorStatus/errorStatus";

export default function SignupRefNew() {
    const { promiseInProgress } = usePromiseTracker();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();
    const [ setIsSubmitting] = useState(true);
   
    const [disable, setDisable] = useState(true);
    const [errorMessage, SetErrorMessage] = useState("")


    const onSubmit = (data) => {
        Mixpanel("Signed up as an External Referrer", "Sign Up Button", '', '', data.email)
        trackPromise(
            axios
                .post(ApiConstants.REFERAL_SIGNUP, {
                    fullname: data.fullname,
                    email: data.email,
                    password: data.password,
                })
                .then((response) => {
                  
                    Swal.fire({
                        html: "Thanks for registering. Please check your inbox for registration email and verify your email. After verifying your email you can begin referring candidates.",
                        title: "Please Verify your Email",
                        icon: "success",

                        allowOutsideClick: true,
                        allowEscapeKey: true,
                        allowEnterKey: true,
                        confirmButtonText: "Ok",

                    });
                    reset();
                })
                .catch((error) => {
                    if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {


                        Interceptor(error.response.status)
                    } else {

                        SetErrorMessage(error.response.data.error)
                    }
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
            <form onSubmit={handleSubmit(onSubmit)} ref={formRef} >
                <div className="modal-body">
                    <div className="mb-1">

                        <input
                            type="text"
                            className="form-control refer-signup-form-control"
                            id="formGroupExampleInput"
                            placeholder="Full Name"
                            {...register("fullname", { required: true, minLength: 3 })}
                            onClick={() => SetErrorMessage("")}
                        />
                        {errors.fullname && (
                            <p style={{ color: "red" }}>Enter valid name minimum 3 letters</p>
                        )}
                        {/* <p style={{ 'color': 'red' }}>{errors.fullname?.type === 'required' && "Full Name is required"}</p> */}
                    </div>
                    <div className="mb-1">

                        <input
                            type="email"
                            className="form-control refer-signup-form-control"
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
                        {/* <p style={{ 'color': 'red' }}>{errors.email?.type === 'required' && "Email is required"}</p> */}
                    </div>
                    <div className="mb-1">

                        <input
                            type="password"
                            className="form-control refer-signup-form-control"
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

                        {/* <p style={{ 'color': 'red' }}>{errors.password?.type === 'required' && "Password is required"}</p> */}
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
                            className="refer-signup-buttonSend"
                            disabled={disable}
                        >
                            Sign up
                        </button>
                    </div>
                </div>

                <div className="d-flex justify-content-center" style={{ color: "red" }}>
                    {errorMessage}
                </div>

            </form>
        </>
    )
}