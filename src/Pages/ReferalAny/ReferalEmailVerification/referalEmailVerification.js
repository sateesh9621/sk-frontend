import axios from "axios";
import React, { useContext, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { trackPromise, usePromiseTracker } from "react-promise-tracker"
import Footer from "../../../Component/Footer/footer";
import Loading from "../../../Component/Loading/loading";
import ApiConstants from "../../../Services/apiconstants";
import { Interceptor } from "../../../ErrorStatus/errorStatus";
import NavBarNew from "../../../Component/NavBar New/navBarNew";

const ReferalEmailVerification = () => {

  const { promiseInProgress } = usePromiseTracker();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [ setIsSubmitting] = useState(false);

  const [disable, setDisable] = useState(true);
  const [errorMessage, SetErrorMessage] = useState("")
  const [successMsg, setSuccessMsg] = useState("")





  const onSubmit = (data) => {

    trackPromise(
      axios
        .post(ApiConstants.EMAIL_VERIFICATION, {
          email: data.email,
        })
        .then((response) => {

          setSuccessMsg(response.data.message)

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



  return (
    <>
      <NavBarNew />
      {promiseInProgress === true ? (
        <Loading />
      ) : null}

      <div className="main-box login">
        <h2 className="d-flex justify-content-center">Resend email verification link </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="m-4">

            <input
              id="email"
              className="form-control border-top-0 border-left-0 border-right-0"
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



          <div className="mt-2 mb-1 d-flex justify-content-center">
            <ReCAPTCHA
              sitekey="6Lc1UbwfAAAAAFN7tTEMmUWZEQJ0Sxbr0HQ1SGiM"
              onChange={reCaptchaSubmit}
            />
          </div>

          <div className="d-flex justify-content-center mt-3">
            <button className="buttonSend" type="submit" disabled={disable} >
              Send
            </button>
          </div>

          <div className="d-flex justify-content-center mt-4" style={{ color: "green" }}>
            {successMsg}
          </div>

          <div className="d-flex justify-content-center mt-4" style={{ color: "red" }}>
            {errorMessage}
          </div>
        </form>
      </div>

      <div className="row loginFoot">
        <Footer />
      </div>

    </>
  );
};

export default ReferalEmailVerification;
