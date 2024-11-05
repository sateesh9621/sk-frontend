import React, { useContext, useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { NavLink, useNavigate } from "react-router-dom";
import Footer from "../../../Component/Footer/footer";
import Loading from "../../../Component/Loading/loading";
import { userContext } from "../../../Context/userContextState";
import ApiConstants from "../../../Services/apiconstants";
import Mixpanel from "../../../Services/mixpanel";
import "./loginRefNew.css";
import { Interceptor } from "../../../ErrorStatus/errorStatus";
import ForgetPasswordModal from '../../../Component/Forget Password Modal/forgetPasswordModal';
import { useDispatch } from 'react-redux';
import { selectSidebarMenuSelection } from '../../../Redux/Reducer/sidebarMenuSelectionSlice';
export default function LoginRefNew() {
    let { getData } = useContext(userContext)

    const { promiseInProgress } = usePromiseTracker();

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const [ setIsSubmitting] = useState(false);
   
    const [disable, setDisable] = useState(true);
    const [errorMessage, SetErrorMessage] = useState("")

    let navigate = useNavigate();
    const dispatch = useDispatch();

    const onSubmit = (data) => {
        Mixpanel("For Login Candidate", "Login Candidate Button")
        trackPromise(
            axios
                .post(ApiConstants.REFERAL_LOGIN, {
                    email: data.email,
                    password: data.password,
                })
                .then((response) => {


                    sessionStorage.setItem("candidate_data_ref", JSON.stringify(response.data));

                    sessionStorage.setItem("login", true);
                    sessionStorage.setItem("user_token", JSON.stringify(response.data.token))

                    // setisEmailVerified(response.data.candidate.isVerified);

                    sessionStorage.setItem("candidateDashboardRef", true);
                    dispatch(selectSidebarMenuSelection('referral'));
                    getData()
                    navigate("/refered")
                })
                .catch((error) => {

                    if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
                        Interceptor(error.response.status)
                    } else {
                        SetErrorMessage(error.response.data.error)
                    }
                })
        );
        reset();
    };





    const reCaptchaSubmit = (value) => {

        setIsSubmitting(false)

        setDisable(false)

    };
    const [disableModal, setDisableModal] = useState(false)
    const forgetPasswordModal = () => {
        setDisableModal(!disableModal);
    }


    return (
        <>
            {promiseInProgress === true ? (
                <Loading />
            ) : null}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="m-4">

                    <input
                        id="email"
                        className="form-control refer-form-control"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value:
                                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Entered value does not match email format",
                            },
                        })}
                        type="email"
                        placeholder="Email"
                        onClick={() => SetErrorMessage("")}
                    />
                    {errors.email && (
                        <span role="alert" style={{ color: "red" }}>
                            {errors.email.message}
                        </span>
                    )}
                </div>
                <div className="m-4">

                    <input
                        id="password"
                        className="form-control refer-form-control "
                        {...register("password", {
                            required: "Please Enter Password",
                        })}
                        type="password"
                        placeholder="Password"
                        onClick={() => SetErrorMessage("")}
                    />
                    {errors.password && (
                        <span role="alert" style={{ color: "red" }}>
                            {errors.password.message}
                        </span>
                    )}
                </div>

                <div className="d-flex flex-row-reverse">
  <p>
    <button 
      onClick={forgetPasswordModal} 
      style={{ 
        color: "var(--list-item-color)", 
        cursor: 'pointer', 
        background: 'none', 
        border: 'none', 
        padding: 0, 
        font: 'inherit',
        textDecoration: 'underline'
      }} 
      role="link" 
      aria-label="Forgot password?"
    >
      Forgot password?
    </button>
  </p>
</div>


                <div className="mt-2 mb-1 d-flex justify-content-center">
                    <ReCAPTCHA
                        sitekey="6Lc1UbwfAAAAAFN7tTEMmUWZEQJ0Sxbr0HQ1SGiM"
                        onChange={reCaptchaSubmit}
                    />
                </div>

                <div className="d-flex justify-content-center mt-3">


                    <button className="refer-buttonSend" type="submit"
                        disabled={disable}>
                        Log In
                    </button>

                </div>

                <div className="d-flex justify-content-center" style={{ color: "red" }}>

                    <p>  {errorMessage}
                        <NavLink to="/referalEmailVerification">
                            {errorMessage.length > 95 ?
                                <span style={{ color: "#6e4dcd" }}> <u> or Click Here to receive verification email again. </u></span>
                                : ""}
                        </NavLink>
                    </p>
                </div>
            </form>
            {disableModal && <ForgetPasswordModal disableModal={disableModal} onClose={() => setDisableModal(false)} />}
        </>
    )
}