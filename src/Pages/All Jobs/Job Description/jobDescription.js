import React from 'react'
import './jobDescription.css'
import ApiConstants from '../../../Services/apiconstants';
import axios from 'axios';
import { QueryClient, useMutation, useQuery } from 'react-query';
import Swal from 'sweetalert2';
import { useState } from 'react';
import Loading from '../../../Component/Loading/loading';

export default function JobDescription(props) {
    const today = new Date();
    const date2 = new Date(props.jobDataById.postedOn);
    const diffTime = Math.abs(date2 - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (sessionStorage.getItem('candidate_data') != null) {
        const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data"))
        var token = candidateDataMix.token;
    }
    const [applyClicked, setapplyClicked] = useState(false);
    const [jobId, setJobId] = useState('')

    const { isLoading, error, data, isFetching } = useQuery(['applyJob', jobId], async () => {
        return await axios.post(ApiConstants.APPLY_JOBS_FOR_CANDIDATE_BY_ID + jobId, {}, {
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": true,
                token: token,
                "Access-Control-Allow-Methods": "GET, POST, PATCH",
            }
        }).then(res => {
            Swal.fire({
                title: "Success!",
                text: "Thank you for applying for this job.",
                icon: "success",
                width: 400,
                height: 100,
            });
            setTimeout(() => {
                props.onApplyClicked(true)
            }, 2000)
        })
            .catch(err => {
                //console.log(err.response.data.error)
                Swal.fire({
                    title: err.response.data.error,
                    icon: "error",
                    width: 400,
                    height: 100,
                });
            })
    }, {
        enabled: applyClicked && jobId !== null,
        onSuccess: () => {
            setapplyClicked(false)
        }

    })


    const applyJob = (id) => {
        setJobId(id)
        setapplyClicked(true)
    }
    return (
        <>
            {
                props.jobDataById && <>
                    <div className='job-desc'>
                        <div className='job-company-job-role'>
                            <p>{props.jobDataById?.jobTitle}</p>
                        </div>
                        <div className='job-company-address'>
                            <p>{props.jobDataById?.companyId?.companyName}, {props.jobDataById?.country} <span className='job-date'>{diffDays} Day Ago</span></p>
                        </div>
                        <div className='job-company-type'>
                            <p>Job Type ({props.jobDataById?.jobType?.charAt(0).toUpperCase() + props.jobDataById?.jobType?.slice(1)})</p>
                        </div>
                        <div className='job-company-matches'>
                            <p><span className='percentage-matching'>{props.jobDataById.matchRating}% </span>match with the profile</p>
                        </div>
                        <div className='job-company-apply'>
                            <button type='button' className='job-apply-btn' onClick={() => applyJob(props.jobDataById._id)}>{isLoading ? 'Applying...' : 'One Click Apply'}</button>
                        </div>
                    </div>
                    <div className='job-desc-info'>
                        <div className='job-desc-heading'>
                            <p>Job Description</p>
                        </div>
                        <div className='all-job-info'>
                            <p dangerouslySetInnerHTML={{ __html: props.jobDataById?.jobDescription }} />
                        </div>
                    </div>
                </>
            }



        </>
    )
}