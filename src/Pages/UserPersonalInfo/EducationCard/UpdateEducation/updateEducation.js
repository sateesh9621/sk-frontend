import React, { useState } from "react";
import { BsPencil } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import ApiConstants from "../../../../Services/apiconstants";
import { useForm } from "react-hook-form";
import Loading from "../../../../Component/Loading/loading";
import $ from "jquery"
import { DateFieldShow } from "../../../../UtilitiesFunctions/utilitiesFunction";
import { DateConverterTypeSec } from "../../../../UtilitiesFunctions/utilitiesFunction";
import { Interceptor } from "../../../../ErrorStatus/errorStatus"



const UpdateEducation = (props) => {

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
    formState: {  }
  } = useForm();

  // Education axios section  Start

  const [successMessageUpdateEducation, setSuccessMessageUpdateEducation] = useState("")
  const [successMessageDeleteEducation, setSuccessMessageDeleteEducation] = useState("")
  const [displayVisibility, setDisplayVisibility] = useState(true)

  const [formValue, setformValue] = React.useState({

    school: props.school,
    degree: props.degree,
    major: props.major,
    startDate: props.startDate,
    endDate: props.endDate,
    grade: props.grade,

  })

  const handleChange = (event) => {
    setformValue({
      ...formValue,
      [event.target.name]: event.target.value
    })
  }

  const onSubmitUpdateEducation = () => {
    trackPromise(
      axios
        .put(
          ApiConstants.UPDATE_EDUCATION + `${props.educationId}`,
          {
            school: formValue.school,
            degree: formValue.degree,
            major: formValue.major,
            startDate: formValue.startDate,
            endDate: formValue.endDate,
            grade: formValue.grade,

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
          setSuccessMessageUpdateEducation(response.data.message);
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






  const onSubmitDeleteEducation = () => {
    trackPromise(
      axios
        .delete(
          ApiConstants.DELETE_EDUCATION + `${props.educationId}`
          ,
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
          setSuccessMessageDeleteEducation(response.data.message);
          setTimeout(() => {
            $("[data-dismiss=modal]").trigger({ type: "click" })
          }, 1000)
          setDisplayVisibility(false)
        })
        .catch((error) => {
          if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
            Interceptor(error.response.status)
          }

        })
    );
  };



  // Education axios section end
  var curr = new Date();
  curr.setDate(curr.getDate() + 3);
  var date = curr.toISOString().substring(0, 10);

  return (
    <>
      {/* Education */}
      <div style={{ display: displayVisibility === true ? "visible" : "none" }} >

        <div className="d-flex justify-content-between mt-3">
          <span
            style={{
              fontWeight: "500",
              fontSize: "16px",
              color: "#444444",
            }}>

            <b> {props.school.toUpperCase()}</b>
          </span>
          <button
            type="button"
            className="btn edtBtn"
            data-toggle="modal"
            data-target={".bd-example-modal-lg" + `${props.educationId}`}
          >
            <BsPencil />
          </button>

          {/* UPDATE_AND_DELETE_EDUCATION MODEL START */}

          <div
            className={"modal fade bd-example-modal-lg" + `${props.educationId}`}
            tabindex="-1"
            role="dialog"
            aria-labelledby="myLargeModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content modalContent">
                <div className="modal-header">
                  <p className="modal-title  " id="exampleModalLongTitle"
                    style={{
                      fontWeight: "500",
                      fontSize: "1.5rem",
                      color: "#444444",
                    }}>
                    Update Education
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
                    <form onSubmit={handleSubmit(onSubmitUpdateEducation)}>
                      {promiseInProgress === true ? <Loading /> : null}

                      <div className="col-md-12 col-sm-12 mt-3  ">
                        <span className="mb-2">School / University* </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ex. Boston University"
                          name="school"
                          // {...register("school")}
                          value={formValue.school}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-12 col-sm-12 mt-3  ">
                        <span className="mb-2">Degree* </span>
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
                        <span className="mb-2">Major* </span>
                        <input
                          type="text"
                          className="form-control"
                          id=""
                          placeholder="Ex. Computre Science"
                          name="major"
                          //{...register("major")}
                          value={formValue.major}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="row mt-3 ">
                        <div className="col-md-6">
                          <span className="">Start Date* </span>
                          <input
                            type="date"
                            className="form-control"
                            name="startDate"
                            required
                            value={DateFieldShow(formValue.startDate)}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-md-6">
                          <span className="">End Date*</span>
                          <input
                            type="date"
                            className="form-control"
                            name="endDate"
                            //{...register("endDate")}
                            value={DateFieldShow(formValue.endDate)}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-12 col-sm-12 mt-3 ">
                        <span className="mb-2">Grade* </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ex: 3.5"
                          name="grade"
                          //{...register("grade")}
                          value={formValue.grade}
                          onChange={handleChange}
                          required
                        />
                      </div>



                      <div className="d-flex justify-content-around mt-3">
                        <button type="reset" className="buttonCancel me-md-2"
                          onClick={() => onSubmitDeleteEducation(props._id)}
                        >
                          Delete
                        </button>
                        <button type="submit" className="buttonSend
 me-md-2 ">
                          Save
                        </button>
                      </div>
                      <p className="text-center fs-6" style={{ color: "green" }}>
                        {successMessageUpdateEducation}
                      </p>
                      <p className="text-center fs-6" style={{ color: "red" }}>
                        {successMessageDeleteEducation}
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* UPDATE_AND_DELETE_EDUCATION MODEL END*/}

        </div>

        <div className="d-flex justify-content-start mt-1 ">
          <p
            style={{
              fontWeight: "500",
              fontSize: "14px",
              color: "#444444",
              // textTransform:"capitalize"
            }}
          >
              {formValue.degree}  &nbsp;&nbsp;&nbsp;&nbsp;
            {DateConverterTypeSec(formValue.startDate)}
            &nbsp;&nbsp;
            <b>to</b>&nbsp;&nbsp;
            {DateConverterTypeSec(formValue.endDate)}
          </p>
        </div>
{/* 
         <p className="mt-2" style={{ fontSize: "14px", marginRight: "5%" , color:"#6F6F6F"}}> {formValue.description} </p> */}

      </div>
    </>
  );
};

export default UpdateEducation;
