import axios from "axios";
import $ from "jquery";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineCloseCircle } from "react-icons/ai";
import {
  BsPencil
} from "react-icons/bs";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import Loading from "../../../../Component/Loading/loading";
import ApiConstants from "../../../../Services/apiconstants";
import { DateConverterTypeSec, DateFieldShow } from "../../../../UtilitiesFunctions/utilitiesFunction";
import { Interceptor } from "../../../../ErrorStatus/errorStatus"


const UpdDelExp = (props) => {

  if (sessionStorage.getItem('candidate_data') != null) {
    const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data"))
    // var mixpanelData = candidateDataMix.candidate.email;
    var token = candidateDataMix.token;
    var userId = candidateDataMix.candidate._id;
    // var candidateEmailId = candidateDataMix.candidate.email;
  }

  if (sessionStorage.getItem('candidate_data_ref') != null) {
    const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data_ref"))
    // var mixpanelData = candidateDataMix.candidate.email;
    var token = candidateDataMix.token;
    var userId = candidateDataMix.candidate._id;
    // var candidateEmailId = candidateDataMix.candidate.email;

  }


  const { promiseInProgress } = usePromiseTracker();

  const {
    handleSubmit,
    formState: { }
  } = useForm();

  // Experience Axios Section Start

  const [successMessageUpdateExperience, setSuccessMessageUpdateExperience] = useState("")
  const [successMessageDeleteExperience, setSuccessMessageDeleteExperience] = useState("")

  const [displayVisibility, setDisplayVisibility] = useState(true)


  const [formValue, setformValue] = React.useState({

    company: props.company,
    designation: props.designation,
    startDate: props.startDate,
    endDate: props.endDate,
    description: props.description

  })

  const handleChange = (event) => {

    setformValue({
      ...formValue,
      [event.target.name]: event.target.value
    })

  }



  const onSubmitUpdateExperience = (Id) => {
    trackPromise(
      axios
        .put(
          ApiConstants.UPDATE_EXPERIENCE + `${Id}`,
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
          setSuccessMessageUpdateExperience(response.data.message);
          setTimeout(() => {
            $("[data-dismiss=modal]").trigger({ type: "click" })
          }, 2000)
          //window.location.reload(false)
        })
        .catch((error) => {
          if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {

            Interceptor(error.response.status)
          }

        })
    );
  };

  const onSubmitDeleteExperience = (Id) => {
    trackPromise(
      axios
        .delete(
          ApiConstants.DELETE_EXPERIENCE + `${Id}`,
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
        ).then((response) => {
          setSuccessMessageDeleteExperience(response.data.message);
          setformValue({
            company: "", designation: "", startDate: "", endDate: "", description: ""
          })
          setDisplayVisibility(false)
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

  // Experience axios section end


  useEffect(() => {
    const manageOutSideClick = (event) => {

      setSuccessMessageUpdateExperience("")
      setSuccessMessageDeleteExperience("")
    }
    document.addEventListener("click", manageOutSideClick)
    return () => {
      document.removeEventListener("click", manageOutSideClick)
    }
  }, [])




  return (
    <>

      {/* Experience */}

      <div style={{ display: displayVisibility === true ? "visible" : "none" }} >

        <div className="d-flex justify-content-between"   >

          <div className="d-flex justify-content-start mt-1 ">
            <p
              style={{
                fontWeight: "500",
                fontSize: "16px",
                color: "#444444",
              }}
            >
              <b> {formValue.company.toUpperCase()} </b> &nbsp;&nbsp;&nbsp;&nbsp;
              {DateConverterTypeSec(formValue.startDate)} &nbsp;&nbsp;
              <b>to</b>&nbsp;&nbsp;
              {DateConverterTypeSec(formValue.endDate)}
            </p>
          </div>

          <button type="button" className="btn edtBtn" data-toggle="modal"
            data-target={".experienceUpdateDel" + `${props._id}`}>
            <BsPencil />
          </button>
        </div>

        <p className="mt-1">
          <spna style={{ fontSize: "15px" }} > <b> {formValue.designation} </b> </spna>
        </p>
        <p className="row mt-1">
          <span style={{ fontSize: "14px", paddingRight: "5%", textAlign: "justify" ,color:"#444444"}} >
            {formValue.description}
          </span>
        </p>
      </div>

      {/* Update and delete Experience  */}
      <div className={"modal fade experienceUpdateDel" + `${props._id}`} tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content modalContent">
            <div className="modal-header">
              <p className="modal-title  "

              >Update Experience</p>
              <button type="button" className="btn" data-dismiss="modal" aria-label="Close">
                <AiOutlineCloseCircle />
              </button>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <form onSubmit={handleSubmit(() => onSubmitUpdateExperience(props.expId))}>
                  {promiseInProgress === true ? <Loading /> : null}
                  <div className="col-md-12 col-sm-12 mt-3  ">
                    <span className="mb-2" >Company Name * </span>
                    <input
                      type="text"
                      className="form-control"

                      placeholder="Ex. Skill tera"
                      name="company"
                      value={formValue.company}
                      onChange={handleChange}

                    />

                  </div>
                  <div className="col-md-12 col-sm-12 mt-3  ">
                    <span className="mb-2" >Position * </span>
                    <input
                      type="text"
                      className="form-control"
                      id=""
                      placeholder="Ex. Product Designer"
                      name="designation"
                      value={formValue.designation}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="row mt-3 ">
                    <div className="col-md-6">
                      <span className="mb-2" >Start Date </span>
                      <input
                        type="date"
                        className="form-control"
                        name="startDate"
                        value={DateFieldShow(formValue.startDate)}
                        onChange={handleChange}
                        required="true"
                      />
                    </div>
                    <div className="col-md-6">
                      <span className="mb-2" >End Date </span>
                      <input
                        type="date"
                        className="form-control"
                        id=""
                        name="endDate"
                        value={DateFieldShow(formValue.endDate)}
                        onChange={handleChange}
                        required="true"
                      />
                    </div>
                  </div>

                  <div className="col-md-12 col-sm-12 mt-3 ">
                    <span className="mb-2" >Description </span>
                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="4"
                      name="description"
                      value={formValue.description}
                      onChange={handleChange}
                    ></textarea>
                    <p style={{ textAlign: "right" }}> 0/500</p>
                  </div>

                  <div className="d-flex justify-content-around mt-3">
                    <button type="reset" className="buttonCancel me-md-2"
                      onClick={() => onSubmitDeleteExperience(props._id)} >
                      Delete
                    </button>
                    <button type="submit" className="buttonSend
 me-md-2 ">
                      Save
                    </button>
                  </div>

                  <p className="text-center fs-6" style={{ color: "green" }}>
                    {successMessageUpdateExperience}
                  </p>
                  <p className="text-center fs-6" style={{ color: "red" }}>
                    {successMessageDeleteExperience}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default UpdDelExp
