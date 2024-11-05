import axios from "axios";
import $ from "jquery";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsPencil, BsPlusCircle } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { useDispatch, useSelector } from "react-redux";
import { Rating } from 'react-simple-star-rating';
import Swal from "sweetalert2";
import Loading from "../../../Component/Loading/loading";
import StarRating from "../../../Component/StarRating/starRating";
import { userContext } from "../../../Context/userContextState";
import ApiConstants from "../../../Services/apiconstants";
import Mixpanel from "../../../Services/mixpanel";
import { checkRequired, checkSkillLength } from "../../../UtilitiesFunctions/utilitiesFunction";
import './skillCard.css';
import UpdDelSkill from "./UpdDelSkill/updDelSkill";
import { Interceptor } from "../../../ErrorStatus/errorStatus";
import AsyncSelect from 'react-select/async';


export const SkillCard = () => {
  const { promiseInProgress } = usePromiseTracker();
  const { userData, getData } = useContext(userContext)
  

  if (sessionStorage.getItem('candidate_data') != null) {
    const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data"))
    // var mixpanelData = candidateDataMix.candidate.email;
    var token = candidateDataMix.token;
    var userId = candidateDataMix.candidate._id;
    var candidateEmailId = candidateDataMix.candidate.email;
  }

  if (sessionStorage.getItem('candidate_data_ref') != null) {
    const candidateDataMix = JSON.parse(sessionStorage.getItem("candidate_data_ref"))
    // var mixpanelData = candidateDataMix.candidate.email;
    var token = candidateDataMix.token;
    var userId = candidateDataMix.candidate._id;
    var candidateEmailId = candidateDataMix.candidate.email;

  }

  const {
    formState: {  },
  } = useForm();

  const [skillData, setSkillData] = useState([{}])
  const [successMessageAddSkill, setSuccessMessageAddSkill] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [addSkill, SetAddSkill] = useState([{}]);
  const [selectedOption, setSelectedOption] = useState(null);


  const skillSelection = useSelector(
    (state) => state.skills
  );

  const handleRemoveItem = (i) => {
    SetAddSkill(addSkill.filter(item => item.skillId != i));

  };

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      const options = skillSelection.skillList.data.map(item => ({ value: item._id, label: item.skill }))
      const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      callback(filteredOptions);
    }, 1000);
  };

  const handleChangeExp = (event, idx) => {

    const label = 'experience'
    const newValue = event.target.value

    SetAddSkill([
      ...addSkill.slice(0, idx + 1),
      {
        ...addSkill[idx + 1],
        [label]: Number(newValue),
      },
      ...addSkill.slice(idx + 2),
    ])
  }

  const handleChangeExpEdit = (event, idx) => {

    const newValue = event.target.value

    const updatedArray = skillData.map((item, i) => {
      if (i == idx) {
        return { ...item, experience: Number(newValue) };
      } else {
        return item;
      }
    });

    setSkillData(updatedArray)
  }


  const handleRating = (rate, idx) => {

    const label = 'rating'
    const newValue = rate

    SetAddSkill([
      ...addSkill.slice(0, idx + 1),
      {
        // here update data value
        ...addSkill[idx + 1],
        [label]: newValue,
      },
      ...addSkill.slice(idx + 2),
    ]);

  }

  const handleRatingEditSkill = (rate, skill) => {

    const newValue = rate

    const updatedArray = skillData.map((item) => {
      if (item.skillId.skill == skill) {
        return { ...item, rating: newValue };
      } else {
        return item;
      }
    });

    setSkillData(updatedArray)

  }

  const mixpanelButton = (purpose, buttonName) => {

    Mixpanel(purpose, buttonName, candidateEmailId)

  }

  const onSubmit = (data) => {
    setSelectedOption(selectedOption);
    let newElement

    skillSelection.skillList.data.map(item => {
      if (item._id == data.value) {
        newElement = item.skill
      }
    })

    SetAddSkill(addSkill => [...addSkill, { skillId: data.value, skill: newElement, rating: 0, experience: 0 }])
    setErrorMsg("")
    setTimeout(() => {
      setSelectedOption(null);
    }, 1000);
  }


  const saveSkill = () => {

    let repitationFlag = false
    let skillArray = addSkill


    if (skillArray.length > 1) {
      for (let i = 0; i < skillArray.length; i++) {
        for (let j = i + 1; j < skillArray.length; j++) {
          if (skillArray[i].skill == skillArray[j].skill) {
            repitationFlag = true
            setErrorMsg(skillArray[i].skill + ' Already Exists')
          }
        }
      }
    }


    if (skillData.length > 1) {
      for (let i = 0; i < skillData.length; i++) {
        for (let j = 1; j < skillArray.length; j++) {
          if (skillData[i].skillId.skill == skillArray[j].skill) {
            repitationFlag = true
            setErrorMsg(skillArray[j].skill + ' Already Exists')
          }
        }
      }
    }
    skillArray = skillArray.concat(skillData)

    if (checkSkillLength(skillArray) === false) {

      setErrorMsg("Please add more than 3 skills. More the better for your profile.")

    }
    else if (checkRequired(skillArray)) {

      setErrorMsg("Please enter experience and rate the skills")

    }

    if (checkSkillLength(skillArray) && checkRequired(skillArray) === false && !repitationFlag) {
      trackPromise(
        axios
          .post(
            ApiConstants.ADD_SKILL, {
            skillArray: skillArray
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
            //setSkillData(...skillData, response.data.result)
            setSkillData(response.data.result)
            setSuccessMessageAddSkill(response.data.message);

            setTimeout(() => {
              $("[data-dismiss=modal]").trigger({ type: "click" })
            }, 1000)

            SetAddSkill([{}])

            getData()

          })
          .catch((error) => {
            if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
              Interceptor(error.response.status)
            }

          })
      )
    }

  }

  const saveSkillEdit = () => {

    // const skillArrayEdit = skillData
    if (checkRequired(skillData)) {
      setErrorMsg("Please enter experience")
    }


    if (checkRequired(skillData) === false) {
      trackPromise(
        axios
          .patch(
            ApiConstants.UPDATE_SKILL, {
            skillArray: skillData
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
            setSuccessMessageAddSkill(response.data.message);
            setSkillData(response.data.result)
            $("[data-dismiss=modal]").trigger({ type: "click" })
            // setTimeout(() => {
            //   $("[data-dismiss=modal]").trigger({ type: "click" })
            // }, 100)


            getData()

          })
          .catch((error) => {
            if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
              Interceptor(error.response.status)
            }

          })
      )
    }

  }

  useEffect(() => {
    if (userData != 0) {
      setSkillData(userData[0].candidate.skills)
    }

  }, [successMessageAddSkill, userData])


  const deleteSkill = (skill, skillId) => {
    const filterSkillArray = skillData.filter(obj => {
      return obj.skillId.skill != skill
    });

    trackPromise(axios
      .patch(
        ApiConstants.DELETE_SKILL + skillId, {
      },
        {
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            token: token,
            _id: userId,
            "Access-Control-Allow-Origin": true,
            "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE",
          },
        }
      )
      .then((response) => {
        setSkillData(filterSkillArray)
      })
      .catch((error) => {
        if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
          Interceptor(error.response.status)
        }
      }))

  }

  useEffect(() => {
    const manageOutSideClick = (event) => {
      setSuccessMessageAddSkill("")
    }
    document.addEventListener("click", manageOutSideClick)
    return () => {
      document.removeEventListener("click", manageOutSideClick)
    }
  }, [])

  return (
    <>
      {/* Skill */}
      {promiseInProgress === true ? (
        <Loading />
      ) : null}
      <div className="card mb-3 candidate-global-section">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <span
              style={{
                fontWeight: "500",
                fontSize: "20px",
                color: "#444444",
              }}
            >
              <b>Technical / Soft / Personal Skills</b>
            </span>

            {/* ADD SKILL PopUP */}
            <div class="btn-group" role="group">
            <button
              type="button"
              className="btn edtBtn"
              data-toggle="modal"
              data-target="#skilladd"
            >
              <BsPlusCircle />
            </button>
            <button
              type="button"
              className="btn"
              data-toggle="modal"
              data-target="#skill"
            >
              <BsPencil />
            </button>
            </div> 

            <div
              className="modal fade"
              id="skilladd"
              tabindex="-1"
              role="dialog"
              aria-labelledby="exampleModalCenterTitle"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content modalContent">
                  <div className="modal-header">
                    <p className="modal-title" id="exampleModalLongTitle"
                      style={{
                        fontWeight: "500",
                        fontSize: "1.5rem",
                        color: "#444444",
                      }}
                    >
                      Add Skills
                    </p>
                    <button
                      type="button"
                      className="btn"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <AiOutlineCloseCircle />
                    </button>
                  </div>
                  <div className="modal-body ">
                    <div className="container-fluid">

                      {promiseInProgress === true ? <Loading /> : null}

                      <div className="filter-search-box">
                        <div className="form-group has-search-for-filter">
                         
                          <AsyncSelect
                            isSearchable={true}
                            cacheOptions={true}
                            value={selectedOption}
                            loadOptions={loadOptions}
                            placeholder="Search a skill"
                            onChange={onSubmit}
                            formatOptionLabel={(option) => (
                              <>
                                {option.value === '' && <div>Please start typing to search for a skill</div>}
                                <div>{option.label}</div>
                              </>
                            )}
                            noOptionsMessage={({ inputValue }) =>
                              inputValue ? 'No results found' : 'Please start typing to search for a skill'
                            }
                            required />
                          {/* <div className="input-group-append mx-1">
                            <button className="btn addSkillBtn" type="submit" >Add</button>
                          </div> */}


                        </div>
                      </div>

                      <div className='mt-4'>
                        {
                          addSkill.length == 1
                            ? <p className='text-center' ></p>
                            : addSkill.slice(1, addSkill.length).map((e, i) => {
                              return (
                                <div className='d-flex justify-content-around m-3'>

                                  <div className="col-md-2">
                                    <span className='same-formating'>{e.skill}</span>
                                  </div>

                                  <div>
                                    <input className="rounded border-light"
                                      placeholder="Experience (in years)"
                                      onChange={(e) => { handleChangeExp(e, i) }}
                                      name="skillExp"
                                      type="number"
                                      required
                                      min="0"
                                    />
                                  </div>
                                  {/* Star Rating */}
                                  <div>
                                    <div className='col filter-star' >
                                      <Rating id={i} initialValue={0} onClick={(rate) => handleRating(rate, i)} fillColor='#4B2DFF'
                                        size='23px' />

                                    </div>
                                  </div>

                                  <div>
                                    <button className="deleteSkillBtn" type="button " onClick={() => handleRemoveItem(e.skillId)}>
                                      <MdDelete size={25} />
                                    </button>
                                  </div>
                                </div>
                              )
                            })
                        }
                      </div>

                      {/* add Skill using star rating ,input tag, experince END */}

                      <div className="d-flex justify-content-center mt-3 mb-3">
                        <button type="submit" style={{ background: 'var(--list-item-color)' }} onClick={() => { saveSkill(); mixpanelButton('Candidate Added Skills in Personal Page', 'Save button') }} className="buttonSend
me-md-2 ">
                          Save
                        </button>
                      </div>
                      <p className="text-center fs-6" style={{ color: "red" }}>
                        {errorMsg}
                      </p>
                      <p className="text-center fs-6" style={{ color: "green" }}>
                        {successMessageAddSkill}
                      </p>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="edit-button">
           
          </div>
          <div
            className="modal fade"
            // id={"skill" + `${props.skillId}`}
            id="skill"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div className="modal-content modalContent ">
                <div className="modal-header">
                  <p className="modal-title"
                    style={{
                      fontWeight: "500",
                      fontSize: "1.5rem",
                      color: "#444444",
                    }} >
                    Edit Skill
                  </p>

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
                  <div className="container-fluid">
                    {promiseInProgress === true ? <Loading /> : null}
                    {skillData.length > 0 ?
                      skillData.map((x, i) => {
                        return (
                          <div>
                            <div className="d-flex justify-content-between mt-3">
                              <div className="col-md-3 col-sm-12">
                                <span style={{ fontWeight: "400", fontSize: "1rem" }}>
                                  <b>{x?.skillId?.skill}</b>
                                </span>
                              </div>

                              <div className="">
                                <div>
                                  <p>Self Rating</p>
                                </div>
                                <div>
                                  <p>Experience (yrs) </p>
                                </div>
                              </div>

                              <div className=" ">
                                <div>
                                  <p>
                                    <Rating id={i} initialValue={x?.rating} onClick={(rate) => handleRatingEditSkill(rate, x?.skillId?.skill)} fillColor='#4B2DFF'
                                      size='23px' />
                                  </p>
                                </div>
                                <div>
                                  <div>
                                    <input className="rounded border-light"
                                      placeholder="Experience (in years)"
                                      onChange={(e) => { handleChangeExpEdit(e, i) }}
                                      name="skillExp"
                                      type="number"
                                      value={x?.experience}
                                      required
                                      min="0"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className=" ">
                                <button className="deleteSkillBtn" onClick={() => deleteSkill(x?.skillId?.skill, x?.skillId?._id)}>
                                  <MdDelete size={25} />
                                </button>
                              </div>
                            </div>
                            <hr className="mt-0"></hr>
                          </div>

                        )
                      }) : " "}

                  </div>
                  <div className="d-flex justify-content-center mt-3 mb-3">
                    <button type="submit" style={{ background: 'var(--list-item-color)' }} onClick={() => { saveSkillEdit(); mixpanelButton('Candidate Added Skills in Personal Page', 'Save button') }} className="buttonSend
me-md-2 ">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row border mb-3 mx-1">
            {skillData.length > 0 ?

              skillData.map((x) => {
                return (
                  <div className="previous-employer-box pt-2 m-2" style={{ height: "35px", width: "auto", borderRadius: "5px" }} >
                    <span>{x?.skillId?.skill} </span>
                  </div>
                )
              }) : " "}
          </div>

          <div className="updDel">
          
            {skillData.length > 0 ?

              skillData.map((x) => {
                return (

                  <UpdDelSkill
                    key={x?._id}
                    skillId={x?.skillId?._id}
                    rating={x?.rating}
                    experience={x?.experience}
                    skill={x?.skillId?.skill} />

                )
              }) : " "}

          </div>
        </div>
      </div>

    </>
  )
}

