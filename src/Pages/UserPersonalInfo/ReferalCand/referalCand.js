import axios from 'axios';
import $ from "jquery";
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { AiOutlineCloseCircle } from "react-icons/ai";
import {
  BsPlusCircle
} from "react-icons/bs";
import './referalCand.css'
import { MdDelete, MdLibraryAdd } from "react-icons/md";
import { trackPromise } from "react-promise-tracker";
import { useSelector } from "react-redux";
import { Rating } from 'react-simple-star-rating';
import { userContext } from "../../../Context/userContextState";
import ApiConstants from '../../../Services/apiconstants';
import { checkRequired, numberOfSkill } from '../../../UtilitiesFunctions/utilitiesFunction';
import GivenSection from "./GivenReferal/GivenSection/givenSection.js";
import { Interceptor } from '../../../ErrorStatus/errorStatus';
import AsyncSelect from 'react-select/async';


const ReferCand = () => {
  const { userData } = useContext(userContext)

 



  if (sessionStorage.getItem('candidate_data') != null) {
    const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data"))
    // var mixpanelData = candidateDataMix.candidate.email;
    var token = candidateDataMix.token;
    var userId = candidateDataMix.candidate._id;
    // var candidateEmailId = candidateDataMix.candidate.email;
  }

  if (sessionStorage.getItem('candidate_data_ref') != null) {
    const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data_ref"))
    // var mixpanelData = candidateDataMix.candidate.email;
    var token = candidateDataMix.token;
    var userId = candidateDataMix.candidate._id;
    // var candidateEmailId = candidateDataMix.candidate.email;

  }



  const [successMsgRefer, setSuccessMsgRefer] = useState("")
  const [errorMassage, setErrorMessage] = useState("")
  const [referalData, setReferalData] = useState([])
  const [selectedOption, setSelectedOption] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const skillSelection = useSelector(
    (state) => state.skills
  );

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      const options = skillSelection.skillList.data.map(item => ({ value: item._id, label: item.skill }))
      const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      callback(filteredOptions);
    }, 1000);
  };

  const [addSkill, SetAddSkill] = useState([]);



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


  // const addNewSkill = (data) => {
  //   const newElement = data.searchSkill
  //   SetAddSkill(addSkill => [...addSkill, { skill: newElement, rating: 0 }])
  // }
  const handleChangeSkill = (data) => {
    let newElement

    skillSelection.skillList.data.map(item => {
      if (item._id == data) {
        newElement = item.skill
      }
    })

    SetAddSkill(addSkill => [...addSkill, { skillId: data, skill: newElement, rating: 0, experience: 0 }])
    setTimeout(() => {
      setSelectedOption(null);
    }, 1000);
  }
  const handleRemoveItem = (i) => {

    SetAddSkill(addSkill.filter(item => item.skill !== i));

  };

  const onSubmit = (data) => {
    let repitationFlag = false
    if (addSkill.length > 1) {
      for (let i = 1; i < addSkill.length; i++) {
        for (let j = i + 1; j < addSkill.length; j++) {
          if (addSkill[i].skill == addSkill[j].skill) {
            repitationFlag = true
            setErrorMessage(addSkill[i].skill + ' Already Exists')
          }
        }
      }
    }

    if (numberOfSkill(addSkill) === false) {

      setErrorMessage("Please add at least 3 skills")
    } else if (checkRequired(addSkill) === true) {

      setErrorMessage(" skill rating is required ")

    }



    if (numberOfSkill(addSkill) && checkRequired(addSkill) === false && !repitationFlag) {



      trackPromise(
        axios
          .post(
            ApiConstants.CREATE_REFERRER,
            {
              candidateName: data.candidateName,
              candidateEmail: data.candidateEmail,
              candidateLinkedInUrl: data.candidateLinkedInUrl,
              connectionType: data.connectionType,
              description: data.description,
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

            setTimeout(() => {
              $("[data-dismiss=modal]").trigger({ type: "click" })
            }, 1000)
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


  useEffect(() => {

    if (userData != 0) {
      setReferalData(userData[0].candidate.referrals)
    }
  }, [userData])


  return (
    <>
      <div className="card mb-3" >

        <div className="card-body">
          <div className="d-flex justify-content-between ">
            <span style={{ fontWeight: "500", fontSize: "1.5rem", color: "#444444" }}> <b>Referrals</b></span>
            <button
              type="button"
              className="btn edtBtn"
              data-toggle="modal"
              data-target=".referal"
            >
              <BsPlusCircle />
            </button>
          </div>

          {referalData.length != 0 ? <div>

            <div className="d-flex justify-content-center  mt-3">
              <button type="button" className="btn edtBtn" data-toggle="modal" data-target=".referal">
                <MdLibraryAdd size={25} color="var(--list-item-color)" />
              </button>
            </div>
            <div className="d-flex justify-content-center  mt-3">
              <button class="buttonSend me-md-2 " data-toggle="modal" data-target=".referal">
                Send Referral’s
              </button>
            </div> </div> : <div className="mt-3">

            <span className=" status" style={{ fontSize: "1.1rem" }} > Given</span>

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
                  <p className="modal-title fs-3 " id="exampleModalLongTitle">  Refer a candidate </p>
                  <button type="button" className="btn" data-dismiss="modal" aria-label="Close">
                    <AiOutlineCloseCircle />
                  </button>
                </div>

                <div className="modal-body">

                  <div className="container-fluid">

                    <span className="" >Add Detail </span>

                    <form onSubmit={handleSubmit(onSubmit)}>

                      <div className="row mt-3 ">
                        <div className="col-md-6 ">
                          <span className="mb-2" > Candidate Name*</span>
                          <input
                            type="text"
                            className="form-control"
                            id=""
                            placeholder=""
                            name="candidateName"
                            {...register("candidateName", {
                              required: "Please enter candidate name",
                            })}
                          />
                          {errors.candidateName && (
                            <span role="alert" style={{ color: "red" }}>
                              {errors.candidateName.message}
                            </span>
                          )}
                        </div>

                        <div className="col-md-6  form-group inputControle ">

                          <label htmlFor="connectionType" >How do you know him ? *</label>
                          <select id="connectionType" className="form-control"
                            {...register("connectionType", {
                              required: "Please select connection",
                            })}
                          >
                            <option value="I know as a Colleague" >I know as a Colleague</option>
                            <option value="I know as a Client" >I know as a Client</option>
                            <option value="I know as a Friend who I know very well " >I know as a Friend who I know very well </option>
                            <option value="I am recruiter and I know the candidate from my past association">
                              I am recruiter and I know the candidate from my past association
                            </option>
                          </select>
                          {errors.connectionType && (
                            <span role="alert" style={{ color: "red" }}>
                              {errors.connectionType.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12 col-sm-12 mt-3 ">
                        <span className="mb-2" > Candidate’s email address* </span>
                        <input
                          type="text"
                          className="form-control"
                          name="candidateEmail"
                          {...register("candidateEmail", {
                            required: "Email is required",
                            pattern: {
                              value:
                               /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                              message: "Entered value does not match email format",
                            },
                          })}
                        />
                        {errors.candidateEmail && (
                          <span role="alert" style={{ color: "red" }}>
                            {errors.candidateEmail.message}
                          </span>
                        )}
                      </div>
                      <div className="col-md-12 col-sm-12 mt-3 ">

                        <span className="mb-2" >LinkedIn Url*</span>
                        <input
                          type="url"
                          className="form-control"
                          name="candidateLinkedInUrl"
                          {...register("candidateLinkedInUrl", {
                            required: "LinkedIn url is required",
                            pattern: {
                              value: /^(https?:\/\/)?((www|\w\w)\.)?linkedin.com\/((in\/[a-zA-Z0-9-]+)|(company\/[a-zA-Z0-9-]+)|(school\/[a-zA-Z0-9-]+))\/?$/,
                              message: "Enter valid LinkedIn url",
                            },
                          })}
                        />
                        {errors.candidateLinkedInUrl && (
                          <span role="alert" style={{ color: "red" }}>
                            {errors.candidateLinkedInUrl.message}
                          </span>
                        )}
                      </div>

                      <div className="col-md-12 col-sm-12 mt-3 ">

                        {/* skill adding  start*/}
                        <span className >Add Skills* </span>
                        <div className="form-group has-search-for-filter">

                          {/* <select className="form-select" name='skill-adding'
                              defaultValue={'Select Skill'}
                              {...register('candidateSkill')}
                              onChange={(e) => handleChangeSkill(e.target.value)}
                            >
                              <option value="" selected disabled>Please select skill</option>
                              {skillSelection.skillList.data.length != 1 && skillSelection.skillList.data.slice(1, skillSelection.skillList.data.length).map((item, key) => {

                                return (
                                  <>
                                    <option key={key} value={item._id}>{item.skill}</option>
                                  </>
                                );

                              })}
                            </select> */}
                          <AsyncSelect
                            className='select-skill-referalCand'
                            isSearchable={true}
                            cacheOptions={true}
                            value={selectedOption}
                            loadOptions={loadOptions}
                            placeholder="Search a skill"
                            onChange={(e) => handleChangeSkill(e.value)}
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
                          {/* <div className="input-group-append  mx-1">
                              <button className="btn addSkillBtn" onClick={handleSubmit(addNewSkill)} >Add</button>
                            </div> */}

                        </div>

                        <div className="border">
                          {
                            addSkill.length > 0 ? addSkill.map((e, i) => {
                              return (
                                <div className="d-flex justify-content-between m-3" key={e.skill || i}>
                                  <div className="col-5" >
                                    <span className='same-formating'>{e.skill}</span>
                                  </div>

                                  <div className='col-6'>
                                    <Rating id={i} initialValue={0} onClick={(rate) => handleRating(rate, i)} fillColor='#4B2DFF'
                                      size='23px' />
                                  </div>

                                  <div className="col-md-2 col-sm-1" >
                                    <MdDelete size={25} onClick={() => handleRemoveItem(e.skill)} style={{ 'cursor': 'pointer' }} />
                                  </div>
                                </div>
                              );
                            })
                              : ''

                          }
                        </div>
                      </div>

                      {/* skill adding  start*/}

                      <div className="col-md-12 col-sm-12 mt-3 ">
                        <span className="mb-2" >Description* </span>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="4"
                          placeholder="write a note about the candidate/your referral"
                          name="description"
                          {...register("description")}
                          required
                        ></textarea>
                        <p style={{ textAlign: "right" }}> 0/500</p>
                      </div>

                      <div className="d-flex justify-content-center mt-3">
                        <button
                          type="submit"
                          className="buttonSend me-md-2 "
                        >
                          Refer Candidate
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

export default ReferCand
