import axios from "axios";
import $ from "jquery";
import react, { useContext, useEffect, useState } from "react";
import uesrImageDefault from "../../Assets/profilePic.png";
import { useForm } from "react-hook-form";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsFillPencilFill } from "react-icons/bs";
import { MdLibraryAdd } from "react-icons/md";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import Loading from "../../Component/Loading/loading";
import { userContext } from "../../Context/userContextState";
import ApiConstants from "../../Services/apiconstants";
import { picSizeValidate } from "../../UtilitiesFunctions/utilitiesFunction";
import { Interceptor } from "../../ErrorStatus/errorStatus"
import "./referalSidebar.css";
import { selectSidebarMenuSelection } from "../../Redux/Reducer/sidebarMenuSelectionSlice";


const ReferalSidebar = () => {

  const { userData, profilePic, setProfilePic } = useContext(userContext)


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

  const dispatch = useDispatch();

  const menuSelection = (data) => {

    dispatch(selectSidebarMenuSelection(data));
  };


  const { promiseInProgress } = usePromiseTracker();
  const {
    formState: { },
  } = useForm();


  // upload image  start

  const uploadedImage = react.useRef(null);
  const imageUploader = react.useRef(null);

  const handleImageUpload = e => {

    const [file] = e.target.files;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('imageName', file.name)

    if (picSizeValidate(file.size)) {

      trackPromise(
        axios
          .post(
            ApiConstants.UPLOAD_PROFILE_PIC,
            formData,
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

              setProfilePic(response.data.imageLink)

              Swal.fire({
                title: "Profile Pic Uploaded",
                icon: "success",
                width: 400,
                height: 100,
              })

              setTimeout(() => {
                $("[data-dismiss=modal]").trigger({ type: "click" })
              }, 1000)

            }).catch((error) => {
              if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
                Interceptor(error.response.status)
              }
            })
      )
    }
    else {

      Swal.fire({
        title: "Pic size should be less than 0.5MB",
        icon: "error",
        width: 400,
        height: 100,
      })

    }
  }

  //upload image end
  // Address axios section start




  // file upload
  const [formValue, setformValue] = useState({
    fullname: "",
  });



  useEffect(() => {
    if (userData != 0) {
      setformValue({ fullname: userData[0].candidate.fullname })

    }
  }, [userData])


  return (
    <>
      <div className="card ">
        <div className="card-body">
          <div className="d-flex justify-content-end">

            <div className="modal fade" id="photo" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content modalContent">
                  <div className="modal-header">
                    <h5 className="modal-title mx-4" id="exampleModalLongTitle"> Edit Name </h5>
                    <button type="button" className="btn" data-dismiss="modal" aria-label="Close">
                      <AiOutlineCloseCircle />
                    </button>
                  </div>
                  <div className="modal-body  ">

                    <form

                    // onSubmit={handleSubmit(onSubmitNameLocation)}
                    >
                      {promiseInProgress === true ? <Loading /> : null}

                      <div className="row mt-3 mx-4  ">
                        <label className="ml-0" style={{ marginLeft: "-0.5rem" }} htmlFor="fullname"> Name</label>
                        <input
                          type="text"
                          className="form-control"
                          // value={formValue.fullname}
                          // onChange={handleChange}
                          name="fullname"
                        />
                      </div>

                      <div className="modal-body  d-flex justify-content-center">
                        <button
                          type="submit"
                          className="buttonSend me-md-2 "
                        >
                          Save
                        </button>

                      </div>
                      <p className="text-center fs-6" style={{ color: "green" }}>
                        {/* {successMessageRenameLocation} */}
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column align-items-center text-center"  >

            {/* Profile Image  start*/}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={imageUploader}
              style={{
                display: "none"
              }}
            />

            <button
              className="rounded-circle profilePic"
              style={{
                height: "100px",
                width: "100px",
                border: "1px solid black",
              }}
              onClick={() => imageUploader.current.click()}
              type="button"
            >
              <img
                className="rounded-circle"
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
              <div className="profilePicEditBtn rounded-circle border-dark" > <BsFillPencilFill className="BsFillPencilFill" size={13} />
              </div>

            </button>

            {/* Profile Image  end*/}

            <div className="mt-3 mb-2">

              <p className="text-center mt-1 heading-name">
                {formValue.fullname}
              </p>

            </div>

            <div className="sidebarBtnGroup">

              <div className="d-flex justify-content-center mb-1">
                <button className="btn sidebarBtnCand d-flex align-content-center " onClick={() => menuSelection('Personal')}>
                  <MdLibraryAdd size={28} /> <span className=" " style={{ fontWeight: "500", fontSize: "20px", marginLeft: "0.8rem" }}> Referral </span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default ReferalSidebar