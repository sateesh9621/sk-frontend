import React, { useState, useEffect, useContext } from 'react'
import { Rating } from 'react-simple-star-rating'
import $ from "jquery"
import "./referOther.css"
import Swal from "sweetalert2"
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { BsPlusCircle, } from "react-icons/bs";
import { MdLibraryAdd, MdDelete } from "react-icons/md";
import ApiConstants from '../../../Services/apiconstants';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Loading from "../../../Component/Loading/loading";
import GivenSection from '../GivenReferal/GivenSection/givenSection';
import Mixpanel from '../../../Services/mixpanel';
import { numberOfSkill, checkRequired } from '../../../UtilitiesFunctions/utilitiesFunction';
import { userContext } from "../../../Context/userContextState";
import { Interceptor } from '../../../ErrorStatus/errorStatus'
import AsyncSelect from 'react-select/async'
import { GetAllSkills } from '../../../Redux/Reducer/skillReducerSlice'


const ReferOther = () => {

  const { userData } = useContext(userContext)

  if (sessionStorage.getItem('candidate_data') != null) {
    const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data"))
    var token = candidateDataMix.token;
    var userId = candidateDataMix.candidate._id;
    var candidateEmailId = candidateDataMix.candidate.email;
  }

  if (sessionStorage.getItem('candidate_data_ref') != null) {
    const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data_ref"))
    var token = candidateDataMix.token;
    var userId = candidateDataMix.candidate._id;
    var candidateEmailId = candidateDataMix.candidate.email;

  }


  const [referalData, setReferalData] = useState([])


  const { promiseInProgress } = usePromiseTracker();

  const dispatch = useDispatch();

  const {
    handleSubmit,
    formState: {  },
    reset,
  } = useForm();

  const skillSelection = useSelector(

    (state) => state.skills

  )

  const [addSkill, SetAddSkill] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [formValue, setformValue] = useState({
    candidateName: "",
    candidateEmail: "",
    candidateLinkedInUrl: "",
    connectionType: "",
    description: "",
    skills: "",
  });


  const [successMsgRefer, setSuccessMsgRefer] = useState("")
  const [errorMassage, setErrorMessage] = useState("")

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      const options = skillSelection.skillList.data.map(item => ({ value: item._id, label: item.skill }))
      const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      callback(filteredOptions);
    }, 1000);
  };
  const addNewSkill = (data) => {



    let newElement

    skillSelection.skillList.data.map(item => {
      if (item._id == data) {
        newElement = item.skill
      }
    })

    SetAddSkill(addSkill => [...addSkill, { skillId: data, skill: newElement, rating: 0 }])

    setTimeout(() => {
      setSelectedOption(null);
    }, 1000);
  }

  const handleRating = (rate, idx) => {

    const label = 'rating'
    const newValue = rate

    SetAddSkill([
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

    SetAddSkill(addSkill.filter(item => item.skill !== i));

  };

  const onSubmit = (data) => {

    if (numberOfSkill(addSkill) === false) {

      setErrorMessage("Please add at least 3 skills")
    } else if (checkRequired(addSkill) === true) {

      setErrorMessage(" skill rating is required ")

    }



    Mixpanel('Referred a candidate', 'Submit Button', candidateEmailId)

    if (numberOfSkill(addSkill) && checkRequired(addSkill) === false) {



      trackPromise(
        axios
          .post(
            ApiConstants.CREATE_REFERRER,
            {
              candidateName: formValue.candidateName,
              candidateEmail: formValue.candidateEmail,
              candidateLinkedInUrl: formValue.candidateLinkedInUrl,
              connectionType: formValue.connectionType,
              description: formValue.description,
              skills: addSkill,
            },
            {
              headers: {
                Accept: "application/json",
                "Content-type": "application/json",
                token: token,
                _id: userId,
                "Access-Control-Allow-Origin": true,
                "Access-Control-Allow-Methods": "GET, POST, PATCH",
              },
            }
          )
          .then((response) => {

            setSuccessMsgRefer("Thanks for referring the candidate. Please follow-up and request the candidate to complete the detailed profile. We will inform you if the candidate is shortlisted or selected by the client organization.")

            setReferalData([...referalData, response.data.referral])
            reset()

            setTimeout(() => {
              $("[data-dismiss=modal]").trigger({ type: "click" })
            }, 2000)

          }).catch((error) => {

            if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {


              Interceptor(error.response.status)
            } else {

              setErrorMessage(error.response.data.error)
            }

          })
      )
    }


  }



  const handleChange = (event) => {
    setformValue({
      ...formValue,
      [event.target.name]: event.target.value
    })
  }



  // file upload

  const resumeUpload = (e) => {

    const formData = new FormData();
    formData.append('resume', e.target.files[0]);
    formData.append('resumeName', e.target.files[0].name)


    trackPromise(
      axios.post(
        ApiConstants.REFERAL_RESUME_UPLOAD,
        formData,
        {
          headers: {
            token: token,
            _id: userId,
            "Access-Control-Allow-Origin": true,
            "Access-Control-Allow-Methods": "GET, POST, PATCH",
          },
        }
      )
        .then((response) => {
          Swal.fire({
            title: "Resume Uploaded",
            icon: "success",
            width: 400,
            height: 100,
          });
        })
        .catch((error) => {

          if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
            Interceptor(error.response.status)
          }
        })
    )
  }



  useEffect(() => {
    dispatch(GetAllSkills())
    if (userData != 0) {
      setReferalData(userData[0].candidate.referrals)
    }
  }, [userData])


  useEffect(() => {
    const manageOutSideClick = (event) => {
      setErrorMessage("")
      setSuccessMsgRefer("")
    }
    document.addEventListener("click", manageOutSideClick)
    return () => {
      document.removeEventListener("click", manageOutSideClick)
    }

  }, [])



  return (
    <>
      <div className="card mb-3" >
        <div className="card-body">

          <div className="d-flex justify-content-between ">
            <span style={{ fontWeight: "500", fontSize: "18px", color: "#444444" }}> <b> Refer a Candidate</b></span>
            <button
              type="button"
              className="btn edtBtn"
              data-toggle="modal"
              data-target=".referal"
            >
              <BsPlusCircle />
            </button>
          </div>

          {referalData.length === 0 ? <div>
            <div className="d-flex justify-content-center  mt-3">
              <button type="button" className="btn edtBtn" data-toggle="modal" data-target=".referal">
                <MdLibraryAdd size={25} color="#6e4dcd" />
              </button>
            </div>
            <div className="d-flex justify-content-center  mt-3">
              <button class="buttonSend me-md-2 "  data-toggle="modal" data-target=".referal" >
                Send Referral’s
              </button >
            </div>
          </div> : <div className="mt-3">

            <span className=" status" > Given</span>
            <hr></hr>


            {referalData.length > 0 ?
              referalData.map((x) => {
                return (<GivenSection key={x._id}  {...x} />)
              }) : " "}
          </div>
          }


          <div className="modal fade referal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">

            <div className="modal-dialog modal-lg">
              <div className="modal-content modalContent">

                <div className="modal-header">
                  <p className="modal-title fs-3 mx-4 " id="exampleModalLongTitle"> Refer a candidate </p>
                  <button type="button" className="btn" data-dismiss="modal" aria-label="Close">
                    <AiOutlineCloseCircle />
                  </button>
                </div>

                <div className="modal-body">

                  <div className="container-fluid">

                    <p className="mx-4" >Add Details </p>

                    <form onSubmit={handleSubmit(onSubmit)}>

                      {promiseInProgress === true ? <Loading /> : null}
                      <div className="row mt-3  " style={{ marginLeft: "1.6%", marginRight: "1.6%" }} >
                        <div className="col-md-6 col-sm-12">
                          <span className="mb-2" > Candidate’s Name </span>
                          <input
                            type="text"
                            className="form-control"
                            value={formValue.candidateName}
                            onChange={handleChange}
                            name="candidateName"
                          />
                        </div>
                        <div className="col-md-6  ">
                          <span className="" > Candidate’s email address</span>
                          <input
                            type="text"
                            className="form-control"
                            value={formValue.candidateEmail}
                            onChange={handleChange}
                            name="candidateEmail"

                          />

                        </div>
                      </div>

                      <div>

                      </div>

                      <div className="row mt-3 mx-4  ">

                        <label htmlFor="candidateLinkedInUrl"  className="ml-0" style={{ marginLeft: "-0.5rem" }} > Candidate’s LinkedIn URL</label>
                        <input
                          type="url"
                          id="candidateLinkedInUrl"
                          className="form-control"
                          name="candidateLinkedInUrl"
                          value={formValue.candidateLinkedInUrl}
                          pattern='^(https?:\/\/)?((www|\w\w)\.)?linkedin.com\/((in\/[a-zA-Z0-9-]+)|(company\/[a-zA-Z0-9-]+)|(school\/[a-zA-Z0-9-]+))\/?$'
                          onChange={handleChange}
                        />
                      </div>

                      <div className="row mt-3 mx-4">

                        <label htmlFor="connectionType" style={{ marginLeft: "-0.5rem" }}  >How do you know the candidate ?</label>
                        <select id="connectionType" className="form-control" value={formValue.connectionType}
                          onChange={handleChange} name="connectionType"  >
                          <option value="I know as a Colleague" >I know as a Colleague</option>
                          <option value="I know as a Client" >I know as a Client</option>
                          <option value="I know as a Friend who I know very well " >I know as a Friend who I know very well </option>
                          <option value="I am recruiter and I know the candidate from my past association">
                            I am recruiter and I know the candidate from my past association
                          </option>
                        </select>
                      </div>


                      {/* <div className="col-md-12 col-sm-12 mt-3 "> */}

                      {/* skill add kro */}

                      <div className="row mt-4  " style={{ marginLeft: "1.8%", marginRight: "1.8%" }}>
                        <span className="">
                          Add Skills
                        </span>

                        <div className="form-group has-search-for-filter">


                          {/* <input type="text" list="data" className="form-control"
                              placeholder="Search" aria-label="Recipient's username"
                              aria-describedby="basic-addon2"
                              {...register("searchSkill")}
                              required />

                            <datalist id="data">
                              {skillSelection.skillList.data.length != 1 && skillSelection.skillList.data.slice(1, skillSelection.skillList.data.length).map((item, key) => {
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
                            </div> */}
                          <AsyncSelect
                            className='mb-2 select-skill-referalOther'
                            isSearchable={true}
                            cacheOptions={true}
                            value={selectedOption}
                            loadOptions={loadOptions}
                            placeholder="Search a skill"
                            onChange={(e) => addNewSkill(e.value)}
                            formatOptionLabel={(option) => (
                              <>
                                {option.value === '' && <div>Please start typing to search for a skill</div>}
                                <div>{option.label}</div>
                              </>
                            )}
                            noOptionsMessage={({ inputValue }) =>
                              inputValue ? 'No results found' : 'Please start typing to search for a skill'
                            }
                          />
                        </div>
                      </div>

                      <div className="border mx-4">



                        {
                          addSkill.length == 0
                            ? <p className='text-center mt-3' >No Skill is found</p>
                            : addSkill.map((e, i) => {
                              return (
                                <div className='d-flex justify-content-between m-3 '>
                                  <div className="col-md-2 col-sm-2" >
                                    <span className='same-formating'>{e.skill}</span>
                                  </div>


                                  <div className="" style={{ marginRight: "1rem" }} >

                                    <Rating id={i} initialValue={0} onClick={(rate) => handleRating(rate, i)} fillColor='#4B2DFF'
                                      size='23px' />

                                  </div>
                                  <div className="mt-1">
                                    <MdDelete size={25} onClick={() => handleRemoveItem(e.skill)} style={{ 'cursor': 'pointer' }} />
                                  </div>

                                </div>
                              )
                            })
                        }
                      </div>
                      {/* </div> */}

                      <div className="row mt-3 " style={{ marginLeft: "3.3%", marginRight: "3.3%" }}>
                        <span className="" style={{ marginLeft: "-0.5rem" }} >Description </span>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="4"
                          placeholder="Write a note about the candidate/your referral "
                          name="description"
                          value={formValue.description}
                          onChange={handleChange}

                        ></textarea>
                        <p style={{ textAlign: "right" }}> 0/500</p>
                      </div>
                      {/* 
                       <div className="row"> 
                        <label className="form-label">Resume Upload</label>
            <div className="ml-2 mr-2" >
              <input
                className="form-control"
                type="file"
                name="file_upload"
                accept="application/pdf, .doc, .docx"
                onChange={resumeUpload} />
            </div>
                </div> */}

                      <div className="d-flex justify-content-center mt-3">
                        <button
                          type="submit"
                          className="buttonSend
 me-md-2 "
                        >
                          Save
                        </button>
                      </div>

                      <p className="text-center fs-6 mt-3" style={{ color: "green" }}>
                        {successMsgRefer}
                      </p>
                      <p className="text-center fs-6 mt-3" style={{ color: "Red" }}>
                        {errorMassage}
                      </p>

                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReferOther
