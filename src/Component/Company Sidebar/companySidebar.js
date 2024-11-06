import react, { useEffect, useState } from "react";
import "./companySidebar.css";
import { useDispatch, useSelector } from "react-redux";
import ApiConstants from "../../Services/apiconstants";
import Swal from "sweetalert2";
import axios from "axios";
import { trackPromise } from "react-promise-tracker";
// import { Icon } from '@iconify/react';
import { BsFillPencilFill } from "react-icons/bs";
import Mixpanel from "../../Services/mixpanel";
import { picSizeValidate } from "../../UtilitiesFunctions/utilitiesFunction";
import { Interceptor } from "../../ErrorStatus/errorStatus";
import { selectSidebarMenuSelection } from "../../Redux/Reducer/sidebarMenuSelectionSlice";
import { selectCardItemSelection } from "../../Redux/Reducer/cardItemSelectionSlice";

export default function CompanySidebar() {
  const dispatch = useDispatch();
  const [companyName, setCompanyName] = useState("");

  const candidateData = JSON.parse(
    sessionStorage.getItem("company_loggedin_user_data")
  );
  const token = candidateData.token;
  const userId = candidateData._id;
  const profileImage =
    candidateData.company.imageLink != undefined
      ? candidateData.company.imageLink
      : "";
  const companyEmailId = candidateData.company.email;

  const menuSelectionRedux = useSelector(
    (state) => state.sidebarMenuSelectionReducer
  );
  const menuSelection = (data) => {
    // Mixpanel(data, mixpanelData)
    dispatch(selectSidebarMenuSelection(data));
    dispatch(selectCardItemSelection(""));
  };
  const mixpanelButton = (purpose, buttonName) => {
    Mixpanel(purpose, buttonName, "", companyEmailId);
  };
  useEffect(() => {
    setCompanyName(candidateData.company.companyName);
  }, []);

  const uploadedImage = react.useRef(null);
  const imageUploader = react.useRef(null);

  const handleImageUpload = (e) => {
    const [file] = e.target.files;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("imageName", file.name);

    // if (file) {
    //   const reader = new FileReader();
    //   const { current } = uploadedImage;
    //   current.file = file;
    //   reader.onload = e => {
    //     current.src = e.target.result;
    //   };
    //   reader.readAsDataURL(file);
    // }

    if (picSizeValidate(file.size)) {
      trackPromise(
        axios
          .post(ApiConstants.COMPANY_PROFILE_PIC_UPLOAD, formData, {
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
            Swal.fire({
              title: "Profile Pic Uploaded",
              icon: "success",
              width: 400,
              height: 100,
            });
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
    } else {
      Swal.fire({
        title: "Pic size should be less than 0.5MB",
        icon: "error",
        width: 400,
        height: 100,
      });
    }
  };

  return (
    <div className="sidebar-box">
      <div className="edit-option">
        <span className="iconify" data-icon="fa6-solid:pen"></span>
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
          className="rounded-circle "
          role="button"
          tabIndex={0}
          aria-label="Upload Profile Picture"
          style={{
            height: "100px",
            width: "100px",
            border: "1px solid black",
          }}
          onClick={() => imageUploader.current.click()}
        >
          <img
            className="rounded-circle"
            ref={uploadedImage}
            src={profileImage}
            style={{
              width: "100%",
              height: "100%",
              position: "acsolute",
            }}
            alt="image"
          />
          <div className="profilePicEditBtn rounded-circle border-dark">
            {" "}
            <BsFillPencilFill className="BsFillPencilFill" size={13} />
          </div>
        </div>

        {/* Profile Image  end*/}
      </div>

      <div className="company-name">
        <span className="company-title">{companyName}</span>
      </div>
      {/* <div className="company-location">
          <i className="fa fa-map-marker me-2" aria-hidden="true"></i>
          <span className="location">Lucknow, India</span>
        </div> */}
      <div className="list-group-view">
        <div
          className="all_candidate alignment-menu-global"
          onClick={() => menuSelection("allCandidate")}
          role="button"
          tabIndex={0}
        >
          <div
            className={
              menuSelectionRedux.menuSelection == "allCandidate"
                ? menuSelectionRedux.css
                : "list-view"
            }
          >
            {/* <Icon className={"me-3 " + (menuSelectionRedux.menuSelection == 'allCandidate' ? "icons-iconify-color1" : "icons-iconify-color")} icon="clarity:users-solid" /> */}
            <span
              className={
                menuSelectionRedux.menuSelection == "allCandidate"
                  ? "list1"
                  : "list"
              }
            >
              All Candidates
            </span>
          </div>
        </div>

        <div
          className="shortlisted alignment-menu-global"
          onClick={() => menuSelection("shortlisted")}
          role="button"
              tabIndex={0}
        >
          <div
            className={
              menuSelectionRedux.menuSelection == "shortlisted"
                ? menuSelectionRedux.css
                : "list-view"
            }
          >
            {/* <Icon className={"me-3 " + (menuSelectionRedux.menuSelection == 'shortlisted' ? "icons-iconify-color1" : "icons-iconify-color")} icon="fluent:task-list-square-person-20-filled" /> */}
            <span
              className={
                menuSelectionRedux.menuSelection == "shortlisted"
                  ? "list1"
                  : "list"
              }
            >
              Shortlisted
            </span>
          </div>
        </div>

        <div
          className="rejected alignment-menu-global"
          onClick={() => menuSelection("rejected")}
          role="button"
              tabIndex={0}
        >
          <div
            className={
              menuSelectionRedux.menuSelection == "rejected"
                ? menuSelectionRedux.css
                : "list-view"
            }
          >
            {/* <Icon className={"me-3 " + (menuSelectionRedux.menuSelection == 'rejected' ? "icons-iconify-color1" : "icons-iconify-color")} icon="ic:round-group-remove" /> */}
            <span
              className={
                menuSelectionRedux.menuSelection == "rejected"
                  ? "list1"
                  : "list"
              }
            >
              Rejected
            </span>
          </div>
        </div>

        <div
          className="interviewing alignment-menu-global"
          onClick={() => {
            menuSelection("interviewing");
            mixpanelButton(
              "Clicked Interviewed candidates menu",
              "Interviewed Candiates"
            );
          }}
        >
          <div
            className={
              menuSelectionRedux.menuSelection == "interviewing"
                ? menuSelectionRedux.css
                : "list-view"
            }
          >
            {/* <Icon className={"me-3 " + (menuSelectionRedux.menuSelection == 'interviewing' ? "icons-iconify-color1" : "icons-iconify-color")} icon="fa-solid:street-view" /> */}
            <span
              className={
                menuSelectionRedux.menuSelection == "interviewing"
                  ? "list1"
                  : "list"
              }
            >
              Interviewing
            </span>
          </div>
        </div>

        <div
          className="saved alignment-menu-global"
          onClick={() => menuSelection("saved")}
          role="button"
              tabIndex={0}
        >
          <div
            className={
              menuSelectionRedux.menuSelection == "saved"
                ? menuSelectionRedux.css
                : "list-view"
            }
          >
            <span
              className={
                menuSelectionRedux.menuSelection == "saved" ? "list1" : "list"
              }
            >
              Saved
            </span>
          </div>
        </div>

        <div
          className="saved alignment-menu-global"
          onClick={() => menuSelection("message")}
          role="button"
              tabIndex={0}
        >
          <div
            className={
              menuSelectionRedux.menuSelection == "message"
                ? menuSelectionRedux.css
                : "list-view"
            }
          >
            <span
              className={
                menuSelectionRedux.menuSelection == "message" ? "list1" : "list"
              }
            >
              Messages
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
