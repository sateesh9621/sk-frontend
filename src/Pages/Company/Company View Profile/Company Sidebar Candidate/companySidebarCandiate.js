
import react, { useEffect, useState } from "react";
import { MdCall, MdEmail} from "react-icons/md";
import uesrImageDefault from "../../../../Assets/profilePic.png";
import { subString } from "../../../../UtilitiesFunctions/utilitiesFunction";
import { BsArrowDown,BsFillFileEarmarkMinusFill,BsLinkedin } from "react-icons/bs";
import "./companySidebarCandidate.css";


const CompanySidebarCandidate = (props) => {
  
const [previousEmployersData , setPreviousEmployersData] = useState([])

useEffect(() => {
setPreviousEmployersData(props.previousEmployers)
},[])


return (
    <>
      <div className="card">
        <div className="card-body">
         

          <div className="d-flex flex-column align-items-center text-center">
            {/* Profile Image  start*/}

            <div
              className="rounded-circle profilePic"
              style={{
                height: "100px",
                width: "100px",
                border: "1px solid black",
              }}
              
            >
              <img
                className=" rounded-circle"
                src={ uesrImageDefault}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "acsolute",
                }}
                alt="uesrImage"
              />
             
            </div>

            {/* Profile Image  end*/}

            <div className="mt-3 mb-2">
              <p className="text-center mt-1 heading-name">
                {props.fullname}
               
              </p>

              <p className="text-center">

                <i
                  className="fa fa-map-marker me-2"
                  aria-hidden="true"
                ></i>
                {props.currentCity} ,{props.country}
      
                </p>
            </div>

          
          </div>

          <hr
            style={{
              background: "#D9D9D9",
              marginTop: "0px",
              marginBottom: "0px",
            }}
          />

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
                  {props.phone}
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
                  {props.email} 
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
                    href={props.linkedInUrl}
                    target="_blank"
                    className="m-1"
                    style={{ color: "rgb(128, 27, 211)" }}
                  >
                    <u> {subString(props.linkedInUrl, 27)} </u>
                  </a>
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center">
            <a 
             href={props.resumeData} 
            className="sidebarResumeBtn" 
            download>

              <BsFillFileEarmarkMinusFill /> Resume
              <BsArrowDown />
            </a>
          </div>
        </div>
      </div>

      <div className="card mt-lg-4 mt-3 mb-3">
        <div className="card-body">
         
          <div className="professional-candidate-info">
            <div className="row pb-2">
              <div className="col-9">
                <span className="professional-candidate-heading">
                  Open to Recolation
                </span>
              </div>
              <div className="col-3" style={{ textAlign: "end" }}>
                <span className="professional-candidate-subheading">
                  {props.relocation} 
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
                  {props.needVisaSponsorship} 
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
                  {props.typeOfJob}
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
                  {props.interestedRole == null || props.interestedRole == undefined ? "":props.interestedRole.role } 
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
                  {props.currentRole}
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
                  {props.typeOfJob === "Fulltime" ? "NA" : "$ " + props.expectedRateC2CorC2H}
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
                  {props.timeToJoin} weeks
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
                  {props.overallExperience} years
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
          

          </div>


          <div className="d-flex flex-row flex-wrap">
            {previousEmployersData.length > 0
              ? previousEmployersData.map((val, i) => {
                return (
                  <div className="previous-employer-box pt-2 m-1" style={{ height: "35px", width: "auto", borderRadius: "5px" }} >
                    <p key={i}>{val} </p> 
                  </div>
                )
              }) : ""}
          </div>

        </div>
      </div>
    </>
  );
};

export default CompanySidebarCandidate;
