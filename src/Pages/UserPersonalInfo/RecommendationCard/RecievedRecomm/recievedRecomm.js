import React, { useContext, useEffect, useState } from 'react';
import { userContext } from "../../../../Context/userContextState";
import RecievedSection from "./RecievedSection/recievedSection";

const Requested = (props ) => {

  if (sessionStorage.getItem('candidate_data') != null) {
    const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data"))
    
  }

  if (sessionStorage.getItem('candidate_data_ref') != null) {
    const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data_ref"))
    

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
