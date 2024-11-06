import React, { useState, useEffect, useContext } from "react";
import { BsPencil } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import ApiConstants from "../../../Services/apiconstants";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import Loading from "../../../Component/Loading/loading";
import $ from "jquery"
import { userContext } from "../../../Context/userContextState";
import { Interceptor } from "../../../ErrorStatus/errorStatus";
import ReactQuill from "react-quill";

const AboutCard = () => {

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


  const [description, setDescription] = useState('');

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image'
  ];


  // About axios section  Start

  const [successMessageAbout, setSuccessMessageAbout] = useState("");


  const onSubmitAbout = () => {

    trackPromise(
      axios
        .patch(
          ApiConstants.PROFILE,
          {
            experienceSummary: description,
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
          }).then((response) => {

            setSuccessMessageAbout("Sucecessfully Updated")

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
    )
  }



  // About axios section  End


  // useEffect to update field value



  useEffect(() => {
    const manageOutSideClick = (event) => {

      setSuccessMessageAbout("")
    }
    document.addEventListener("click", manageOutSideClick)
    return () => {
      document.removeEventListener("click", manageOutSideClick)
    }
  }, [])

  useEffect(() => {
    if (userData.length != 0) {
      setDescription(userData[0].candidate.experienceSummary)
    }
  }, [userData])

  return (
    <>
      {/* About */}

      <div className="card mb-2" id="personalData">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <span
              style={{
                fontWeight: "500",
                fontSize: "20px",
                color: "#444444",
              }}
            >
              <b>About</b>
            </span>

            <button
              type="button"
              className="btn edtBtn"
              data-toggle="modal"
              data-target="#about"
            >
              <BsPencil />
            </button>

            <div
              className="modal fade"
              id="about"
              tabindex="-1"
              role="dialog"
              aria-labelledby="exampleModalCenterTitle"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content modalContent">
                  <div className="modal-header">
                    <h5 className="modal-title mx-3" id="exampleModalLongTitle" style={{ fontSize: "1.6rem" }}>
                      About
                    </h5>
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
                    <div className="row m-1 ">
                      {/* <label className="mb-3" style={{ fontSize: "1.2rem" }}>
                        Use this space to show clients you have the skills and
                        experience they're looking for.
                      </label> */}

                      <form onSubmit={handleSubmit(onSubmitAbout)}>

                        {promiseInProgress === true ? <Loading /> : null}
                        <div className="container-fluid">
                          <ReactQuill
                            style={{ width: '110%', height: '100%', marginLeft: "-5%" }}
                            value={description}
                            onChange={setDescription}
                            modules={modules}
                            formats={formats}
                            placeholder="Enter your item description here"
                          />
                        </div>
                        <p style={{ textAlign: "right" }}> {description !== null || description !== undefined ? `${description?.length}/500` : " "} </p>
                        <div className="d-flex justify-content-center mt-4">
                          <button type="submit" className="buttonSend
 me-md-2 ">
                            Save
                          </button>
                        </div>

                        <p className="text-center fs-6" style={{ color: "green" }}>
                          {successMessageAbout}
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-1 " style={{ marginRight: "5%" }} >
            <p style={{ alignContent: 'justify', textAlign: 'justify' ,fontSize:'16px' ,color: "#444444"}}
              dangerouslySetInnerHTML={{ __html: description }}
            >
            </p>
          </div>

        </div>
      </div>

    </>
  );
};

export default AboutCard;