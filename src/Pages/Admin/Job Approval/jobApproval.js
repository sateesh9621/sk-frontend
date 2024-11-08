import React, { useEffect, useState, useContext } from 'react'
import { useForm } from "react-hook-form";
import JobCard from '../../../Component/JobCard/jobCard'
import ApiConstants from '../../../Services/apiconstants'
import { Interceptor } from "../../../ErrorStatus/errorStatus"
import { AiOutlineCloseCircle ,AiFillDelete  } from "react-icons/ai"
import { Rating } from 'react-simple-star-rating';
import { jobApprovalContext } from '../../../Context/jobApprovalContextState'
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2'
import axios from 'axios'
import './jobApproval.css'
import $ from "jquery";


const JobApproval = () => {

  const {
    register,
    handleSubmit,
  } = useForm();

  const token = JSON.parse(sessionStorage.getItem("ADMIN")).token;
  const userId = JSON.parse(sessionStorage.getItem("ADMIN")).admin._id;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { jobList, skillList ,updateSkillListData } = useContext(jobApprovalContext);

  const [jobListData, setJobListData] = useState(jobList)
  const [newSkill , setNewSkill] = useState('')

  const [skillQuery] = useState('');
  const [addSkill, setAddSkill] = useState([]);
  
  const handleChangeExp = (event, idx) => {
    const newValue = event.target.value
    addSkill[idx].requiredExperience = newValue
  }

  const addNewSkill = (data) => {
    const newElement = data.searchSkill;
    let obj = skillList.find(o => o.skill === newElement);
    // {_id: '62d1d45e87ae97aeba81b090', skill: 'Business Law', active: true}
    setAddSkill(addSkill => [...addSkill, { skillId: obj._id, skillName: newElement, rating: 0 }])
  }

  const handleRating = (rate, idx) => {
    const label = 'rating'
    const newValue = rate
    setAddSkill([
      ...addSkill.slice(0, idx),
      {
        // here update data value
        ...addSkill[idx],
        [label]: newValue,
      },
      ...addSkill.slice(idx + 1),
    ]);
  }

  const handleRemoveItem = (i) => {
    setAddSkill(addSkill.filter(item => item.skill !== i))
    setAddSkill(addSkill.filter(item => item.skillId.skill !== i))
  };

 
  const [formValue , setFormValue] = useState(
    {
      id: "",
      jobTitle: "",
      companyId: "",
      companyName: "",
      jobRole: "",
      country: "",
      state: "",
      city: "",
      jobType: "",
      workExperience: '',
      jobDescription: "",
      jobId: "",
      lastDate: "",
      postedOn: "",
      isApproved: "",
      travelRequired: "",
      operatorId: "",
      skillRequired:""
  }
  )


  const approvalBtnCss = {
    backgroundColor: '#FF8C04',
    color: 'white'
  }

  const approvalBtnOnClick = {
    backgroundColor: 'rgb(255 140 4 / 54%)',
    color: 'white',
  }

  const [approvalBtnBg, setApprovalBtnBg] = useState(approvalBtnCss)

  const rejectBtnCss = {
    backgroundColor: 'red',
    color: 'white'
  }

  const rejectBtnOnClick = {
    backgroundColor: '#ff00008f',
    color: 'white',
  }

  const [rejectBtnBg, setRejectBtnBg] = useState(rejectBtnCss)

  const handleJobDesc = (data) => {

    setFormValue({
      id:data._id,
      jobTitle: data.jobTitle,
      companyId: data.companyId,
      country: data.country,
      state: data.state,
      city: data.city,
      jobType: data.jobType,
      jobDescription: data.jobDescription,
      jobId: data.jobId,
      lastDate: data.lastDate,
      operatorId: data.operatorId,
      postedOn: data.postedOn,
      isApproved: data.isApproved,
      workExperience: data.workExperience,
      jobRole: data.jobRole,
      travelRequired:data.travelRequired,
      skillRequired:data.skillRequired
    
    })

    setAddSkill(data.skillRequired)
    setApprovalBtnBg(approvalBtnCss)
    setRejectBtnBg(rejectBtnCss)

    setIsSubmitting(false)

  }
  const handleApproval = async (id) => {
    await axios.patch(
      ApiConstants.APPROVE_JOB + id,
      {},
      {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          token: token,
          _id: userId,
          "Access-Control-Allow-Origin": true,
          "Access-Control-Allow-Methods": "GET, POST, PATCH",
        },
      }).then((res) => {
        let updatatedJobListData = jobListData.filter((ele) => { return ele._id != id })
        setJobListData(updatatedJobListData)
        setApprovalBtnBg(approvalBtnOnClick)
        setRejectBtnBg(rejectBtnOnClick)
        setIsSubmitting(true)
        Swal.fire({
          icon: 'success',
          title: 'Approved',
          text: 'done'
        })

      })
      .catch((error) => {
        if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
          Interceptor(error.response.status)
        }
        console.log("data not found from contextside")
      })
  }

  const handleRejection = async (id) => {

    await axios.patch(
      ApiConstants.REJECT_LIST + id,
      {},
      {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          token: token,
          _id: userId,
          "Access-Control-Allow-Origin": true,
          "Access-Control-Allow-Methods": "GET, POST, PATCH",
        },
      }).then((res) => {

        let updatatedJobListData = jobListData.filter((ele) => { return ele._id != id })
        setJobListData(updatatedJobListData)
        setRejectBtnBg(rejectBtnOnClick)
        setIsSubmitting(true)
        Swal.fire({
          icon: 'success',
          title: 'Rejected',
          text: 'done'
        })
      })
      .catch((error) => {
        // if ((error.response.status  >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
        //   Interceptor(error.response.status)
        // }
        console.log("data not found from contextside")
      })
  }

  const handleDeleteJob = async(id) => {
    await axios.patch(
      ApiConstants.DELETE_JOB + id,
      {},
      {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          token: token,
          "Access-Control-Allow-Origin": true,
          "Access-Control-Allow-Methods": "GET, POST, PATCH",
        },
      }).then((res) => {

        let updatatedJobListData = jobListData.filter((ele) => { return ele._id !== id })
        setJobListData(updatatedJobListData)
        Swal.fire({
          icon: 'success',
          title: 'Job Deleted Sucessfully',
          text: 'done'
        })
      })
      .catch((error) => {
        // if ((error.response.status  >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
        //   Interceptor(error.response.status)
        // }
        console.log("data not found from contextside")
      })
  }

  const  handleChange = (e) => {
    setFormValue({...formValue , [e.target.name]:e.target.value })
  }


  const onSubmitEditForm = (event) => {

    event.preventDefault()
  
    axios.patch(ApiConstants.UPDATE_JOB + formValue.id, {
      companyId: formValue.companyId,
      jobId: formValue.jobId,
      jobTitle: formValue.jobTitle,
      jobRole: formValue.jobRoleId,
      workExperience: formValue.workExperience,
      jobType: formValue.jobType,
      travelRequired: formValue.travelRequired,
      country: formValue.country,
      state: formValue.state,
      city: formValue.city,
      postedOn: formValue.postedOn,
      lastDate: formValue.lastDate,
      jobDescription: formValue.jobDescription,
      skillRequired: addSkill
    }
      , {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          token: token,
          "Access-Control-Allow-Origin": true,
          "Access-Control-Allow-Methods": "GET, POST, PATCH",
        }
      }).then((response) => {
               
        // setFormValue({...formValue , [skillRequired]:})   

        Swal.fire({
          title: "Updated successful ",
          icon: "success",
          allowOutsideClick: true,
          allowEscapeKey: true,
          allowEnterKey: true,
          confirmButtonText: "Ok",
        });
      
        setTimeout(() => {
          $("[data-dismiss=modal]").trigger({ type: "click" })
        }, 1000)
      }).catch((error) => {
        Swal.fire({
          title: "Backend not connected",
          icon: "info",
          width: 400,
          height: 100,
        });
      })
  }

  const onSubmitNewSkill = (event) => {

    event.preventDefault();

    const skillFound = skillList.some((obj) => obj.skill === newSkill);

    if (skillFound === false) {
      axios
        .post(ApiConstants.SKILL_ADD, {
          newSkill: newSkill
        },
          {

            headers: {
              Accept: "application/json",
              "Content-type": "application/json",
              token: token,
        
              "Access-Control-Allow-Origin": true,
              "Access-Control-Allow-Methods": "GET, POST, PATCH",
            }

          })
        .then((res) => {

          Swal.fire({
            title: res.data.message,
            icon: "success",
            width: 400,
            height: 100,
          });


          updateSkillListData({ _id: res.data.skill._id, skill: res.data.skill.skill, active: true });

        })
        .catch((error) => {
          Swal.fire({
            title: error.message,
            icon: "error",
            width: 400,
            height: 100,
          });
        });
    } else {
      Swal.fire({
        title: "skill already exist",
        icon: "error",
        width: 400,
        height: 100,
      })

    }

  }

  useEffect(() => {
    if (jobList.length > 0) {
      setFormValue({
        id: jobList[0]._id,
        jobTitle: jobList[0].jobTitle,
        companyId: jobList[0].companyId,
        companyName: jobList[0].companyId.companyName,
        country: jobList[0].country,
        state: jobList[0].state,
        city: jobList[0].city,
        jobType: jobList[0].jobType,
        jobRole: jobList[0].jobRole.role,
        jobDescription: jobList[0].jobDescription,
        jobId: jobList[0].jobId,
        workExperience: jobList[0].workExperience,
        lastDate: jobList[0].lastDate,
        postedOn: jobList[0].postedOn,
        operatorId: jobList[0].operatorId,
        isApproved: jobList[0].isApproved,
        travelRequired: jobList[0].travelRequired,
        skillRequired: jobList[0].skillRequired
      })
      setAddSkill(jobList[0].skillRequired)
    }
  }, [jobList])


  const [selectedCard, setSelectedCard] = useState(formValue.id);

  const handleCardClick = (cardId) => {
    setSelectedCard(cardId);
  };


  return (
    <>
      <div className='' >
        <div className='row'>
          <div className="col-lg-5 leftcontent ">

            {jobListData.length > 0 ? jobListData.map((data, i) => {

              return (
                <JobCard key={data._id} {...data} onDataChange={() => handleJobDesc({ ...data })} 
                selectedCard={selectedCard}
                handleCardClick={handleCardClick}
                  
                />
              )
            })  
              : ""}
          </div>

          {jobListData.length > 0 ? <div className="col-lg-7 ">

            <div className='descBox' >
              <div className='jobTitle'>
                <div className='jobTitleBox'>
                  <div className='d-flex justify-content-between'>
                    <p style={{ fontSize: '1.2rem', fontWeight: '500' }} >{formValue.jobTitle}</p>
                    <h6>OPS-ID : {formValue.operatorId.fullname === undefined || ([null , undefined]).includes(formValue.operatorId.fullname) ? '' : formValue.operatorId.fullname} </h6>
                    <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
  <div className="btn-group mr-2" role="group" aria-label="First group">
                    <button type="button" className="btn edtBtn" data-toggle="modal" data-target={`.recommendation${formValue._id}`}>
                      <BiEdit size={25} color={"#FF8C04"} />
                    </button>
                    </div>
                    <div className="btn-group mr-2" role="group" aria-label="First group">
                    <button type="button" className="btn edtBtn" onClick={() => handleDeleteJob(formValue.id)} >
                      <AiFillDelete size={25} color={"red"} />
                    </button>
                    </div>              
                   </div>
                  </div>
                  <p>{formValue.companyId.companyName}. {formValue.companyId.companyName}  <span style={{ color: "#FF8C04", fontSize: '11px', marginLeft: '1rem' }}>1 Day ago </span> </p>
                  <p style={{ fontSize: '0.8rem' }}>Job type ({formValue.jobType} ) <span style={{ color: "#FF8C04", fontSize: '11px', marginLeft: '1rem' }}> {formValue.workExperience} Year Experience</span> </p>
                  {/* <p style={{ fontSize: '0.8rem' }} >50% match with your profile</p> */}

                  <button className="btnJobApply"
                    style={approvalBtnBg}
                    onClick={() => handleApproval(formValue.id)} disabled={isSubmitting} >Approve</button>

                  <button className="btnJobApply"
                    style={rejectBtnBg}
                    disabled={isSubmitting}
                    onClick={() => handleRejection(formValue.id)}  >Reject</button>
                </div>
              </div>

              <div className='rightContaint'>
                <p style={{ alignContent: 'justify', textAlign: 'justify' }}
                  dangerouslySetInnerHTML={{ __html: formValue.jobDescription }}
                >
                </p>
              </div>
            </div>
          </div> : <h1 style={{ position: "absolute", bottom: "10rem" }} className='text-center text-secondary'>No Jobs </h1>
          }
        </div>
      </div>


      {/* job edit form */}

      <div className={`modal fade recommendation${formValue._id}`} tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content modalContent">
            <div className="modal-header">
              <p className="modal-title  " id="exampleModalLongTitle">Edit Job </p>
              <button type="button" className="btn" data-dismiss="modal" aria-label="Close">
                <AiOutlineCloseCircle />
              </button>
            </div>
            <div className="modal-body">
              <form className="" onSubmit={onSubmitEditForm}>
                <div className="row m-4">
                  <div className="form-group col-md-6">
                  <label htmlFor="companyName">Company Name</label>
              <input type="text"
                id="companyName"
                className="form-control"
                name="companyName"
                list="job-options"
                value={formValue.companyName}
                readOnly
              />
              
                  </div>
                  <div className="form-group col-md-6">
                  <label htmlFor="jobId">Job ID</label>
              <input type="text" 
                id="jobId"
                className="form-control"
                name="jobId"
                value={formValue.jobId}
                onChange={handleChange}
              />
                  </div>
                </div>

                <div className="row m-4">
                  <div className="form-group col-md-6">
                  <label htmlFor="jobTitle">Job Title</label>
              <input type="text" 
                id="jobTitle"
                className="form-control"
                name="jobTitle"
                value={formValue.jobTitle}
                onChange={handleChange}
              />
                  </div>

                  <div className="form-group col-md-6">
                  <label htmlFor="jobRole">Job Role</label>
              <input type="text" className="form-control"
                id="jobRole"
                placeholder="Type of Role you are looking for*"
                name='jobRoleId'
                list="jobRole-option"
                value={formValue.jobRole.role}
                readOnly
              />
                  
                  </div>
                </div>

                <div className="row m-4">
                  <div className="form-group col-md-4">
                  <label htmlFor="workExperience">Year Of Experience</label>
              <input type="number" min={0} className="form-control"
                id="workExperience"
                name="workExperience"
                value={formValue.workExperience}
                onChange={handleChange}
              />
                  </div>

                  <div className="form-group col-md-4">
                  <label htmlFor="jobType">Job Type</label>
              <select
                className="form-control"
                id="jobType"
                required
                name="typeOfJob"
                value={formValue.jobType}
                onChange={handleChange}
              >
                      <option value="Fulltime"> Fulltime</option>
                      <option value="C2C"> C2C </option>
                      <option value="C2H"> C2H </option>
                      <option value="Parttime"> Parttime </option>
                      <option value="internship">Internship</option>
                      <option value="freelance">Freelance</option>
                    </select>
                  </div>

                  <div className="form-group col-md-4">
                  <label htmlFor="inputCity">Travel Required</label>
<select
  className="form-control"
  name="travelRequired"
  value={formValue.travelRequired}
  onChange={handleChange}
>

                      <option value="true"> Yes</option>
                      <option value="false"> No</option>
                    </select>
                  </div>


                </div>


                <div className="row m-4">
                  <div className="form-group col-md-4">
                  <label htmlFor="inputCountry">Country</label>
    <input
      type="text"
      className="form-control"
      name="country"
      id="inputCountry"
      value={formValue.country}
      onChange={handleChange}
    />
                  </div>

                  <div className="form-group col-md-4">
                  <label htmlFor="inputState">State</label>
    <input
      type="text"
      className="form-control"
      id="inputState"
      name="state"
      value={formValue.state}
      onChange={handleChange}
    />
                  </div>

                  <div className="form-group col-md-4">
                  <label htmlFor="inputCity">City</label>
    <input
      type="text"
      className="form-control"
      id="inputCity"
      name="city"
      value={formValue.city}
      onChange={handleChange}
    />
                  </div>
                </div>

                <div className="row m-4">
                  <div className="form-group col-md-6">
                  <label htmlFor="inputPostedOn">Posted On</label>
    <input
      type="date"
      className="form-control"
      name="postedOn"
      id="inputPostedOn"
      onChange={handleChange}
      defaultValue={formValue.postedOn}
    />
                  </div>

                  <div className="form-group col-md-6">
                  <label htmlFor="inputLastDate">End Date</label>
    <input
      type="date"
      className="form-control"
      name="lastDate"
      id="inputLastDate"
      onChange={handleChange}
      defaultValue={formValue.lastDate}
    />
                  </div>
                </div>

                <div className="row m-4">
                <div className="form-group">
    <label htmlFor="inputJobDescription">Job Description</label>
    <p
      className="p-2 border"
      style={{ alignContent: 'justify', textAlign: 'justify' }}
      dangerouslySetInnerHTML={{ __html: formValue.jobDescription }}
    ></p>
    <textarea
      className="form-control"
      rows="5"
      name="jobDescription"
      id="inputJobDescription"
      value={formValue.jobDescription}
      onChange={handleChange}
    />
  </div>
                </div>


                <div className="row d-flex justify-content-center">

                  <button className="buttonSend"
                    type='button'
                    style={{ background: "var(--list-item-color)" }}
                    data-toggle="modal"
                    data-target="#addNewSkill"
                  > Add New Skill  </button>

                </div>

                <div className="row m-4">
                  <div className="col-md-12 col-sm-12 mt-3 ">

                    {/* skill adding  start*/}
                    <span className >Add Skills* </span>
                    <div className="form-group has-search-for-filter">
                      <span className="fa fa-search form-control-feedback-for-filter"></span>
                      <div className="input-group mb-3">
                        <input type="text" list="data" className="form-control"
                          placeholder="Search" aria-label="Recipient's username"
                          aria-describedby="basic-addon2"
                         {...register("searchSkill")}
                          required />
                        <datalist id="data">
                          {skillList.length != 1 && skillList.slice(1, skillList.length).map((item, key) => {
                            if (item.skill.toUpperCase().includes(skillQuery.toUpperCase())) {
                              return (
                                <>
                                  <option key={key} value={item.skill} />

                                </>
                              )
                            }
                          })}
                        </datalist>
                        <div className="input-group-append  mx-1">
                          <button className="btn addSkillBtn" onClick={handleSubmit(addNewSkill)} >Add</button>
                        </div>

                      </div>
                    </div>

                    {
                      addSkill.length > 0
                        ? <div className="border">
                          {
                            addSkill.map((e, i) => {

                              return (
                                <div className='d-flex justify-content-between m-3 '>
                                  <div className="col-md-2 col-sm-2" >
                                    <span className='same-formating'> {e.skillId.skill} {e.skillName} </span>
                                  </div>
                                  <div>
                                    <input className="rounded border-light"
                                      placeholder="Experience (in year)"
                                      onChange={(e) => { handleChangeExp(e, i) }}
                                      defaultValue={e.requiredExperience}
                                      name="skillExp"
                                      type="number"
                                      required
                                      min="0"
                                    />
                                  </div>
                                  <div>
                                    <Rating id={i} initialValue={e.rating > 0 ? e.rating : 0} onClick={(rate) => handleRating(rate, i)} fillColor='#4B2DFF' size='23px' />
                                  </div>

                                  <div>
                                    <MdDelete size={25} onClick={() => handleRemoveItem(e.skill === undefined || e.skill === null ? e.skillId.skill : e.skill)} style={{ 'cursor': 'pointer' }} />
                                  </div>

                                </div>
                              );
                            })} </div> : ''
                    }

                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn m-3 addSkillBtn "> Update Job  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

  {/* modal addNewSkill */}

  <div
        className="modal fade"
        id="addNewSkill"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content modalContent">
            <div className="modal-header">
              <h5 className="modal-title mx-3" id="exampleModalLongTitle">
                Add New skill
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
              <form onSubmit={onSubmitNewSkill}>
                <div className="row m-3 ">
                  <label className="labelPos">Add New Skill </label>
                  <input type="text"
                    className="form-control"
                    placeholder="Enter Skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                  />
                </div>

                <div className="d-flex justify-content-center mt-3 mb-3">
                  <button
                    type="submit"
                    className="buttonSend me-md-2"
                    style={{ background: "var(--list-item-color)" }}>
                    Save
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>



    </>
  )
}

export default JobApproval 