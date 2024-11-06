import axios from "axios";
import $ from "jquery";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsLinkedin, BsPlusCircle, BsSearch } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";

import Loading from "../../../Component/Loading/loading";

import { userContext } from "../../../Context/userContextState";
import TabSet from '../../../Component/Tabsets/tabSet';
import ApiConstants from "../../../Services/apiconstants";
import { checkIfUrlsAreSame, numberOfSkill, subString, subStringDescription, trimString } from "../../../UtilitiesFunctions/utilitiesFunction";
import RecievedRecomm from "./RecievedRecomm/recievedRecomm";
import ApprovedRecomm from "./ApprovedRecomm/approvedRecomm";
import "./recommendation.css";
import { Interceptor } from "../../../ErrorStatus/errorStatus";



const RecommendationCard = () => {

  const { userData, getData } = useContext(userContext)

 
  const { promiseInProgress } = usePromiseTracker();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();


  if (sessionStorage.getItem('candidate_data') != null) {
    var candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data"))
    var token = candidateDataMix.token;
    var userId = candidateDataMix.candidate._id;
  }

  if (sessionStorage.getItem('candidate_data_ref') != null) {
    var candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data_ref"))
    var token = candidateDataMix.token;
    var userId = candidateDataMix.candidate._id;
  }

  const [recommendations, setRecommendation] = useState([])
  const [addSkill, SetAddSkill] = useState([]);
  
  const [recommendationRequestMsg, setRecommendationRequestMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  
  const [recommendationData, setRecommendationData] = useState([])
  const [receivedRecommendation, setReceivedRecommendation] = useState([])
  const [approvedRecommendation , setApprovedRecommendation] = useState([])
  const [requestedRecommendation, setRequestedRecommendation] = useState([])
  const [candidateLinkedInUrl, setCandidateLinkedInUrl] = useState();



  const addNewSkill = (data) => {
    const newData = data.split(',')

    SetAddSkill(addSkill => [...addSkill, { skillId: newData[0], skill: newData[1], rating: 0 }])

  }


  const handleRemoveItem = (i) => {

    SetAddSkill(addSkill.filter(item => item.skill !== i));
 
  }

  const onSubmit = (data) => {
    if (!(checkIfUrlsAreSame(candidateLinkedInUrl, data.recommenderLinkedInUrl))) {
      trackPromise(

        axios.post(
          ApiConstants.CAND_RECOMMENDATION,
          {
            connectionType: data.connectionType,
            messageByRequester: data.messageByRequester,
            recommenderEmail: trimString(data.recommenderEmail),
            recommenderLinkedInUrl: data.recommenderLinkedInUrl,
            recommenderName: data.recommenderName,
            skills: addSkill,
          },
          {
            headers: {
              Accept: "application/json",
              "Content-type": "application/json",
              token: token,
              _id: userId,
              "Access-Control-Allow-Origin": true,
              "Access-Control-Allow-Methods": "GET, POST, PATCH",
            },
          }
        )
          .then((response) => {
            setRecommendationRequestMsg("Your recommendation request has been sent. Please follow-up with recommender to get the recommendation.")

            setRecommendation([...recommendations, response.data.recommendation])
            setRecommendationData([...recommendationData, response.data.recommendation])
            setRequestedRecommendation(requestedRecommendation => [...requestedRecommendation, response.data.recommendation])
                  


            setTimeout(() => {
              $("[data-dismiss=modal]").trigger({ type: "click" })
            }, 1000)
            reset()
            getData()

          }).catch((error) => {
            if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
              Interceptor(error.response.status)
            } else {

              setErrorMsg(error.response.data.error)
            }
          })
      )
    } else {
      setErrorMsg("Recommender's LinkedIn Url can not be same as candidate's LinkedIn url ")
    }

  }

  const getRecommendation = () => {
    axios.get(ApiConstants.GET_ALL_RECOMMENDATION, {
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        token: token,
        _id: userId,
        "Access-Control-Allow-Origin": true,
        "Access-Control-Allow-Methods": "GET, POST, PATCH",
      },
    }).then(res => {
      //console.log(res)
      setRecommendationData(res.data.recommendation)
      res.data.recommendation.map(e => {
        if (e.status === "REQUESTED") {
          setRequestedRecommendation([...requestedRecommendation, e])
        }
        if (e.status === "RECIEVED") {
          setReceivedRecommendation( [...receivedRecommendation, e])
        }
        if (e.status === "APPROVED") {
          setApprovedRecommendation([...approvedRecommendation, e])
        }
      })
    }).catch(err => {
      console.log(err)
    })
  }

  // message remove after response START

  useEffect(() => {
    const manageOutSideClick = (event) => {
      setErrorMsg("")
      setRecommendationRequestMsg("")
    }
    document.addEventListener("click", manageOutSideClick)
    return () => {
      document.removeEventListener("click", manageOutSideClick)
    }
  }, [])

  // message remove after response END

  useEffect(() => {
    getRecommendation();

    if (userData.length != 0) {
      setRecommendation(userData[0].candidate.recommendations)
      setCandidateLinkedInUrl(userData[0].candidate.linkedInUrl)
      setRecommendationData(userData[0].candidate.recommendations)
      userData[0].candidate.recommendations.map(e => {
        if (e.status === "REQUESTED") {
          setRequestedRecommendation([...requestedRecommendation, e])
        }
        if (e.status === "RECIEVED") {
          setReceivedRecommendation( [...receivedRecommendation, e])
        }
        if (e.status === "APPROVED") {
          setApprovedRecommendation([...approvedRecommendation, e])
        }
      })
    
    }
  }, [])

  const dialogBox = () => {
    getData()
    if (userData.length != 0) {
      // userData[0].candidate.skills.map(item => {
      //   SetAddSkill(addSkill => [...addSkill, { skillId: item.skillId._id, skill: item.skillId.skill }])
      // })

      const uniqueSkills = new Set(userData[0].candidate.skills.map(item => ({
        skillId: item.skillId._id,
        skill: item.skillId.skill
      })))


      SetAddSkill([...uniqueSkills])
      // for (let item of uniqueData) {
      //   SetAddSkill(addSkill => [...addSkill, { skillId: item.skillId._id, skill: item.skillId.skill }])
      // }
    }

  }

  // const handleButtonClick = (button) => {
  //   setSelectedButton(button);
  // };
  // const getButtonStyle = (button) => {
  //   return button === selectedButton
  //     ? { backgroundColor: 'var(--list-item-color)', color: 'white', border: '0px' }
  //     : {};
  // };


  return (
    <>
      {/* Recommendation */}

      <div className="card mb-3 candidate-global-section">
        <div className="card-body">

          <div className="d-flex justify-content-between ">

            <span style={{ fontWeight: "500", fontSize: "20px", color: "#444444" }}> <b> Recommendation</b></span>

            <button type="button" onClick={dialogBox} className="btn edtBtn" data-toggle="modal" data-target=".recommendation">
              <BsPlusCircle />
            </button>
          </div>


          {recommendationData.length === 0 ? <div>

            {/* before recommendation START */}

            <div className="d-flex justify-content-center mt-3">
              <BsSearch size={30} style={{ color: 'var(--list-item-color)' }} />
            </div>
            <div className="d-flex justify-content-center mt-3">
              <button type="button" onClick={dialogBox} style={{ background: 'var(--list-item-color)', width: '280px' }} className="btn buttonSend p-1" data-toggle="modal" data-target=".recommendation">
                Request for a Recommendation
              </button>
            </div>
            {/* after recommendation END */}
          </div> : <TabSet>
            <div label="Received">
              <RecievedRecomm recommendationData={receivedRecommendation} />
            </div>
            <div label="Requested">
              {requestedRecommendation.length > 0 ?
                requestedRecommendation.map((e) => {
                  if (e.status === "REQUESTED") {
                    return (
                      <div className="d-flex justify-content-between mt-3" key={e._id}>
                        <div>
                          <span
                            style={{
                              fontWeight: "500",
                              fontSize: "1rem",
                              color: "#444444",
                            }}
                            className="m-2"
                          >
                            {e.recommenderName}
                          </span>
                          <span style={{ color: "red" }}>  <a href={e.recommenderLinkedInUrl} target="blank" style={{ fontSize: "12px", color: "rgb(128, 27, 211)" }}  >    <span style={{ color: "rgb(128, 27, 211)" }}><BsLinkedin /> <u>{subString(e.recommenderLinkedInUrl, 27)} </u></span> </a> </span>

                          <div className="mx-2 mt-2" style={{ fontSize: "12px" }}> Skills :
                            {e.skills.length > 0 ?

                              e.skills.map((x) => {
                                return (<span style={{ fontSize: "12px" }}> {x.skillId.skill} &#44; </span>)
                              }) : " "}

                          </div>

                          <span className="mx-2" style={{ fontSize: "12px" }}>Description : </span>
                          <span className="mx-2" style={{ fontSize: "12px" }}> {subStringDescription(e.messageByRequester, 0, 50)} </span>
                        </div>


                        <div>
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            data-toggle="modal"
                            data-target={".requested" + `${e._id}`}
                            style={{ fontSize: "12px", position: 'relative', width: '100px' }}
                          >
                            view more
                          </button>
                        </div>

                        <div
                          className={"modal fade requested" + `${e._id}`}
                          tabindex="-1"
                          role="dialog"
                          aria-labelledby="exampleModalCenterTitle"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                            <div className="modal-content modalContent">
                              <div className="modal-header">
                                <p className="modal-title mx-3" id="exampleModalLongTitle">
                                  Recommendation Details
                                </p>
                                <button
                                  type="button"
                                  className="btn"
                                  data-dismiss="modal"
                                  aria-label="Close"
                                >
                                  <AiOutlineCloseCircle />
                                </button>
                              </div>

                              <div className="modal-body">
                                <div className="row mx-2  " >
                                  <div className="col-md-6" > <p className="text-start" style={{ fontSize: "1.1rem", color: "#6F6F6F" }}>Name </p> </div>
                                  <div className="col-md-6" > <p className="text-start" style={{ fontSize: "1.1rem" }}>
                                    {e.recommenderName}
                                  </p> </div>
                                </div>

                                <div className="row mx-2" >
                                  <div className="col-md-6" > <p className="text-start" style={{ fontSize: "1.1rem", color: "#6F6F6F" }}>LinkedIn URL </p> </div>
                                  <div className="col-md-6" > <a href={e.requesterLinkedInUrl} target="_blank" className="text-start" style={{ fontSize: "1.1rem", color: "rgb(128, 27, 211)" }} >
                                    {e.recommenderLinkedInUrl}
                                  </a> </div>
                                </div>

                                <div className="row  mx-2" >
                                  <div className="col-md-6" > <p className="text-start" style={{ fontSize: "1.1rem", color: "#6F6F6F" }}>Email address </p> </div>
                                  <div className="col-md-6" > <p className="text-start" style={{ fontSize: "1.1rem" }}>
                                    {e.recommenderEmail}
                                  </p> </div>
                                </div>

                                <p className="mt-3 mb-3 mx-4"> <b> Skill Rating </b> </p>



                                {e.skills.length > 0 ?

                                  e.skills.map((x) => {

                                    return (
                                      <div key={x._id} className="mx-4" >
                                        <div className="d-flex justify-content-between mt-2">

                                          <div className=""> <span>{x.skillId.skill} </span> </div>

                                          {/* <div className="">
                                                <StarRating rating={x.rating} />
                                              </div> */}

                                        </div>
                                        <hr></hr>
                                      </div>
                                    )
                                  }) : " "}

                                <p className="mt-3 mb-1 mx-4"> <b>Requester Note  </b> </p>

                                <p className="mx-4"> {e.messageByRequester}  </p>

                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }

                }) : "No Requested Recommendation Yet"}
            </div>
           
            <div label="Approved">
             
              {approvedRecommendation.length >0 ?
               
              approvedRecommendation.map((x) => {
                return(
                  <div key={x._id}>
                  <ApprovedRecomm {...x} />
                  </div>

                )
              })
              :""}
            </div>
          </TabSet>

          }

          <div className="modal fade recommendation" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
              <div className="modal-content modalContent">

                <div className="modal-header">
                  <p className="modal-title  " id="exampleModalLongTitle">Request for recommendation  </p>
                  <button type="button" className="btn" data-dismiss="modal" aria-label="Close">
                    <AiOutlineCloseCircle />
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {promiseInProgress === true ? <Loading /> : null}
                    <div className="container-fluid">
                      {/* <span className="" >Add Detail </span> */}
                      <div className="col-md-12 col-sm-12 mt-3 mb-0 ">
                        <span className="mb-2" > Recommender’s Name* </span>
                        <input
                          type="text"
                          className="form-control"
                          name="recommenderName"
                          {...register("recommenderName")}
                          required
                        />
                      </div>
                      <div className="col-md-12 col-sm-12 mt-3 mb-0 ">
                        <span className="mb-2" >  Recommender’s email address* </span>
                        <input
                          type="text"
                          className="form-control"
                          id=""
                          required
                          name="recommenderEmail"
                          {...register("recommenderEmail")}
                        />
                      </div>

                      <div className="col-md-12 col-sm-12 mt-3 mb-0 ">
                        <span className="mb-2" >  Recommender’s Linkedin URL* </span>
                        <input
                          type="url"
                          className="form-control"
                          id=""
                          required
                          name="recommenderLinkedInUrl"
                          {...register("recommenderLinkedInUrl", {
                            required: "LinkedIn url is required",
                            pattern: {
                              value: /^(https?:\/\/)?((www|\w\w)\.)?linkedin.com\/((in\/[a-zA-Z0-9-]+)|(company\/[a-zA-Z0-9-]+)|(school\/[a-zA-Z0-9-]+))\/?$/,
                              message: "Enter valid LinkedIn url",
                            },
                          })}
                        />
                        {errors.recommenderLinkedInUrl && (
                          <span role="alert" style={{ color: "red" }}>
                            {errors.recommenderLinkedInUrl.message}
                          </span>
                        )}
                      </div>

                      <div className="col-md-12 col-sm-12 mt-3 mb-0 ">

                        <div className="col-md-12 col-sm-12 ">
                          <label htmlFor="connectionType" >How do you know the Recommender ?* </label>
                          <select id="connectionType" className="form-control" {...register("connectionType")} required>

                            <option value="I know as a Colleague"> I know as a Colleague</option>
                            <option value="I know as a Manager"> I know as a Manager </option>
                            <option value="I know as a Client">I know as a Client</option>
                            <option value="I know as a Friend who I know very well">I know as a Friend who I know very well</option>
                          </select>
                        </div>

                      </div>
                      <div className="col-md-12 col-sm-12 mt-3  ">
                        {/* add Skill using star rating ,input tag, experince START */}

                        <span className="mb-2" > Add Your Skills that recommender can rate </span>
                       
                        {
                          addSkill.length > 0
                            ? <div className="border">
                              {addSkill.map((e) => {
                                return (
                                  <>
                                    <div className='d-flex justify-content-between m-3' key={e._id}>
                                      <div >
                                        <span className='same-formating'>{e.skill}</span>
                                      </div>
                                      <div>
                                        <MdDelete size={25} onClick={() => handleRemoveItem(e.skill)} style={{ 'cursor': 'pointer' }} />
                                      </div>
                                    </div>
                                  </>
                                )
                              })}
                            </div>
                            : ''
                        }

                      </div>

                      <div className="col-md-12 col-sm-12 mt-3 ">
                        <span className="mb-2" >Message to recommender* </span>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="4"
                          placeholder="Write a note to the recommender."
                          name="messageByRequester"
                          {...register("messageByRequester")}
                          required
                        ></textarea>
                        <p style={{ textAlign: "right" }}> 0/500</p>
                      </div>

                      <div className="d-flex justify-content-center mt-3">
                        <button
                          type="submit"
                          className="buttonSend me-md-2 "
                          style={{ background: 'var(list-item-color)' }}
                        >
                          Send
                        </button>
                      </div>
                    </div>

                    <p className="text-center fs-6 mt-3" style={{ color: "green" }}>
                      {recommendationRequestMsg}
                    </p>

                    <p className="text-center fs-6 mt-3" style={{ color: "red" }}>
                      {errorMsg}
                    </p>
                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RecommendationCard