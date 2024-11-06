import { useState, useEffect } from 'react';
import StudentCard from '../../../Component/Student Card/studentCard';
import ApiConstants from '../../../Services/apiconstants';
import axios from 'axios';
import Loading from '../../../Component/Loading/loading';
import { useSelector } from "react-redux";
import { Interceptor } from '../../../ErrorStatus/errorStatus';


export default function CompanyAllCandidate() {
    const [values, setValues] = useState({
        allCandidateData: {},
    });

    const skillSideFilterDataCompany = useSelector(
        (state) => state.skillSideFilterDataCompany
    );

    const rejectionCandidate = useSelector(
        (state) => state.cardItemSelection
    );

    const jobRole = useSelector(
        (state) => state.searchBar
    )

    const [hasLoaded, setHasLoaded] = useState();

    const userData = () => {
        const company_loggedin_user_data = JSON.parse(sessionStorage.getItem("company_loggedin_user_data"))
        const token = company_loggedin_user_data.token
        const userId = company_loggedin_user_data.company._id

        axios
            .post(ApiConstants.GET_ALL_CANDIDATE_FILTER_DATA,
                {
                    searchedSkills: skillSideFilterDataCompany.skill,
                    minExp: skillSideFilterDataCompany.minExp,
                    maxExp: skillSideFilterDataCompany.maxExp,
                    jobRole: jobRole.initialValue
                },
                {
                    headers: {
                        Accept: "application/json",
                        "Content-type": "application/json",
                        token: token,
                        // _id: userId,
                        "Access-Control-Allow-Origin": true,
                        "Access-Control-Allow-Methods": "GET, POST, PATCH",
                    }
                })
            .then((response) => {
                setValues({ ...values, allCandidateData: response.data.searchedCandidates });
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
    }, [rejectionCandidate, skillSideFilterDataCompany, jobRole]);



    return (hasLoaded ?
        <>
            <div className='row'>
                {values.allCandidateData.length == 0 && <div className='no-data' style={{ textAlign: 'center' }}>No Data Found</div>}
                {
                    values.allCandidateData.filter((items) => {
                        return items._id != rejectionCandidate.itemSelectId;
                    }).map(d => {
                        const candidateAllData = [d];
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