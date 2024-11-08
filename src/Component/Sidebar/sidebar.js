import axios from "axios";
import $ from "jquery";
import react, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { AiOutlineCloseCircle } from "react-icons/ai";
import {
  BsArrowDown,
  BsFillFileEarmarkMinusFill,
  BsFillPencilFill,
  BsLinkedin,
  BsPencil,
} from "react-icons/bs";
import { MdCall, MdEmail } from "react-icons/md";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import Swal from "sweetalert2";
import uesrImageDefault from "../../Assets/profilePic.png";
import Loading from "../../Component/Loading/loading";
import { userContext } from "../../Context/userContextState";
import ApiConstants from "../../Services/apiconstants";
import Mixpanel from "../../Services/mixpanel";
import {
  subString,
  picSizeValidate,
  fileSizeValidate,
  calculateProfileStrength,
} from "../../UtilitiesFunctions/utilitiesFunction";
import "./sidebar.css";
import { Interceptor } from "../../ErrorStatus/errorStatus";
import { RxCrossCircled } from "react-icons/rx";
import { selectSidebarMenuSelection } from "../../Redux/Reducer/sidebarMenuSelectionSlice";
import ProfileStrengthIndicator from "../Profile Strength indicator/profileStrengthIndicator";



const Sidebar = () => {

  const [ProfileStrength , setProfileStrength] = useState(0)
  const {
    userData,
    profilePic,
    setProfilePic,
    resumeData,
    setResumeData,
  } = useContext(userContext);

  if (sessionStorage.getItem('candidate_data') != null) {
    const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data"))
    var token = candidateDataMix.token;
    var userId = candidateDataMix.candidate._id;
    var candidateEmailId = candidateDataMix.candidate.email;
  }

  if (sessionStorage.getItem('candidate_data_ref') != null) {
    const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data_ref"))
    var token = candidateDataMix.token;
    var userId = candidateDataMix.candidate._id;
    var candidateEmailId = candidateDataMix.candidate.email;

  }


  const mixpanelButton = (purpose, buttonName) => {
    Mixpanel(purpose, buttonName, candidateEmailId);
  };
  // upload image  start

  const uploadedImage = react.useRef(null);
  const imageUploader = react.useRef(null);

  const [formValue, setformValue] = useState({
    fullname: "",
    currentCity: "",
    country: "",
  });

  const [formValueMiddle, setformValueMiddle] = useState({
    relocation: "",
    needVisaSponsorship: "",
    typeOfJob: "",
    interestedRole: "",
    currentRole: "",
    expectedRateC2CorC2H: "",
    timeToJoin: "",
    overallExperience: "",
  });

  const [formValueAddress, setformValueAdress] = useState({
    phone: "",
    email: "",
    linkedInUrl: "",
    resumeLink: "",
    relocation: "",
    needVisaSponsorship: "",
    typeOfJob: "",
    currentRole: "",
    expectedRateC2CorC2H: "",
    timeToJoin: "",
    overallExperience: "",
    previousEmployers: "",
  });

  const handleImageUpload = (e) => {
    const [file] = e.target.files;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("imageName", file.name);

    if (picSizeValidate(file.size)) {
      trackPromise(
        axios
          .post(ApiConstants.UPLOAD_PROFILE_PIC, formData, {
            headers: {
              Accept: "application/json",
              "Content-type": "application/json",
              token: token,
              _id: userId,
              "Access-Control-Allow-Origin": true,
              "Access-Control-Allow-Methods": "GET, POST, PATCH",
            },
          })
          .then((response) => {
            setProfilePic(response.data.imageLink);
          })
          .catch((error) => {
            if (
              (error.response.status >= 404 && error.response.status <= 499) ||
              (error.response.status >= 502 && error.response.status <= 599)
            ) {
              Interceptor(error.response.status);
            }
            console.log("image upload  : ", error);
          })
      );
    } else {
      Swal.fire({
        title: "Pic size should be less than 0.5MB",
        icon: "error",
        width: 400,
        height: 100,
      });
    }
  };

  //upload image end
  const dispatch = useDispatch();
  const menuSelection = (data) => {
    dispatch(selectSidebarMenuSelection(data));
  };

  const { promiseInProgress } = usePromiseTracker();
  const {
    register,
    handleSubmit,
    formState: { },
    setValue,
  } = useForm();

  // get candidate data by id SECTION END
  //Address axios section start

  const [successMessageAddress, setSuccessMessageAddress] = useState("");

  const onSubmitAddress = (data) => {
    // Mixpanel("Personal Submit / Save ", mixpanelData)

    trackPromise(
      axios
        .patch(
          ApiConstants.PROFILE,
          {
            phone: formValueAddress.phone,
            email: formValueAddress.email,
            linkedInUrl: formValueAddress.linkedInUrl,
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
          setSuccessMessageAddress("Updated Successfully");
          setTimeout(() => {
            $("[data-dismiss=modal]").trigger({ type: "click" });
          }, 1000);
        })
        .catch((error) => {
          console.log("myError : ", error);

          if (
            (error.response.status >= 404 && error.response.status <= 499) ||
            (error.response.status >= 502 && error.response.status <= 599)
          ) {
            Interceptor(error.response.status);
          }
        })
    );
  };

  const handleChangeAddress = (event) => {
    setformValueAdress({
      ...formValueAddress,
      [event.target.name]: event.target.value,
    });
  };

  const jobRoleSelection = useSelector((state) => state.jobRole);

  // file upload

  const [successMessageResumeUploaded, setSuccessMessageResumeUploaded] = useState("");

  const resumeUpload = (e) => {
    const [file] = e.target.files;

    const formData = new FormData();
    formData.append("resume", e.target.files[0]);
    formData.append("resumeName", e.target.files[0].name);

    if (fileSizeValidate(file.size)) {
      trackPromise(
        axios
          .post(ApiConstants.CANDIDATE_RESUME_UPLOAD, formData, {
            headers: {
              token: token,
              _id: userId,
              "Access-Control-Allow-Origin": true,
              "Access-Control-Allow-Methods": "GET, POST, PATCH",
            },
          })
          .then((response) => {
            setSuccessMessageResumeUploaded("Resume uploaded");
            setTimeout(() => {
              $("[data-dismiss=modal]").trigger({ type: "click" });
            }, 1000);
            setResumeData(response.data.resumeLink);
          })
          .catch((error) => {
            if (
              (error.response.status >= 404 && error.response.status <= 499) ||
              (error.response.status >= 503 && error.response.status <= 599)
            ) {
              Interceptor(error.response.status);
            }
          })
      );
    } else {
      Swal.fire({
        title: "File size should be less than 1MB",
        icon: "error",
        width: 400,
        height: 100,
      }).catch((error) => {
        if (
          (error.response.status >= 404 && error.response.status <= 499) ||
          (error.response.status >= 502 && error.response.status <= 599)
        ) {
          Interceptor(error.response.status);
        } else {
          Swal.fire({
            title: "File size should be less than 1MB",
            icon: "error",
            width: 400,
            height: 100,
          });
        }
      });
    }
  };

  //Address axios section end

  // name and address edit section Start

  const [successMessageRenameLocation, setSuccessMessageRenameLocation] =
    useState("");

  const onSubmitNameLocation = () => {
    trackPromise(
      axios
        .patch(
          ApiConstants.PROFILE,
          {
            fullname: formValue.fullname,
            currentCity: formValue.currentCity,
            country: formValue.country,
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
          setSuccessMessageRenameLocation("Sucecessfully Updated");
          setTimeout(() => {
            $("[data-dismiss=modal]").trigger({ type: "click" });
          }, 1000);
        })
        .catch((error) => {
          if (
            (error.response.status >= 404 && error.response.status <= 499) ||
            (error.response.status >= 502 && error.response.status <= 599)
          ) {
            Interceptor(error.response.status);
          }
        })
    );
  };


  const onSubmitMiddle = () => {
    trackPromise(
      axios
        .patch(
          ApiConstants.PROFILE,
          {
            relocation: formValueMiddle.relocation,
            needVisaSponsorship: formValueMiddle.needVisaSponsorship,
            typeOfJob: formValueMiddle.typeOfJob,
            interestedRole: formValueMiddle.interestedRole,
            currentRole: formValueMiddle.currentRole,
            expectedRateC2CorC2H: formValueMiddle.expectedRateC2CorC2H,
            timeToJoin: formValueMiddle.timeToJoin,
            overallExperience: formValueMiddle.overallExperience
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
          setSuccessMessageRenameLocation("Sucecessfully Updated");
          setTimeout(() => {
            $("[data-dismiss=modal]").trigger({ type: "click" });
          }, 1000);
        })
        .catch((error) => {
          if (
            (error.response.status >= 404 && error.response.status <= 499) ||
            (error.response.status >= 502 && error.response.status <= 599)
          ) {
            Interceptor(error.response.status);
          }
        })
    );
  };

  const handleChange = (event) => {
    setformValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeMiddle = (event) => {

    setformValueMiddle({
      ...formValueMiddle,
      [event.target.name]: event.target.value,
    })

  };


  const handleDeleteCompany = (val) => {

    var index = formValueAddress.previousEmployers.indexOf(val);

    if (index !== -1) {
      formValueAddress.previousEmployers.splice(index, 1);
    }


    trackPromise(
      axios
        .patch(
          ApiConstants.PROFILE,
          {
            previousEmployers: formValueAddress.previousEmployers
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
          setSuccessMessageRenameLocation("Sucecessfully Updated");
          setTimeout(() => {
            $("[data-dismiss=modal]").trigger({ type: "click" });
          }, 1000);
        })
        .catch((error) => {
          if (
            (error.response.status >= 404 && error.response.status <= 499) ||
            (error.response.status >= 502 && error.response.status <= 599)
          ) {
            Interceptor(error.response.status);
          }
        })

    )
  }


  const onSubmitPriviousEmp = (data) => {
    trackPromise(
      axios
        .patch(
          ApiConstants.PROFILE,
          {
            previousEmployers: [...formValueAddress.previousEmployers, data.previousEmployers]
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
          formValueAddress.previousEmployers.push(data.previousEmployers)

          setSuccessMessageRenameLocation("Sucecessfully Updated");
          setTimeout(() => {
            $("[data-dismiss=modal]").trigger({ type: "click" });
          }, 1000);
        })
        .catch((error) => {
          if (
            (error.response.status >= 404 && error.response.status <= 499) ||
            (error.response.status >= 502 && error.response.status <= 599)
          ) {
            Interceptor(error.response.status);
          }
        })

    )

  }


  // name and address edit section End

  useEffect(() => {
    const manageOutSideClick = (event) => {
      setSuccessMessageAddress("");
      setSuccessMessageResumeUploaded("");
      setSuccessMessageRenameLocation("");
    };
    document.addEventListener("click", manageOutSideClick);
    return () => {
      document.removeEventListener("click", manageOutSideClick);
    };
  }, []);

  useEffect(() => {
    if (userData.length != 0) {
      setformValueMiddle({
        relocation: userData[0].candidate.relocation,
        needVisaSponsorship: userData[0].candidate.needVisaSponsorship,
        typeOfJob: userData[0].candidate.typeOfJob,
        interestedRole: userData[0].candidate.interestedRole.role,
        currentRole: userData[0].candidate.currentRole,
        expectedRateC2CorC2H: userData[0].candidate.expectedRateC2CorC2H,
        timeToJoin: userData[0].candidate.timeToJoin,
        overallExperience: userData[0].candidate.overallExperience,
      });

      setformValue({
        fullname: userData[0].candidate.fullname,
        currentCity: userData[0].candidate.currentCity,
        country: userData[0].candidate.country,
      });

      setformValueAdress({
        phone: userData[0].candidate.phone,
        email: userData[0].candidate.email,
        linkedInUrl: userData[0].candidate.linkedInUrl,
        resumeLink: resumeData,
        relocation: userData[0].candidate.relocation,
        needVisaSponsorship: userData[0].candidate.needVisaSponsorship,
        typeOfJob: userData[0].candidate.typeOfJob,
        interestedRole: userData[0].candidate.interestedRole,
        currentRole: userData[0].candidate.currentRole,
        expectedRateC2CorC2H: userData[0].candidate.expectedRateC2CorC2H,
        timeToJoin: userData[0].candidate.timeToJoin,
        overallExperience: userData[0].candidate.overallExperience,
        previousEmployers: userData[0].candidate.previousEmployers,
      });
   
      const strengthValue = calculateProfileStrength(userData[0].candidate)
      setProfileStrength(strengthValue)
    }
  }, [userData]);

  

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn edtBtn"
              data-toggle="modal"
              data-target="#photo"
            >
              <BsPencil />
            </button>

            <div
              className="modal fade"
              id="photo"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalCenterTitle"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content modalContent">
                  <div className="modal-header">
                    <h5 className="modal-title mx-3 " id="exampleModalLongTitle">
                      {" "}
                      Edit Name and Location
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
                  <div className="modal-body  ">
                    <form onSubmit={handleSubmit(onSubmitNameLocation)}>
                      {promiseInProgress === true ? <Loading /> : null}

                      <div className="row m-3 ">
                        <label className="labelPos">Name </label>
                        <input
                          type="text"
                          className="form-control"
                          value={formValue.fullname}
                          onChange={handleChange}
                          name="fullname"
                        />
                      </div>

                      <div className="row m-3 ">
                        <label className="labelPos">Current City </label>
                        <input
                          type="text"
                          className="form-control"
                          value={formValue.currentCity}
                          onChange={handleChange}
                          name="currentCity"
                        />
                      </div>

                      <div className="row m-3 ">
                        <label className="labelPos">Country </label>
                        <input
                          type="text"
                          className="form-control"
                          value={formValue.country}
                          onChange={handleChange}
                          name="country"
                        />
                      </div>

                      <div className="modal-body d-flex justify-content-center">
                        <button
                          type="submit"
                          className="buttonSend me-md-2"
                          style={{ background: "var(--list-item-color)" }}
                        >
                          Save
                        </button>
                      </div>
                      <p className="text-center fs-6" style={{ color: "green" }}>
                        {successMessageRenameLocation}
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column align-items-center text-center">
            {/* Profile Image  start*/}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={imageUploader}
              style={{
                display: "none",
              }}
            />

            <div
              className="rounded-circle profilePic"
              style={{
                height: "100px",
                width: "100px",
                border: "1px solid black",
              }}
              onClick={() => imageUploader.current.click()}
            >
              <img
                className=" rounded-circle"
                src={
                  profilePic === null || profilePic === undefined
                    ? uesrImageDefault
                    : profilePic
                }
                ref={uploadedImage}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "acsolute",
                }}
                alt="profilePic"
              />
              <div className="profilePicEditBtn rounded-circle border-dark">
                {" "}
                <BsFillPencilFill className="BsFillPencilFill" size={13} />
              </div>
            </div>

            {/* Profile Image  end*/}

            <div className="mt-3 mb-2">
              <p className="text-center mt-1 heading-name">
                {formValue.fullname}
              </p>

              <p className="text-center">

                <i
                  className="fa fa-map-marker me-2"
                  aria-hidden="true"
                ></i>
                {formValue.currentCity} ,{formValue.country}
              </p>
            </div>

            <ProfileStrengthIndicator   profileStrengthVal={ProfileStrength} /> 

            {/* <div className="sidebarBtnGroup">

              <div className="d-flex justify-content-center mb-1">
                <button className="btn sidebarBtnCand d-flex align-content-center " onClick={() => { menuSelection('Personal'); mixpanelButton('Candidate Clicked on Personal page', 'On click of Personal page'); }}>
                  <BsFillPersonFill size={28} /> <span className=" " style={{ fontWeight: "500", fontSize: "20px", marginLeft: "0.8rem" }}>  Personal </span>
                </button>
              </div>

              <div className="d-flex justify-content-center mb-1">
                <button className="btn sidebarBtnCand d-flex align-content-center " onClick={() => { menuSelection('Professional'); mixpanelButton('Candidate Clicked on Professional page', 'On click of Professional page'); }}>
                  <FaUserTie size={25} /> <span style={{ fontWeight: "500", fontSize: "20px", marginLeft: "0.8rem" }} > Professional  </span>
                </button>
              </div>

              <div className="d-flex justify-content-center mb-1">
                <button className="btn sidebarBtnCand d-flex align-content-center " onClick={() => { menuSelection('Message'); mixpanelButton('Candidate Clicked on Message page', 'On click of Message page'); }}>
                  <MdMessage size={25} /> <span style={{ fontWeight: "500", fontSize: "20px", marginLeft: "0.8rem" }} > Messages  </span>
                </button>
              </div>

              <div className="d-flex justify-content-center mb-1">
                <button className="btn sidebarBtnCand d-flex align-content-center " onClick={() => menuSelection('Message')}>
                  <MdMessage size={28} /> <span style={{ fontWeight: "500", fontSize: "20px", marginLeft: "0.8rem" }}>  Message </span>
                </button></div>

              <div className="d-flex justify-content-center mb-1">
                <button className="btn sidebarBtnCand d-flex align-content-center " onClick={() => { menuSelection('Referal'); mixpanelButton('Candidate Clicked on Refer candidates page', 'On click of Refer link'); }}>
                  <MdLibraryAdd size={25} /> <span style={{ fontWeight: "500", fontSize: "20px", marginLeft: "0.8rem" }} > Referral </span>
                </button>
              </div>

              <div className="d-flex justify-content-center mb-1">
                <button className="btn sidebarBtnCand d-flex align-content-center " onClick={() => menuSelection('Dashboard')}>
                  <BsGridFill size={25} /> <span style={{ fontWeight: "500", fontSize: "20px", marginLeft: "0.8rem" }} > Dashboard  </span>
                </button>
              </div>

            </div> */}
          </div>

          <hr
            style={{
              background: "#D9D9D9",
              marginTop: "0px",
              marginBottom: "0px",
            }}
          />

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn edtBtn"
              data-toggle="modal"
              data-target="#address"
            >
              <BsPencil />
            </button>

            <div
              className="modal fade"
              id="address"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalCenterTitle"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content modalContent">
                  <div className="modal-header">
                    <h5 className="modal-title mx-3" id="exampleModalLongTitle">
                      Edit Info
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
                    <form onSubmit={handleSubmit(onSubmitAddress)}>
                      {promiseInProgress === true ? <Loading /> : null}

                      <div className="row m-3 ">
                        <label className="labelPos">Phone </label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="Please enter 10 digit mobile number"
                          name="phone"
                          pattern="^(1[ \-\+]{0,3}|\+1[ -\+]{0,3}|\+1|\+)?((\(\+?1-[2-9][0-9]{1,2}\))|(\(\+?[2-8][0-9][0-9]\))|(\(\+?[1-9][0-9]\))|(\(\+?[17]\))|(\([2-9][2-9]\))|([ \-\.]{0,3}[0-9]{2,4}))?([ \-\.][0-9])?([ \-\.]{0,3}[0-9]{2,4}){2,3}$"
                          value={formValueAddress.phone}
                          onChange={handleChangeAddress}
                        />
                      </div>

                      <div className="row m-3 ">
                        <label className="labelPos">Email Address </label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                          value={formValueAddress.email}
                          onChange={handleChangeAddress}
                        />
                      </div>
                      <div className="row m-3 ">
                        <label className="labelPos">Linkedin URl </label>
                        <input
                          type="url"
                          className="form-control"
                          name="linkedInUrl"
                          value={formValueAddress.linkedInUrl}
                          onChange={handleChangeAddress}
                        />
                      </div>

                      <div className="row m-3 ">
                        <label className="labelPos">Resume </label>
                        <input
                          className="form-control"
                          type="file"
                          name="file_upload"
                          accept="application/pdf, .doc, .docx"
                          onChange={resumeUpload}
                        />
                        <p className="text-end fs-6" style={{ color: "green" }}>
                          {successMessageResumeUploaded}
                        </p>
                      </div>

                      <div className="d-flex justify-content-center mt-3 mb-3">
                        <button
                          type="submit"
                          className="buttonSend me-md-2"
                          style={{ background: "var(--list-item-color)" }}
                        >
                          Save
                        </button>
                      </div>

                      <p className="text-center fs-6" style={{ color: "green" }}>
                        {successMessageAddress}
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="row pb-2">
              <div className="col">
                <MdCall />
                <span className="professional-candidate-heading">
                  {" "}
                  Phone No
                </span>
              </div>
              <div className="col" style={{ textAlign: "end" }}>
                <span className="professional-candidate-subheading">
                  {formValueAddress.phone}
                </span>
              </div>
            </div>
            <div className="row pb-2">
              <div className="col">
                <MdEmail />
                <span className="professional-candidate-heading">
                  {" "}
                  Email
                </span>
              </div>
              <div className="col" style={{ textAlign: "end" }}>
                <span className="professional-candidate-subheading">
                  {formValueAddress.email}
                </span>
              </div>
            </div>
            <div className="row pb-2">
              <div className="col">
                <BsLinkedin />
                <span className="professional-candidate-heading">
                  {" "}
                  LinkedIn
                </span>
              </div>
              <div className="col" style={{ textAlign: "end" }}>
                <span className="professional-candidate-subheading">
                  <a
                    href={formValueAddress.linkedInUrl}
                    target="_blank"
                    className="m-1"
                    style={{ color: "rgb(128, 27, 211)" }}
                  >
                    <u> {subString(formValueAddress.linkedInUrl, 27)} </u>
                  </a>
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center">
            <a href={resumeData} className="sidebarResumeBtn" download>
              {" "}
              <BsFillFileEarmarkMinusFill /> Resume
              <BsArrowDown />{" "}
            </a>
          </div>
        </div>
      </div>

      <div className="card mt-lg-4 mt-3 mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn edtBtn"
              data-toggle="modal"
              data-target="#userData"
            >
              <BsPencil />
            </button>

            <div
              className="modal fade"
              id="userData"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalCenterTitle"
              aria-hidden="true"
            >
              <div
                className="modal-dialog modal-lg modal-dialog-centered"
                role="document"
              >
                <div className="modal-content modalContent">
                  <div className="modal-header">
                    <h5 className="modal-title mx-3" id="exampleModalLongTitle">
                      Edit Info
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
                    <form onSubmit={handleSubmit(onSubmitMiddle)}>
                      {promiseInProgress === true ? <Loading /> : null}
                      <div className="row m-3 ">
                        <label className="labelPos">Open to relocate </label>
                        <select
                          className="form-control "
                          name="relocation"
                          onChange={handleChangeMiddle}
                        >
                          <option value={formValueMiddle.relocation} selected disabled > {formValueMiddle.relocation} </option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>

                      <div className="row m-3 ">
                        <label className="labelPos">
                          Do you need Visa Sponsorship ?
                        </label>
                        <select
                          className="form-control "
                          name="needVisaSponsorship"
                          onChange={handleChangeMiddle}
                        >
                          <option value={formValueMiddle.needVisaSponsorship} selected disabled > {formValueMiddle.needVisaSponsorship} </option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>

                      <div className="row m-3 ">
                        <label className="labelPos">
                          Type of Job you want*
                        </label>
                        <select
                          className="form-control "
                          name="typeOfJob"
                          onChange={handleChangeMiddle}
                        >
                          <option value={formValueMiddle.typeOfJob} selected disabled > {formValueMiddle.typeOfJob} </option>
                          <option value="Fulltime"> Fulltime</option>
                          <option value="C2C"> C2C </option>
                          <option value="C2H"> C2H </option>
                          <option value="Parttime"> Parttime </option>
                        </select>
                      </div>

                      <div className="row m-3">
                        <label className="labelPos">Role you want*</label>
                        <input
                          type="text"
                          list="jobRoledata"
                          className="form-control "
                          name="interestedRole"
                          value={formValueMiddle.interestedRole}
                          onChange={handleChangeMiddle}

                        />
                        <datalist id="jobRoledata">
                          {jobRoleSelection.jobRoleList.data.map((d, i) => {
                            return (
                              <>
                                <option key={i} value={d.role} />
                              </>
                            );
                          })}
                        </datalist>
                      </div>

                      <div className="row m-3 ">
                        <label className="labelPos"> Current Role* </label>
                        <input
                          type="text"
                          className="form-control "
                          name="currentRole"
                          value={formValueMiddle.currentRole}
                          onChange={handleChangeMiddle}
                        />
                      </div>

                      <div className="row m-3 ">
                        <label className="labelPos">
                          Expected Rate for C2C/C2H (USD/per hour)
                        </label>

                        <input
                          type="number"
                          min="0"
                          className="form-control "
                          name="expectedRateC2CorC2H"
                          value={formValueMiddle.typeOfJob === "Fulltime" ? "" : formValueMiddle.expectedRateC2CorC2H}
                          onChange={handleChangeMiddle}
                          disabled={formValueMiddle.typeOfJob === "Fulltime" ? true : false}
                        />
                      </div>

                      <div className="row m-3 ">
                        <label className="labelPos">

                          When can you join
                        </label>
                        <select
                          className="form-control "
                          name="timeToJoin"
                          onChange={handleChangeMiddle}

                        >
                          <option value={formValueMiddle.timeToJoin} selected disabled >
                            {formValueMiddle.timeToJoin}
                          </option>
                          <option value={1}>1 </option>
                          <option value={2}>2 </option>
                          <option value={3}>3 </option>
                          <option value={4}>4 </option>
                        </select>
                      </div>

                      <div className="row m-3 ">
                        <label className="labelPos">
                          Overall experience(Years)
                        </label>

                        <input
                          type="number"
                          min="0"
                          max="50"
                          className="form-control "
                          name="overallExperience"
                          value={formValueMiddle.overallExperience}
                          onChange={handleChangeMiddle}
                        />
                      </div>

                      <div className="d-flex justify-content-center mt-3 mb-3">
                        <button
                          type="submit"
                          className="buttonSend me-md-2"
                          style={{ background: "var(--list-item-color)" }}
                        >
                          Save
                        </button>
                      </div>

                      <p className="text-center fs-6" style={{ color: "green" }}>
                        {successMessageRenameLocation}
                      </p>
                    </form>

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="professional-candidate-info">
            <div className="row pb-2">
              <div className="col-9">
                <span className="professional-candidate-heading">
                  Open to Recolation
                </span>
              </div>
              <div className="col-3" style={{ textAlign: "end" }}>
                <span className="professional-candidate-subheading">
                  {formValueMiddle.relocation}
                </span>
              </div>
            </div>
            <div className="row pb-2">
              <div className="col-9">
                <span className="professional-candidate-heading">
                  Need Visa Sponsorship ?
                </span>
              </div>
              <div className="col-3" style={{ textAlign: "end" }}>
                <span className="professional-candidate-subheading">
                  {formValueMiddle.needVisaSponsorship}
                </span>
              </div>
            </div>
            <div className="row pb-2">
              <div className="col-9">
                <span className="professional-candidate-heading">
                  Type of job you want{" "}
                </span>
              </div>
              <div className="col-3" style={{ textAlign: "end" }}>
                <span className="professional-candidate-subheading">
                  {formValueMiddle.typeOfJob}
                </span>
              </div>
            </div>
            <div className="row pb-2">
              <div className="col-4" style={{ paddingRight: '0px' }}>
                <span className="professional-candidate-heading">
                  Role You Want
                </span>
              </div>
              <div className="col-8" style={{ textAlign: "end", paddingLeft: '0px' }}>
                <span className="professional-candidate-subheading">
                  {formValueMiddle.interestedRole}
                </span>
              </div>
            </div>
            <div className="row pb-2">
              <div className="col-4">
                <span className="professional-candidate-heading">
                  Current Role
                </span>
              </div>
              <div className="col-8" style={{ textAlign: "end" }}>
                <span className="professional-candidate-subheading">
                  {formValueMiddle.currentRole}
                </span>
              </div>
            </div>
            <div className="row pb-2">
              <div className="col-9">
                <span className="professional-candidate-heading">
                  Expected Rate for C2C / C2H{" "}
                </span>
              </div>
              <div className="col-3" style={{ textAlign: "end" }}>
                <span className="professional-candidate-subheading">
                  {formValueMiddle.typeOfJob === "Fulltime" ? "NA" : "$ " + formValueMiddle.expectedRateC2CorC2H}
                </span>
              </div>
            </div>
            <div className="row pb-2">
              <div className="col-8">
                <span className="professional-candidate-heading">
                  When Can you Join (weeks)
                </span>
              </div>
              <div className="col-4" style={{ textAlign: "end" }}>
                <span className="professional-candidate-subheading">
                  {formValueMiddle.timeToJoin} weeks
                </span>
              </div>
            </div>
            <div className="row pb-2">
              <div className="col-9">
                <span className="professional-candidate-heading">
                  Overall Experience (Years)
                </span>
              </div>
              <div className="col-3" style={{ textAlign: "end" }}>
                <span className="professional-candidate-subheading">
                  {formValueMiddle.overallExperience} years
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-lg-4 mt-3 mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <span
              style={{
                fontWeight: "500",
                fontSize: "18px",
                color: "#444444",
              }}
            >
              <b>Companies and Clients </b>
            </span>
            <button
              type="button"
              className="btn edtBtn"
              data-toggle="modal"
              data-target="#companiesClient"
            >
              <BsPencil />
            </button>

            <div
              className="modal fade"
              id="companiesClient"
              tabindex="-1"
              role="dialog"
              aria-labelledby="exampleModalCenterTitle"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content modalContent">
                  <div className="modal-header">
                    <h5 className="modal-title mx-3" id="exampleModalLongTitle">
                      Edit Companies and Clients
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
                    <form onSubmit={handleSubmit(onSubmitPriviousEmp)}>
                      {promiseInProgress === true ? <Loading /> : null}

                      <input
                        type="text"
                        className="form-control"
                        name="previousEmployers"
                        defaultValue={formValueAddress.previousEmployers[0]}
                        {...register("previousEmployers")}
                      />
                      <div className="d-flex justify-content-center mt-3 mb-3">
                        <button
                          type="submit"
                          className="buttonSend me-md-2"
                          style={{ background: "var(--list-item-color)" }}
                        >
                          Save
                        </button>
                      </div>

                    </form>
                    <p className="text-center fs-6" style={{ color: "green" }}>
                      {successMessageAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="d-flex flex-row flex-wrap">
            {formValueAddress.previousEmployers.length > 0
              ? formValueAddress.previousEmployers.map((val, i) => {
                return (
                  <div className="previous-employer-box pt-2 m-1" style={{ height: "35px", width: "auto", borderRadius: "5px" }} >
                    <p key={i}>{val} </p> <button type="button" onClick={() => handleDeleteCompany(val)}> <RxCrossCircled /> </button>
                  </div>
                )
              }) : ""}
          </div>

        </div>
      </div>
    </>
  );
};

export default Sidebar;
