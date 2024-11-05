import React, { useState, useEffect, useContext } from "react";
import { BsPlusCircle} from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import ApiConstants from "../../../Services/apiconstants";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import Loading from "../../../Component/Loading/loading";
import UpdDelCertif from "./UpdDelCertif/updDelCertif";
import $ from "jquery"
import { DateFieldShow } from "../../../UtilitiesFunctions/utilitiesFunction"
import { userContext } from "../../../Context/userContextState";
import { Interceptor } from "../../../ErrorStatus/errorStatus";


const CertificateCard = () => {


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
    formState: { }
  } = useForm();

  const [formValue, setformValue] = useState({

    name: "",
    startDate: "",
    endDate: "",
    verifyLink: "",
    credentials: ""
  });



  //Certificate Axios Section  Start

  const [successMessageAddCertificate, setSuccessMessageAddCertificate] = useState("");
  const [CertifData, setCertifData] = useState([])

  const onSubmitAddCertificate = () => {

    trackPromise(
      axios
        .post(
          ApiConstants.ADD_CERTIFICATE,
          {
            name: formValue.name,
            startDate: formValue.startDate,
            endDate: formValue.endDate,
            verifyLink: formValue.verifyLink,
            credentials: formValue.credentials

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
          setSuccessMessageAddCertificate(response.data.message);
          setCertifData([...CertifData, response.data.certificate])
          setTimeout(() => {
            $("[data-dismiss=modal]").trigger({ type: "click" })
          }, 1000)
          setformValue({

            name: "",
            startDate: "",
            endDate: "",
            verifyLink: "",
            credentials: ""
          });



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
            });
          }
        })
    );
  }

  //Certificate Axios Section  End


  const handleChange = (event) => {
    setformValue({
      ...formValue,
      [event.target.name]: event.target.value
    });
  }


  //useEffect for fetched data
  useEffect(() => {
    if (userData != 0) {
      setCertifData(userData[0].candidate.certificate);
    }
  }, [userData])

  useEffect(() => {
    const manageOutSideClick = (event) => {

      setSuccessMessageAddCertificate("")
    }
    document.addEventListener("click", manageOutSideClick)
    return () => {
      document.removeEventListener("click", manageOutSideClick)
    }
  }, [])



  return (
    <>
      {/* Certificate */}
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
              <b> Certificates</b>
            </span>
            <button
              type="button"
              className="btn edtBtn"
              data-toggle="modal"
              data-target="#certificateAdd"
            >
              <BsPlusCircle />
            </button>
            <div
              className="modal fade"
              id="certificateAdd"
              tabindex="-1"
              role="dialog"
              aria-labelledby="exampleModalCenterTitle"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content modalContent">
                  <div className="modal-header">
                    <p className="modal-title mx-1" id="exampleModalLongTitle" style={{
                      fontWeight: "500",
                      fontSize: "1.5rem",
                      color: "#444444",
                    }} >
                      Add Certificate
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

                    <form onSubmit={handleSubmit(onSubmitAddCertificate)}>
                      {promiseInProgress === true ? <Loading /> : null}
                      <div className="col-md-12 col-sm-12 mt-3 ">
                        <span >Name* </span>
                        <input
                          type="text"
                          className="form-control"
                          id=""
                          placeholder="Ex. Boston University"
                          name="name"
                          value={formValue.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="row mt-3">
                        <div className="col-md-6">
                          <span >Start Date* </span>
                          <input
                            type="date"
                            className="form-control"
                            name="startDate"
                            value={DateFieldShow(formValue.startDate)}
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
                            value={DateFieldShow(formValue.endDate)}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-12 col-sm-12 mt-3 ">
                        <span className="">Certificate* </span>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://certificate"
                          name="verifyLink"
                          value={formValue.verifyLink}
                          onChange={handleChange}
                          required
                        />

                      </div>

                      <div className="col-md-12 col-sm-12 mt-3 ">
                        <span>Certification from* </span>
                        <input
                          type="string"
                          className="form-control"
                          placeholder="Ex.  Coursera ,Udemy"
                          name="credentials"
                          value={formValue.credentials}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="d-flex justify-content-center mt-3 mb-3">
                        <button type="submit" className="buttonSend
 me-md-2 ">
                          Save
                        </button>
                      </div>
                      <p className="text-center fs-6" style={{ color: "green" }}>
                        {successMessageAddCertificate}
                      </p>

                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {CertifData.length > 0 ?

            CertifData.map((x) => {

              return (
                <UpdDelCertif key={x._id} name={x.name} credentials={x.credentials}
                  certifId={x._id}  {...x}
                />
              )
            }) : " "}

        </div>
      </div>
    </>
  );
};

export default CertificateCard;
