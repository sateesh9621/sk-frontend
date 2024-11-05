import axios from "axios";
import $ from "jquery";
import React, { useContext } from 'react';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsLinkedin } from "react-icons/bs";
import Swal from "sweetalert2";
import StarRating from "../../../../../Component/StarRating/starRating";
import ApiConstants from "../../../../../Services/apiconstants";
import { subString, subStringDescription } from '../../../../../UtilitiesFunctions/utilitiesFunction';
import { userContext } from "../../../../../Context/userContextState";
import { Interceptor } from "../../../../../ErrorStatus/errorStatus";



const RecievedSection = (props) => {
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
  const { getData } = useContext(userContext)

  const approveRecommendation = async (id) => {

    await axios
      .post(
        ApiConstants.APPROVE_RECEIVED_RECOMMENDATION + `${id}`
        , {status: "APPROVED"},
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

        Swal.fire({
          title: "Recommendation Approved Succuesfully",
          html: "Recommendation",
          icon: "success",
          allowOutsideClick: true,
          allowEscapeKey: true,
          allowEnterKey: true,
          confirmButtonText: "Ok",
        });

        setTimeout(() => {
          $("[data-dismiss=modal]").trigger({ type: "click" })
        }, 1000)

        //rak
        getData()

      }).catch((error) => {

        // if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
        //   Interceptor(error.response.status)
        // }
        console.log(error)
      })
  }


  return (
    <>

      <div className="d-flex justify-content-between mt-3">

        <div className="d-flex justify-content-between mt-3">

          <div>
            <span
              style={{
                fontWeight: "500",
                fontSize: "1rem",
                color: "#444444",
              }}
              className="m-2"
            >
              {props.recommenderName}
            </span>


            <span>  <a href={props.requesterLinkedInUrl
            } target="blank" style={{ fontSize: "12px", color: "rgb(128, 27, 211)" }}  >    <span style={{ color: "rgb(128, 27, 211)" }}><BsLinkedin /> <u> {subString(props.recommenderLinkedInUrl, 27)} </u></span> </a> </span>


            <div className="mx-2 mt-2" style={{ fontSize: "12px" }}> Skills :
              {props.skills.length > 0 ?

                props.skills.map((x) => {

                  return (<span key={x.skillId.id} style={{ fontSize: "12px" }}> {x.skillId.skill} &#44; </span>)
                }) : " "}
            </div>

            <span className="mx-2" style={{ fontSize: "12px" }}>Description : </span>
                    <span className="mx-2" style={{ fontSize: "12px" }}> 
                    {subStringDescription(props.messageByRequester, 0, 50)} 
                </span>
          </div>
        </div>

        <div>
          <button
            type="button"
            className="btn btn-outline-primary"
            data-toggle="modal"
            data-target={".recieved" + `${props.candidateId}`}
          >
            Pending...
          </button>


        </div>

        <div
          className={"modal fade recieved" + `${props.candidateId}`}

          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content modalContent">
              <div className="modal-header">

                <h5 className="modal-title mx-4" id="exampleModalLongTitle">
                  Recommendation received
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

                <div className="row mx-2  " >
                  <div className="col-md-6" > <p className="text-start" style={{ fontSize: "1.1rem", color: "#6F6F6F" }}>Name </p> </div>
                  <div className="col-md-6" > <p className="text-start" style={{ fontSize: "1.1rem" }}> {props.recommenderName} </p>  </div>
                  
                </div>

                <div className="row mx-2" >
                  <div className="col-md-6" > <p className="text-start" style={{ fontSize: "1.1rem", color: "#6F6F6F" }}>LinkedIn URL </p> </div>
                  <div className="col-md-6" > <a href={props.requesterLinkedInUrl} target="_blank" className="text-start" style={{ fontSize: "1.1rem", color: "rgb(128, 27, 211)" }} >
                    {props.requesterLinkedInUrl}
                  </a> </div>
                </div>

                <div className="row  mx-2" >
                  <div className="col-md-6" > <p className="text-start" style={{ fontSize: "1.1rem", color: "#6F6F6F" }}>Email address </p> </div>
                  <div className="col-md-6" > <p className="text-start" style={{ fontSize: "1.1rem" }}>
                    {props.requesterEmail}
                  </p> </div>
                </div>

                <div className="d-flex justify-content-between">
                  <p className="mt-3 mb-3 mx-4"> <b> Skill Rating  </b> </p>
                  <div className="mr-4" style={{    marginRight: "2%"}} >   
                    <button
                    type="button"
                    className="btn btn-outline-success "
                    data-toggle="modal"
                    onClick={() => approveRecommendation(props._id) }
                  >
                    Approve
                  </button>
                  </div>
                </div>


                {props.skills.length > 0 ?

                  props.skills.map((x) => {

                    return (
                      <div key={x._id} className="mx-4" >
                        <div className="d-flex justify-content-between mt-5">

                          <div className=""> <span> <b>{x.skillId.skill}</b> </span> </div>

                          <div className="">
                            <StarRating rating={x.rating} />
                          </div>

                        </div>
                        <hr></hr>
                      </div>
                    )
                  }) : " "}

                <p className="mt-3 mb-1 mx-3"> <b>Recommendation note   </b> </p>

                <p className="mx-3"> {props.commentsByRecommender} </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>


  )
}

export default RecievedSection
