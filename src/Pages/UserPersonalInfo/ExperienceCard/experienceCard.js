import axios from "axios";
import $ from "jquery";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineCloseCircle } from "react-icons/ai";
import {

  BsPlusCircle
} from "react-icons/bs";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import Swal from "sweetalert2";
import Loading from "../../../Component/Loading/loading";
import { userContext } from "../../../Context/userContextState";
import ApiConstants from "../../../Services/apiconstants";
import Mixpanel from "../../../Services/mixpanel";
import UpdDelExp from "./UpdDelExp/updDelExp";
import { Interceptor } from "../../../ErrorStatus/errorStatus";


const ExperienceCard = () => {

  const { userData } = useContext(userContext)

  if (sessionStorage.getItem('candidate_data') != null) {
    const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data"))
    // var mixpanelData = candidateDataMix.candidate.email;
    var token = candidateDataMix.token;
    var userId = candidateDataMix.candidate._id;
    var candidateEmailId = candidateDataMix.candidate.email;
  }

  if (sessionStorage.getItem('candidate_data_ref') != null) {
    const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data_ref"))
    // var mixpanelData = candidateDataMix.candidate.email;
    var token = candidateDataMix.token;
    var userId = candidateDataMix.candidate._id;
    var candidateEmailId = candidateDataMix.candidate.email;

  }

  const { promiseInProgress } = usePromiseTracker();

  const {
    handleSubmit,
    formState: {}
  } = useForm();

  // Experience Axios Section Start

  const [successMessageAddExperience, setSuccessMessageAddExperience] = useState("");
  const [experienceData, setExperienceData] = useState([])
  const [workingStatus, setWorkingStatus] = useState(false)


  const [formValue, setformValue] = React.useState({

    company: "",
    designation: "",
    startDate: "",
    endDate: "",
    description: "",
    isThisCurrentCompany: ""

  })

  const handleChange = (event) => {

    setformValue({
      ...formValue,
      [event.target.name]: event.target.value
    })

  }

  const onSubmitAddExperience = () => {
    Mixpanel('Candidate Added Experience in Professional info', 'Save Button', candidateEmailId)

    trackPromise(
      axios
        .post(
          ApiConstants.ADD_EXPERIENCE,
          {
            company: formValue.company,
            designation: formValue.designation,
            startDate: formValue.startDate,
            endDate: formValue.endDate,
            description: formValue.description
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
          setSuccessMessageAddExperience(response.data.message);
          setExperienceData([...experienceData, response.data.experience])

          setformValue({
            company: "",
            designation: "",
            startDate: "",
            endDate: "",
            description: ""
          })
          setTimeout(() => {
            $("[data-dismiss=modal]").trigger({ type: "click" })
          }, 1000)


        })
        .catch((error) => {

          if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
            Interceptor(error.response.status)
          }

        })
    );
  };


  useEffect(() => {
    if (userData != 0) {
      setExperienceData(userData[0].candidate.experience)
    }
  }, [])

  useEffect(() => {
    const manageOutSideClick = (event) => {
      setSuccessMessageAddExperience("")

    }
    document.addEventListener("click", manageOutSideClick)
    return () => {
      document.removeEventListener("click", manageOutSideClick)
    }
  }, [])




  return (
    <>

      {/* Experience */}

      <div className="card mb-3 candidate-global-section" >
        <div className="card-body">

          <div className="d-flex justify-content-between ">
            <span style={{ fontWeight: "500", fontSize: "20px", color: "#444444", lineHeight: "23.44px" }}> <b> Experience</b></span>
            <button type="button" className="btn edtBtn" data-toggle="modal" data-target=".experienceAdd">
              <BsPlusCircle />
            </button>
          </div>
          <div className="d-flex justify-content-between ">

            {/* ADD EXPERIENCE */}
            <div className="modal fade experienceAdd" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-lg">
                <div className="modal-content modalContent">

                  <div className="modal-header">
                    <p className="modal-title  " id="exampleModalLongTitle"
                      style={{
                        fontWeight: "500",
                        fontSize: "1.5rem",
                        color: "#444444",
                      }}
                    >
                    {/* Add Experience */}

                    </p>
                    <button type="button" className="btn" data-dismiss="modal" aria-label="Close">
                      <AiOutlineCloseCircle />
                    </button>
                  </div>


                  <div className="modal-body">
                    <div className="container-fluid">
                      <form onSubmit={handleSubmit(onSubmitAddExperience)}>
                        {promiseInProgress === true ? <Loading /> : null}

                        <div className="col-md-12 col-sm-12 mt-3   ">
                          <span className="mb-2" >Company Name* </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ex. Skill tera"
                            name="company"
                            value={formValue.company}
                            onChange={handleChange}
                            required
                          />

                        </div>

                        <div className="col-md-12 col-sm-12 mt-3   ">
                          <span className="mb-2" >Position* </span>
                          <input
                            type="text"
                            className="form-control"
                            id=""
                            placeholder="Ex. Product Designer"
                            name="designation"
                            value={formValue.designation}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="col-md-12 col-sm-12 mt-3 ">
                          <span className="mb-2" >Currently working in a company  : </span>
                          <input className="form-check-input mx-3 " type="checkbox"
                            name="isThisCurrentCompany"
                            value={formValue.isThisCurrentCompany = true}
                            onChange={handleChange}
                            onClick={() => setWorkingStatus(!workingStatus)}

                          />
                          <label className="form-check-label" htmlfor="flexCheckDisabled">
                            YES
                          </label>
                        </div>


                        <div className="row mt-3  ">
                          <div className="col-md-6">
                            <span className="mb-2" >Start Date* </span>
                            <input
                              type="date"
                              className="form-control"
                              name="startDate"
                              value={formValue.startDate}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="col-md-6"  >
                            <span className="" >End Date </span>
                            <input
                              type="date"
                              className="form-control"
                              name="endDate"
                              value={formValue.endDate}
                              onChange={handleChange}
                              disabled={workingStatus}
                            />
                          </div>
                        </div>

                        <div className="col-md-12 col-sm-12 mt-3  ">
                          <span className="mb-2" >Description* </span>
                          <textarea className="form-control" id="exampleFormControlTextarea1" rows="4"
                            name="description"
                            value={formValue.description}
                            onChange={handleChange}
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
                            Save
                          </button>
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                          <p style={{ color: "green" }} > {successMessageAddExperience} </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {experienceData.length > 0 ?

            experienceData.map((x, index) => {
              return (
                <div key={x._id}>

                  {index > 0 && (
                    <div className="d-flex " style={{ height: '70px' }}>
                      <div className="vr" style={{ backgroundColor: 'black', width: '1px' }} ></div>
                    </div>
                  )}

                  <UpdDelExp  expId={x._id} company={x.company} description={x.description}
                    designation={x.designation} startDate={x.startDate} endDate={x.endDate} {...x} />
                </div>
              )
            }) : " "}

        </div>
      </div>
    </>
  )
}

export default ExperienceCard
