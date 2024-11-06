import React, { useState } from 'react'
import uesrImageDefault from "../../../Assets/profilePic.png";
import JobDescription from '../Job Description/jobDescription';
import { useQuery } from 'react-query'
import Loading from '../../../Component/Loading/loading'
import ApiConstants from '../../../Services/apiconstants'
import axios from 'axios'
import './cardJobs.css'
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { selectJobDataByIdelection } from '../../../Redux/Reducer/jobDataByIdReducer';


export default function CardJobs() {
    //const [jobDataById, setJobDataById] = useState(null);
    const dispatch = useDispatch();

    const getFilterDataJobs = useSelector((state) => state.filterDataJob)
    let jobDataById = useSelector((state) => state.jobDataById)
    const [cardBorder, setCardBorder] = useState({
        border: '',
        id: '',
    })

    if (sessionStorage.getItem('candidate_data') != null) {
        const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data"))
        var token = candidateDataMix.token;
    }

    const { isLoading, error, data, isFetching, refetch } = useQuery(['allJobs', getFilterDataJobs], async () => {
        return await axios.get(ApiConstants.GET_ALL_JOBS_BASED_ON_RANKING_FOR_CANDIDATE, {
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": true,
                token: token,
                "Access-Control-Allow-Methods": "GET, POST, PATCH",
            }
        }).then(res => res.data.jobs.filter((item) => {
            if (getFilterDataJobs.filteredJobData.length == 0) {
                return item
            }
            if (getFilterDataJobs.filteredJobData.length !== 0) {
                if (getFilterDataJobs.filteredJobData.company.length != 0 && getFilterDataJobs.filteredJobData.jobType.length == 0 && getFilterDataJobs.filteredJobData.experience.max.length == 0) {
                    return item.companyId.companyName.toLowerCase() == getFilterDataJobs.filteredJobData.company.toLowerCase()
                }
                if (getFilterDataJobs.filteredJobData.company.length == 0 && getFilterDataJobs.filteredJobData.jobType.length !== 0 && getFilterDataJobs.filteredJobData.experience.max.length == 0) {
                    return item.jobType.toLowerCase() == getFilterDataJobs.filteredJobData.jobType.toLowerCase()
                }
                if (getFilterDataJobs.filteredJobData.company.length == 0 && getFilterDataJobs.filteredJobData.jobType.length == 0 && getFilterDataJobs.filteredJobData.experience.max.length !== 0) {
                    return item.workExperience <= getFilterDataJobs.filteredJobData.experience.max && item.workExperience > getFilterDataJobs.filteredJobData.experience.min
                }
                if (getFilterDataJobs.filteredJobData.company.length !== 0 && getFilterDataJobs.filteredJobData.jobType.length !== 0 && getFilterDataJobs.filteredJobData.experience.max.length == 0) {
                    return item.companyId.companyName.toLowerCase() == getFilterDataJobs.filteredJobData.company.toLowerCase() &&
                        item.jobType.toLowerCase() == getFilterDataJobs.filteredJobData.jobType.toLowerCase()
                }
                if (getFilterDataJobs.filteredJobData.company.length !== 0 && getFilterDataJobs.filteredJobData.jobType.length == 0 && getFilterDataJobs.filteredJobData.experience.max.length !== 0) {
                    return item.companyId.companyName.toLowerCase() == getFilterDataJobs.filteredJobData.company.toLowerCase() &&
                        (item.workExperience <= getFilterDataJobs.filteredJobData.experience.max && item.workExperience > getFilterDataJobs.filteredJobData.experience.min)
                }
                if (getFilterDataJobs.filteredJobData.company.length == 0 && getFilterDataJobs.filteredJobData.jobType.length !== 0 && getFilterDataJobs.filteredJobData.experience.max.length !== 0) {
                    return item.jobType.toLowerCase() == getFilterDataJobs.filteredJobData.jobType.toLowerCase() &&
                        (item.workExperience <= getFilterDataJobs.filteredJobData.experience.max && item.workExperience > getFilterDataJobs.filteredJobData.experience.min)
                }

                if (getFilterDataJobs.filteredJobData.company.length !== 0 && getFilterDataJobs.filteredJobData.jobType.length !== 0) {
                    return item.companyId.companyName.toLowerCase() == getFilterDataJobs.filteredJobData.company.toLowerCase()
                        && item.jobType.toLowerCase() == getFilterDataJobs.filteredJobData.jobType.toLowerCase()
                }

            }

        }))
    }, {
        enabled: true,
        refetchOnMount: false,

    })
    if (error) {
        Swal.fire({
            title: error.message,
            icon: "error",
            width: 400,
            height: 100,
        });

    }

    const jobDataPerCard = (jData) => {
        setCardBorder({
            border: '1px solid #FF8B02',
            id: jData._id
        });
        // setJobDataById(jData)
        dispatch(selectJobDataByIdelection(jData))
    }
    const handleApplyClicked = (data) => {
        // setApplyJob(data)
        refetch();
        //setJobDataById(null)
        dispatch(selectJobDataByIdelection(''))
    }



    return (
        <>
            {
                !isLoading ?
                    <>
                        <div className='container'>
                            <div className='row'>
                                <div className='col-12 col-md-6 col-lg-6 card-job-cand'>
                                    {

                                        data?.length !== 0 ?
                                            data?.map((d, index) => {
                                                if (d._id) {
                                                    const today = new Date();
                                                    const date2 = new Date(d.postedOn);
                                                    const diffTime = Math.abs(date2 - today);
                                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                    return (
                                                        <>
                                                            <div className='company-card' style={{
                                                                cursor: 'pointer',
                                                                border: cardBorder.id == d._id ? cardBorder.border : '1px solid #dadada'
                                                            }}
                                                                onClick={() => jobDataPerCard(d)}>
                                                                <div className='company-logo'>
                                                                    <img src={uesrImageDefault} className="img-fluid rounded-circle" style={{ width: '60px', height: '60px' }} alt='uesrImageDefault'/>
                                                                </div>
                                                                <div className='company-info'>
                                                                    <div className='company-heading'>
                                                                        <p className='company-job-role'>{d?.jobTitle}</p>
                                                                        <p className='company-job-posted'> Posted {diffDays} Day ago</p>
                                                                    </div>
                                                                    <div className='company-address'>
                                                                        <div className='row'>
                                                                            <div className='col'><p>{d?.companyId?.companyName}, {d?.country} </p></div>
                                                                            <div className='col d-flex justify-content-end'><p style={{
                                                                                'fontStyle': 'normal',
                                                                                'fontWeight': '500',
                                                                                'fontSize': '12px',
                                                                                'lineHeight': '14px',
                                                                                'color': '#FF0F00'
                                                                            }}>{d?.matchRating}% Match</p></div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='company-skill'>
                                                                        <div className='company-skill-req'>
                                                                            <p>Skills Required</p>
                                                                        </div>
                                                                        <div className='skill-group'>
                                                                            {d?.skillRequired.map(s => {
                                                                                return (
                                                                                    <>
                                                                                        <div className='company-skill-names'>
                                                                                            <span>{s?.skillId?.skill?.charAt(0).toUpperCase() + s?.skillId?.skill?.slice(1)}</span>
                                                                                        </div>
                                                                                    </>
                                                                                )
                                                                            })}


                                                                        </div>

                                                                    </div>
                                                                    <div className='company-job-type'>
                                                                        <div className='company-job-type-req'>
                                                                            <span>Job Type</span>
                                                                        </div>
                                                                        <div className='company-job-type-names'>
                                                                            <span>{d?.jobType?.charAt(0).toUpperCase() + d?.jobType?.slice(1)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div > <br />
                                                        </>
                                                    )
                                                }

                                            }) : <>
                                                <p>No Jobs are there which matches your profile</p>
                                            </>
                                    }
                                </div>
                                <div className='col-md-6 col-lg-6'>
                                    {jobDataById ? <JobDescription jobDataById={jobDataById.itemData} onApplyClicked={handleApplyClicked} /> :
                                        ''}

                                </div>
                            </div>
                        </div>
                    </> : <Loading />
            }

        </>
    )
}