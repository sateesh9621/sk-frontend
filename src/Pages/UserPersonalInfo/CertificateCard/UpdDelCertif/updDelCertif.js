import React, { useState, useEffect } from "react";
import { BsPencil } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import ApiConstants from "../../../../Services/apiconstants";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import Loading from "../../../../Component/Loading/loading";
import $ from "jquery"
import { DateFieldShow } from "../../../../UtilitiesFunctions/utilitiesFunction";
import { Interceptor } from "../../../../ErrorStatus/errorStatus"

const UpdDelCertif = (props) => {

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
    formState: { }
  } = useForm();


  const [formValue, setformValue] = useState(
    {
      name: props.name,
      startDate: props.startDate,
      endDate: props.endDate,
      verifyLink: props.verifyLink,
      credentials: props.credentials
    }
  );



  //Certificate Axios Section  Start


  const [successMessageUpdateCertificate, setSuccessMessageUpdateCertificate] = useState("")
  const [successMessageDeleteCertificate, setSuccessMessageDeleteCertificate] = useState("")
  const [displayVisibility, setDisplayVisibility] = useState(true)



  const onSubmitUpdateCertificate = () => {
    trackPromise(
      axios
        .put(
          ApiConstants.UPDATE_CERTIFICATE + `${props.certifId}`,
          {
            name: formValue.name,
            startDate: formValue.startDate,
            endDate: formValue.endDate,
            credentials: formValue.credentials,
            verifyLink: formValue.verifyLink,
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
          setSuccessMessageUpdateCertificate(response.data.message);
          setTimeout(() => {
            $("[data-dismiss=modal]").trigger({ type: "click" })
          }, 1000)


        })
        .catch((error) => {
          if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
            Interceptor(error.response.status)
          } else {
            Swal.fire({
              title: error.response.data.error,
              icon: "error",
              width: 400,
              height: 100,
            })
          }
        })
    );
  };

  const onSubmitDeleteCertificate = (id) => {
    trackPromise(
      axios
        .delete(
          ApiConstants.DELETE_CERTIFICATE + id,
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
          setSuccessMessageDeleteCertificate(response.data.message);

          setTimeout(() => {
            $("[data-dismiss=modal]").trigger({ type: "click" })
          }, 1000)

          setDisplayVisibility(false)

        })
        .catch((error) => {
          if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
            Interceptor(error.response.status)
          } else {
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



  const handleChange = (event) => {
    setformValue({
      ...formValue,
      [event.target.name]: event.target.value
    });
  }

  useEffect(() => {
    const manageOutSideClick = (event) => {

      setSuccessMessageDeleteCertificate("")

      setSuccessMessageUpdateCertificate("")

    }

    document.addEventListener("click", manageOutSideClick)
    return () => {
      document.removeEventListener("click", manageOutSideClick)
    }

  }, [])


  return (
    <>
      {/* certificate Edit  and del*/}

      <div className="border mb-3" style={{ display: displayVisibility === true ? "visible" : "none"  , borderRadius:"4px"}} >



          <div>
          <div className="d-flex justify-content-between ">
            <p className="m-2"  style={{
                fontWeight: "500",
                fontSize: "16px",
                color: "#444444",
              }} > <b>{formValue.name}</b></p>
            <button
            type="button"
            className="btn edtBtn"
            data-toggle="modal"
            data-target={`#certificateEdit${formValue.certifId}`}
          >
            <BsPencil />
          </button>
          </div>

            <p
              className="mx-2 "
              style={{
                fontWeight: "500",
                fontSize: "0.8rem",
                color: "#444444",
              }}
            >
              {formValue.credentials}
            </p>
            <p  className="mx-2 ">
            <a  
             href={formValue.verifyLink} 
             target="_blank"
           
            style={{
                fontWeight: "500",
                fontSize: "14px",
                color: "#444444",
              }}> {formValue.verifyLink}</a></p>
          </div>

         

          {/* Edit Certificate Popup Screen */}
          <div
            className="modal fade"
            id={`certificateEdit${formValue.certifId}`}
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div className="modal-content modalContent">
                <div className="modal-header">
                  <p className="modal-title mx-1" style={{
                    fontWeight: "500",
                    fontSize: "1.5rem",
                    color: "#444444",
                  }}>
                    Edit Certificate
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
                  <form onSubmit={handleSubmit(onSubmitUpdateCertificate)}>

                    {promiseInProgress === true ? <Loading /> : null}

                    <div className="col-md-12 col-sm-12 mt-3 ">
                      <span className="mb-2">Name</span>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        //{...register("name")}
                        value={formValue.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="row mt-3 ">
                      <div className="col-md-6">
                        <span className="mb-2">Start Date </span>
                        <input
                          type="date"
                          className="form-control"
                          name="startDate"
                          value={DateFieldShow(formValue.startDate)}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <span className="mb-2">End Date </span>
                        <input
                          type="date"
                          className="form-control"
                          name="endDate"
                          value={DateFieldShow(formValue.endDate)}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-12 col-sm-12 mt-3 ">
                      <span className="mb-2">Add certificate </span>
                      <input
                        type="url"
                        className="form-control"
                        id=""
                        placeholder="https://certificate"
                        name="verifyLink"
                        value={formValue.verifyLink}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-12 col-sm-12 mt-3 ">
                      <span className="mb-2">Certification from* </span>
                      <input
                        type="string"
                        className="form-control"
                        id=""
                        placeholder="Ex.  Coursera ,Udemy"
                        name="credentials"
                        value={formValue.credentials}
                        onChange={handleChange}
                        required="true"
                      />
                    </div>

                    <div className="mt-3  d-flex justify-content-around  ">

                      <button type="reset" className="buttonCancel"
                        onClick={() => onSubmitDeleteCertificate(props.certifId)}>
                        Delete
                      </button>

                      <button type="submit" className="buttonSend me-md-2 ">
                        Save
                      </button>
                    </div>
                    <p className="text-center fs-6" style={{ color: "green" }}>

                      {successMessageUpdateCertificate}

                    </p>
                    <p className="text-center fs-6" style={{ color: "red" }}>

                      {successMessageDeleteCertificate}

                    </p>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>
     
    
    </>
  );
};

export default UpdDelCertif
