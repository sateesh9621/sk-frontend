import React, { useEffect, useState } from 'react'
import Footer from '../../Component/Footer/footer'
import './recommendation.css'
import { useParams } from "react-router-dom";
import axios from 'axios'
import ApiConstants from '../../Services/apiconstants'
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { checkIfUrlsAreSame, subString } from "../../UtilitiesFunctions/utilitiesFunction"
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import Loading from "../../Component/Loading/loading";
import { Interceptor } from '../../ErrorStatus/errorStatus'
import NavBarNew from '../../Component/NavBar New/navBarNew'
import uesrImageDefault from "../../Assets/profilePic.png";
import { Rating } from 'react-simple-star-rating'




const Recommendation = () => {

  const { uniqueId } = useParams();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [recommendedCandidate, setRecommendedCandidate] = useState([{}]);
  const [invalidPage, setInvalidPage] = useState(false);
  const [finalSkill, SetFinalSkill] = useState([{}]);
  const [errorMsg, setErrorMsg] = useState("")
  const { promiseInProgress } = usePromiseTracker();


  const getRecommendedData = async () => {
    await axios
      .get(ApiConstants.RECOMMENDATION_VERIFY + uniqueId,
        {
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": true,
            "Access-Control-Allow-Methods": "GET, POST, PATCH",
          }
        })
      .then((response) => {
        setRecommendedCandidate(response.data.recommendation)
        SetFinalSkill(response.data.recommendation.skills)
      })
      .catch((error) => {

        if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {


          Interceptor(error.response.status)
        } else {

          setInvalidPage(true)
        }

      });
  }

  useEffect(() => {
    getRecommendedData()
  }, [])

  const ratingChanged = (rate, idx) => {
    const label = 'rating'
    const newValue = rate

    console.log(rate)

    SetFinalSkill([
      ...finalSkill.slice(0, idx),
      {
        ...finalSkill[idx],
        [label]: newValue,
      },
      ...finalSkill.slice(idx + 1),
    ])
    // SetFinalSkill(finalSkill => [...finalSkill, { skill: skill, rating: rate }])
  }

  //Changes

  const onSubmit = (data) => {

    let ratingChecked = finalSkill.map(item => {
      // item.some(obj => obj.hasOwnProperty("rating"))
      if (item.hasOwnProperty("rating") == false) {
        setErrorMsg("Please rate all the skills")
        return false
      }
      return true
    })

    let linkedInUrlCheck = true

    if (checkIfUrlsAreSame(recommendedCandidate.requesterLinkedInUrl, data.recommenderLinkedinUrl)) {
      setErrorMsg("Recommender's LinkedIn Url can not be same as candidate's url")
      linkedInUrlCheck = false
    }

    let ratingFlag = ratingChecked.every(Boolean);

    if (ratingFlag && linkedInUrlCheck) {
      trackPromise(
        axios
          .post(ApiConstants.POST_RECOMMENDATION_VERIFY + uniqueId, {
            commentsByRecommender: data.recommenderComments,
            skills: finalSkill,
            code: (data.otp).replace(/\s/g, ""),
            linkedInUrl: data.recommenderLinkedinUrl
          },
            {
              headers: {
                Accept: "application/json",
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": true,
                "Access-Control-Allow-Methods": "GET, POST, PATCH",
              }
            })
          .then((response) => {
            Swal.fire({
              title: response.data.message,
              icon: "success",
              width: 400,
              height: 100,
            });
            setTimeout(() => {
              window.location.href = '/'
            }, 4000)

          })
          .catch((error) => {
            Swal.fire({
              title: error.response.data.error,
              icon: "error",
              width: 400,
              height: 100,
            });

          })
      )
    }
  };

  useEffect(() => {
    const manageOutSideClick = (event) => {
      setErrorMsg("")
    }
    document.addEventListener("click", manageOutSideClick)
    return () => {
      document.removeEventListener("click", manageOutSideClick)
    }
  }, [])

  return (
    <>
      <NavBarNew />
      {promiseInProgress === true ? <Loading /> : null}
      {invalidPage && <div>
        <h1 className='mt-5' style={{ textAlign: 'center' }}>Invalid Url </h1>
      </div>}


      {!invalidPage && <div className="container-md  w-md-75 mt-5   ">

        <div className="row rounded-3 recommendationHeader mb-1">
          <p className="fs-4 mt-3 ml-3">Fill Recommendation Details</p>
        </div>

        <div className="row  rounded-3 recommendationBody">

          <div className="col-md-6 col-sm-6 mt-3 d-flex justify-content-center ">
            <div>

              <img
                src={recommendedCandidate?.requesterImage ? recommendedCandidate?.requesterImage : uesrImageDefault}
                className="rounded-circle " alt="..." height="100" width="100"  />
                
            </div>
          </div>


          <div className="col-md-6 col-sm-6 mt-3  d-flex justify-content-center ">
            <div>
              <p className="fs-6 mt-6 text-start">Name of requester: {recommendedCandidate.recommenderName} </p>
              <p className="fs-6 mt-6 text-start">Email address of requester:{recommendedCandidate.requesterEmail}  </p>
              <p className="fs-6 mt-6 text-start">
                Requester Linkedin URL:
                <a
                  href={recommendedCandidate.requesterLinkedInUrl}
                  target="_blank"
                  className="m-1"
                  style={{ color: "rgb(128, 27, 211)" }}
                >
                  <u>{subString(recommendedCandidate.requesterLinkedInUrl, 27)} </u>
                </a>
              </p>
            </div>
          </div>

          <div className="row p-5 ">
            <p className="h5 text-start">Skills you have to rate </p>
            {/* Need to map this */}

            <div className="d-flex justify-content-between mt-5 mb-4 row">

              {Object.keys(recommendedCandidate).length > 1 ? recommendedCandidate.skills.map((item, i) => {
                return (
                  <>
                    <div key={i} className="col-md-4 col-sm-4 ml-5 ">
                      <span> <b>{item.skillId.skill}</b> </span>
                    </div>
                    <div className="col-md-8 col-sm-8">
                      <div className="d-flex justify-content-end row">
                        <div className="col-md-6 col-sm-6">
                          <span>Recommender Rating </span>
                        </div>
                        <div className="col-md-6 col-sm-6">
                          <Rating id={i} initialValue={0} onClick={(rate) => ratingChanged(rate, i)} fillColor='#4B2DFF'
                            size='23px' />
                        </div>
                      </div>
                    </div>
                  </>
                )

              }) : <p>No skill Found</p>}


            </div>
            <hr></hr>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='row'>
              <div className='col'>
                <div className="mb-3">
                  <label className="text-start form-label">Recommender’s Linkedin URL</label>
                  <input type="url" className="form-control" id="exampleFormControlInput1"
                    {...register("recommenderLinkedinUrl", {
                      required: "LinkedIn url is required",
                      pattern: {
                    
                        message: "Enter valid LinkedIn url",
                      },
                    })} />
                  {errors.recommenderLinkedinUrl && (
                    <span role="alert" style={{ color: "red" }}>
                      {errors.recommenderLinkedinUrl.message}
                    </span>
                  )}
                </div>
              </div>
              <div className='col'>
                <div className="mb-3">
                  <label className="form-label text-start" htmlFor="otpInput" >Enter OTP, Sent to you your email</label>
                  <input type="text" className="form-control" id="otpInput"
                    {...register("otp", {
                      required: true,
                      // pattern: {
                      //   value: /(^\s+|\s+$)/,
                      //   message: "Remove whitespaces",
                      // },
                    })} />
                  {errors.otp?.type === 'required' && <span style={{ color: "red" }}>OTP is required</span>}
                  {errors.otp && (
                    <span role="alert" style={{ color: "red" }}>
                      {errors.otp.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label text-start" htmlFor="recommenderComments">Your Recommendation Comments</label>
              <textarea minLength="15" className="form-control" id="recommenderComments" rows="3" {...register("recommenderComments", { required: true })}></textarea>
              {errors.recommenderComments?.type === 'required' && <span style={{ color: "red" }}>Your Recommendation Comments is required</span>}
            </div>
            <div className="d-flex justify-content-center m-3">

              <button className="buttonSend me-md-2 shadow" type="submit">
                Submit
              </button>
            </div>
            <p className="text-center fs-6 mt-3" style={{ color: "red" }}>
              {errorMsg}
            </p>
          </form>
        </div>
      </div>}

      <div className="row recomFoot">
        <Footer />
      </div>

    </>
  )
}

export default Recommendation
