import React from 'react'
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsLinkedin} from "react-icons/bs";
import { subString, subStringDescription} from "../../../../UtilitiesFunctions/utilitiesFunction";
import StarRating from "../../../../Component/StarRating/starRating";
const ApprovedRecomm = (props) => {
    return (
        <>
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
                    <span style={{ color: "red" }}>  <a href={props.recommenderLinkedInUrl} target="_blank" style={{ fontSize: "12px", color: "rgb(128, 27, 211)" }}  >    <span style={{ color: "rgb(128, 27, 211)" }}><BsLinkedin />
                     <u>{subString(props.recommenderLinkedInUrl, 27)} </u>
                     </span> </a> </span>
                    
                     <div className="mx-2 mt-2" style={{ fontSize: "12px" }}>
    Skills:
    {props.skills.length > 0 ? (
        props.skills.map((x) => (
            <span key={x.skillId.id} style={{ fontSize: "12px" }}>
                {x.skillId.skill} &#44;
            </span>
        ))
    ) : (
        " "
    )}
</div>



            
                    <span className="mx-2" style={{ fontSize: "12px" }}>Description : </span>
                    <span className="mx-2" style={{ fontSize: "12px" }}> 
                    {subStringDescription(props.messageByRequester, 0, 50)} 
                    </span>
                </div>


                <div>
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        data-toggle="modal"
                        data-target={".requested" + `${props._id}`}
                        style={{ fontSize: "12px", position: 'relative', width: '100px' }}
                    >
                        view more
                    </button>
                </div>

                <div
                    className={"modal fade requested" + `${props._id}` }
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalCenterTitle"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content modalContent">
                            <div className="modal-header">
                                <p className="modal-title mx-3" id="exampleModalLongTitle">
                                    Recommendation Details
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
                                <div className="row mx-2  " >
                                  <div className="col-md-6" > <p className="text-start" style={{ fontSize: "1.1rem", color: "#6F6F6F" }}>Name </p> </div>
                                  <div className="col-md-6" > <p className="text-start" style={{ fontSize: "1.1rem" }}>
                                    {props.recommenderName}
                                  </p> </div>
                                </div>

                                <div className="row mx-2" >
                                    <div className="col-md-6" > <p className="text-start" style={{ fontSize: "1.1rem", color: "#6F6F6F" }}>LinkedIn URL </p> </div>
                                    <div className="col-md-6" > <a href="#" target="_blank" className="text-start" style={{ fontSize: "1.1rem", color: "rgb(128, 27, 211)" }} >
                                        {props.recommenderLinkedInUrl}
                                    </a> </div>
                                </div>

                                <div className="row  mx-2" >
                                    <div className="col-md-6" > <p className="text-start" style={{ fontSize: "1.1rem", color: "#6F6F6F" }}>Email address </p> </div>
                                    <div className="col-md-6" > <p className="text-start" style={{ fontSize: "1.1rem" }}>
                                        {props.recommenderEmail}
                                    </p> </div>
                                </div>

                                <p className="mt-3 mb-3 mx-4"> <b> Skill Rating </b> </p>


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


                                <p className="mt-3 mb-1 mx-4"> <b>Requester Note  </b> </p>

                                <p className="mx-4"> {props.messageByRequester}  </p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ApprovedRecomm