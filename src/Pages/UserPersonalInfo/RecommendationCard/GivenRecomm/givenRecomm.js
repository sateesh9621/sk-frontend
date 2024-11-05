import React, { useState, useEffect } from 'react'
import "./givenRecomm.css"
import GivenSection from "./GivenSection/givenSection"
import ApiConstants from "../../../../Services/apiconstants";
import axios from "axios"
import { Interceptor } from "../../../../ErrorStatus/errorStatus"



const GivenRecomm = () => {

   if (sessionStorage.getItem('candidate_data') != null) {
      const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data"))
     
      var userId = candidateDataMix.candidate._id;
     
   }

   if (sessionStorage.getItem('candidate_data_ref') != null) {
      const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data_ref"))
      
      
      var userId = candidateDataMix.candidate._id;
      

   }
   const [recommendationData, setRecommendationData] = useState([])


   useEffect(() => {

      const getData = async () => {
         await axios
            .get(ApiConstants.GIVEN_RECOMMENDATION + `/${userId}`)
            .then((response) => {
               setRecommendationData(response.data.candidate.recommendations)
            })
            .catch((error) => {
               if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {


                  Interceptor(error.response.status)
               }

            })
      }
      getData();
   }, [])



   return (
      <>
         <div className="card mb-3" id="personalData">
            <div className="card-body">
               {recommendationData.length > 0 ?

                  recommendationData.map((x) => {


                     return (
                        <GivenSection />
                     )

                  }) : " "}
            </div>
         </div>
      </>
   )
}

export default GivenRecomm
