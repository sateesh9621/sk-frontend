import React, { useState, useEffect } from 'react';
import StudentCard from '../../../Component/Student Card/studentCard';
import ApiConstants from '../../../Services/apiconstants';
import axios from 'axios';
import Loading from '../../../Component/Loading/loading';
import { useSelector } from "react-redux"
import { Interceptor } from '../../../ErrorStatus/errorStatus';


export default function CompanyRejectedCandidate() {
    const [values, setValues] = useState({
        rejectedCandidateData: {},
    });

    const rejectionCandidate = useSelector(
        (state) => state.cardItemSelection
    );

    const [hasLoaded, setHasLoaded] = useState();
    const [searchTest, setSearchTest] = useState('');

    const userData = () => {
        const company_loggedin_user_data = JSON.parse(sessionStorage.getItem("company_loggedin_user_data"))
        const token = company_loggedin_user_data.token
        const userId = company_loggedin_user_data.company._id

        axios
            .get(ApiConstants.GET_REJECTED_CANDIDATE,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-type": "application/json",
                        token: token,
                        _id: userId,
                        "Access-Control-Allow-Origin": true,
                        "Access-Control-Allow-Methods": "GET, POST, PATCH",
                    }
                })
            .then(async (response) => {

                await setValues({ ...values, rejectedCandidateData: response.data.rejected });

                setHasLoaded(true);
            })
            .catch((error) => {
                if((error.response.status  >= 404  && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599 )){
      
                    Interceptor(error.response.status)
                   }
            
            });
    };
    useEffect(() => {
        userData();
    }, [rejectionCandidate]);

    return (hasLoaded ?
        <>
            <div className='row'>
                {values.rejectedCandidateData.length == 0 && <div className='no-data' style={{ textAlign: 'center' }}>No Rejected candidate yet</div>}
                {
                    values.rejectedCandidateData.filter((items) => {
                        return items.candidateId._id != rejectionCandidate.itemSelectId;
                    }).map(d => {
                        const candidateAllData = [d.candidateId];
                        return (
                            <div className='col-12'>
                                <StudentCard data={candidateAllData} />
                            </div>
                        )
                    })
                }

            </div>
        </>
        : <p>Loading... <Loading /></p>);

}