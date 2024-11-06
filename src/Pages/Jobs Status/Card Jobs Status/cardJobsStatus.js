import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import ApiConstants from "../../../Services/apiconstants";
import uesrImageDefault from "../../../Assets/profilePic.png";
import Loading from "../../../Component/Loading/loading";
import JobDescriptionStatus from "../Job Description Status/jobDescriptionStatus";

export default function CardJobsStatus({ jobStatusFilter }) {
  const [jobDataById, setJobDataById] = useState(null);

  if (sessionStorage.getItem("candidate_data") != null) {
    const candidateDataMix = JSON.parse(
      sessionStorage.getItem("candidate_data")
    );
    var token = candidateDataMix.token;
  }
  const [cardBorder, setCardBorder] = useState({
    border: "",
    id: "",
  });

  const { isLoading, data } = useQuery(
    ["status", jobStatusFilter],
    async () => {
      return axios
        .get(ApiConstants.GET_ALL_JOBS_FOR_CANDIDATE, {
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": true,
            token: token,
            "Access-Control-Allow-Methods": "GET, POST, PATCH",
          },
        })
        .then((res) =>
          res.data.applications.filter((item) => {
            return (
              item.currentStatus.toLowerCase() === jobStatusFilter.toLowerCase()
            );
          })
        );
    }
  );

  const jobDataPerCard = (jData) => {
    setCardBorder({
      border: "1px solid #FF8B02",
      id: jData._id,
    });
    setJobDataById(jData);
  };
  return (
    <div>
      {!isLoading ? (
        <>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-6 ">
                {data.length !== 0 ? (
                  data?.map((d, index) => {
                    if (d._id) {
                      const today = new Date();
                      const date2 = new Date(d.jobId.postedOn);
                      const diffTime = Math.abs(date2 - today);
                      const diffDays = Math.ceil(
                        diffTime / (1000 * 60 * 60 * 24)
                      );
                      return (
                        <>
                          <div
                            className="company-card"
                            style={{
                              cursor: "pointer",
                              border:
                                cardBorder.id === d._id
                                  ? cardBorder.border
                                  : "1px solid #dadada",
                            }}
                            role="button" 
                            tabIndex={0}
                            onClick={() => jobDataPerCard(d)}
                          >
                            <div className="company-logo">
                              <img
                                src={uesrImageDefault}
                                className="img-fluid rounded-circle"
                                style={{ width: "60px", height: "60px" }}
                                alt=""
                              />
                            </div>
                            <div className="company-info">
                              <div className="company-heading">
                                <p className="company-job-role">
                                  {d?.jobId?.jobTitle}
                                </p>
                                <p className="company-job-posted">
                                  {" "}
                                  Posted {diffDays} Day ago
                                </p>
                              </div>
                              <div className="company-address">
                                <div className="row">
                                  <div className="col">
                                    <p>
                                      {d?.companyId?.companyName},{" "}
                                      {d?.jobId?.country}{" "}
                                    </p>
                                  </div>
                                  {/* <div className='col d-flex justify-content-end'><p style={{
                                                                                'fontStyle': 'normal',
                                                                                'fontWeight': '500',
                                                                                'fontSize': '12px',
                                                                                'lineHeight': '14px',
                                                                                'color': '#FF0F00'
                                                                            }}>{d.jobId.matchRating}% Match</p></div> */}
                                </div>
                              </div>
                              <div className="company-skill">
                                <div className="company-skill-req">
                                  <p>Skills Required</p>
                                </div>
                                <div className="skill-group">
                                  {d?.jobId?.skillRequired.map((s) => {
                                    return (
                                      <>
                                        <div className="company-skill-names">
                                          <span>
                                            {s?.skillId?.skill
                                              .charAt(0)
                                              .toUpperCase() +
                                              s?.skillId?.skill.slice(1)}
                                          </span>
                                        </div>
                                      </>
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="company-job-type">
                                <div className="company-job-type-req">
                                  <span>Job Type</span>
                                </div>
                                <div className="company-job-type-names">
                                  <span>
                                    {d?.jobId?.jobType
                                      ?.charAt(0)
                                      .toUpperCase() +
                                      d?.jobId?.jobType?.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <br />
                        </>
                      );
                    }
                  })
                ) : (
                  <>
                    <p>
                      No Jobs are there which shows your{" "}
                      {jobStatusFilter.charAt(0).toUpperCase() +
                        jobStatusFilter.slice(1)}{" "}
                      status
                    </p>
                  </>
                )}
              </div>
              <div className="col-md-6 col-lg-6">
                {jobDataById ? (
                  <JobDescriptionStatus jobDataById={jobDataById} />
                ) : (
                  <JobDescriptionStatus
                    jobDataById={data.length != 0 ? data[0] : ""}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}
