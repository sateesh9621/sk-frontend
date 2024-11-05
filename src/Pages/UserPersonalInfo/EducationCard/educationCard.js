import axios from "axios";
import $ from "jquery";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsPlusCircle } from "react-icons/bs";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import Swal from "sweetalert2";
import Loading from "../../../Component/Loading/loading";
import { userContext } from "../../../Context/userContextState";
import ApiConstants from "../../../Services/apiconstants";
import UpdateEducation from "./UpdateEducation/updateEducation";
import { Interceptor } from "../../../ErrorStatus/errorStatus";

const EducationCard = () => {

  const { userData } = useContext(userContext)

  if (sessionStorage.getItem('candidate_data') != null) {
    const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data"))
    var token = candidateDataMix.token;
    var userId = candidateDataMix.candidate._id;
  }

  if (sessionStorage.getItem('candidate_data_ref') != null) {
    const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data_ref"))
    var token = candidateDataMix.token;
    var userId = candidateDataMix.candidate._id;

  }

  const { promiseInProgress } = usePromiseTracker();

  const {
    handleSubmit,
    formState: {  },
  } = useForm();

  // Education axios section  Start

  const [successMessageAddEducation, setSuccessMessageAddEducation] = useState("");

  const [educationData, setEducationData] = useState([])

  const [formValue, setformValue] = useState({

    school: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: '',
    grade: '',
    description: ''
  })

  const handleChange = (event) => {
    setformValue({
      ...formValue,
      [event.target.name]: event.target.value
    })
  }

  const onSubmitAddEducation = () => {



    trackPromise(
      axios
        .post(
          ApiConstants.ADD_EDUCATION,
          {
            school: formValue.school,
            degree: formValue.degree,
            major: formValue.major,
            startDate: formValue.startDate,
            endDate: formValue.endDate,
            grade: formValue.grade,
            // description: formValue.description
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
          setSuccessMessageAddEducation(response.data.message)
          setEducationData([...educationData, response.data.education])

          setTimeout(() => {
            $("[data-dismiss=modal]").trigger({ type: "click" })
          }, 1000)

          setformValue({
            school: '',
            degree: '',
            major: '',
            startDate: '',
            endDate: '',
            grade: '',
            description: ''
          })

        })
        .catch((error) => {

          if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {

            Interceptor(error.response.status)
          }
          else {

            Swal.fire({
              title: error.response.data.error,
              icon: "error",
              width: 400,
              height: 100,
            })
          }


        })
    )
  }



  useEffect(() => {
    const manageOutSideClick = (event) => {

      setSuccessMessageAddEducation("")
    }
    document.addEventListener("click", manageOutSideClick)
    return () => {
      document.removeEventListener("click", manageOutSideClick)
    }
  }, [])

  // Education axios section end

  useEffect(() => {

    if (userData.length != 0) {
      setEducationData(userData[0].candidate.education)
    }

  }, [userData]);






  return (
    <>
      {/* Education */}

      <div className="card mb-3 candidate-global-section">
        <div className="card-body">

          <div className="d-flex justify-content-between">
            <span
              style={{
                fontWeight: "500",
                fontSize: "20px",
                color: "#444444",
              }}
            >
              <b> Education</b>
            </span>
            <button
              type="button"
              className="btn edtBtn"
              data-toggle="modal"
              data-target=".bd-example-modal-lgAdd"
            >
              <BsPlusCircle />
            </button>
          </div>

          {/* ADD_EDUCATION MODEL START */}

          <div
            className="modal fade bd-example-modal-lgAdd"
            tabindex="-1"
            role="dialog"
            aria-labelledby="myLargeModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content modalContent">
                <div className="modal-header">
                  <p className="modal-title  mx-1 " style={{
                    fontWeight: "500",
                    fontSize: "1.5rem",
                    color: "#444444",
                  }}>
                    Add Education Details
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
                  <div className="container-fluid">

                    <form onSubmit={handleSubmit(onSubmitAddEducation)}>
                      {promiseInProgress === true ? <Loading /> : null}

                      <div className="col-md-12 col-sm-12 mt-3  ">
                        <label  htmlFor="schoolInput" >School / University* </label>
                        <input
                          type="text"
                          id="schoolInput"
                          className="form-control"
                          placeholder="Ex. Boston University"
                          name="school"
                          value={formValue.school}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-12 col-sm-12 mt-3   ">
                        <span className="">Degree* </span>
                        <input
                          type="text"
                          className="form-control"
                          id=""
                          placeholder="Ex. Bachelor’s"
                          name="degree"
                          // {...register("degree")}
                          value={formValue.degree}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-12 col-sm-12 mt-3  ">
                        <span className="">Major* </span>
                        <input
                          type="text"
                          className="form-control"
                          id=""
                          placeholder="Ex. Computre Science"
                          name="major"
                          // {...register("major")}
                          value={formValue.major}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="row mt-3" >
                        <div className="col-md-6 col-sm-6">
                          <span className="">Start Date* </span>
                          <input
                            type="date"
                            className="form-control"
                            name="startDate"
                            //{...register("startDate")}
                            value={formValue.startDate}
                            onChange={handleChange}
                            required

                          />
                        </div>

                        <div className="col-md-6">
                          <span className="">End Date* </span>
                          <input
                            type="date"
                            className="form-control"
                            name="endDate"
                            value={formValue.endDate}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-12 col-sm-12 mt-3  ">
                        <span className="">Grade*</span>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Ex:3.5"
                          name="grade"
                          value={formValue.grade}
                          onChange={handleChange}
                          pattern="^[0-9]*$"
                          title="please fill your grade"
                          min="0"
                          required
                        />
                      </div>

                      {/* <div className="col-md-12 col-sm-12 mt-3  ">
                        <span className="">Description </span>
                        <textarea
                          name="description"
                          className="form-control"
                          id="exampleFormControlTextarea1"
                          rows="4"
                          // {...register("description")}
                          value={formValue.description}
                          onChange={handleChange}
                        ></textarea>
                        <p style={{ textAlign: "right" }}> 0/ 500 </p>
                      </div> */}

                      <div className="d-flex justify-content-center mt-3">
                        <button type="submit" className="buttonSend
 me-md-2 ">
                          Save
                        </button>
                      </div>
                      <p className="text-center fs-6" style={{ color: "green" }}>
                        {successMessageAddEducation}
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ADD_EDUCATION MODEL end */}

          {educationData.length > 0 ?

            educationData.map((x ,index) => {

              return (
              <div key={index}>
              {index > 0 && (
                    <div className="d-flex" style={{ height: '70px' }}>
                      <div className="vr" style={{ backgroundColor:'black', width: '1px' }} ></div>
                    </div>
                  )}
                <UpdateEducation key={x._id} educationId={x._id} school={x.school} degree={x.degree} major={x.major}
                  startDate={x.startDate} endDate={x.endDate}
                  grade={x.grade} description={x.description}
                />
          </div>
              )
            }) : " "}

        </div>
      </div>

    </>
  );
};

export default EducationCard;
