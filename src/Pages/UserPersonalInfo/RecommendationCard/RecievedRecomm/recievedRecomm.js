import React, { useContext, useEffect, useState } from 'react';
import { userContext } from "../../../../Context/userContextState";
import RecievedSection from "./RecievedSection/recievedSection";

const Requested = (props ) => {

  if (sessionStorage.getItem('candidate_data') != null) {
    const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data"))
    // var mixpanelData = candidateDataMix.candidate.email;
    // var token = candidateDataMix.token;
    // var userId = candidateDataMix.candidate._id;
    // var candidateEmailId = candidateDataMix.candidate.email;
  }

  if (sessionStorage.getItem('candidate_data_ref') != null) {
    const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data_ref"))
    // var mixpanelData = candidateDataMix.candidate.email;
    // var token = candidateDataMix.token;
    // var userId = candidateDataMix.candidate._id;
    // var candidateEmailId = candidateDataMix.candidate.email;

  }



  return (
    <>

      {props.recommendationData.length > 0 ?

        props.recommendationData.map((x) => {
          if (x.status === "RECIEVED") {
            return (
              <RecievedSection key={x._id}  {...x} />
            )
          }
        }) : "No Received Recommendation Yet"}

    </>
  )
}

export default Requested
