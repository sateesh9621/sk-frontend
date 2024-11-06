import React, { useState } from 'react'
import './studentCard.css'
import ProfilePic from '../../Assets/about_pic_2.png';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios'
import ApiConstants from "../../Services/apiconstants";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';
import $ from "jquery";
import { Interceptor } from "../../ErrorStatus/errorStatus"
import { selectCardItemSelection } from '../../Redux/Reducer/cardItemSelectionSlice';


export default function StudentCard(props) {

    const dispatch = useDispatch();

    const [handleShow, setHandleShow] = useState(false);
    const [chatId, setChatId] = useState('');
    const [fullName, setFullName] = useState('');

    const titleSelection = useSelector(
        (state) => state.sidebarMenuSelectionReducer
    );


    const cardItemSelection = (menuItem, id) => {

        dispatch(selectCardItemSelection(id))
        const company_loggedin_user_data = JSON.parse(sessionStorage.getItem("company_loggedin_user_data")) || ""

        const token = company_loggedin_user_data.token
        const userId = company_loggedin_user_data.company._id

        if (menuItem == 'shortlisted') {

            axios.post(ApiConstants.SHORTLISTED_CANDIDATE, {
                candidateId: id
            }, {
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                    token: token,
                    _id: userId,
                    "Access-Control-Allow-Origin": true,
                    "Access-Control-Allow-Methods": "GET, POST, PATCH",
                },
            }).then((res) => {

            }).catch((error) => {
                console.log(error)

                if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
                    Interceptor(error.response.status)
                }

            })
        };

        if (menuItem == 'rejected') {

            axios.post(ApiConstants.REJECTED_CANDIDATE, {
                candidateId: id
            }, {
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                    token: token,
                    _id: userId,
                    "Access-Control-Allow-Origin": true,
                    "Access-Control-Allow-Methods": "GET, POST, PATCH",
                },
            }).then((res) => {

            }).catch((error) => {

                if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
                    Interceptor(error.response.status)

                }
                console.log(error)
            })
        };

        if (menuItem == 'interviewing') {

            axios.post(ApiConstants.INTERVIEWING_CANDIDATE, {
                candidateId: id
            }, {
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                    token: token,
                    _id: userId,
                    "Access-Control-Allow-Origin": true,
                    "Access-Control-Allow-Methods": "GET, POST, PATCH",
                },
            }).then((res) => {

            }).catch((error) => {

                if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
                    Interceptor(error.response.status)
                }

                console.log(error)
            })
        };

        if (menuItem == 'saved') {

            axios.post(ApiConstants.FUTURE_CANDIDATE, {
                candidateId: id
            }, {
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                    token: token,
                    _id: userId,
                    "Access-Control-Allow-Origin": true,
                    "Access-Control-Allow-Methods": "GET, POST, PATCH",
                },
            }).then((res) => {

            }).catch((error) => {

                if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
                    Interceptor(error.response.status)
                }

                console.log(error)
            })
        };

    }

    const viewFullProfile = (id) => {
        window.open("/company/candidate/" + id, "_blank");
    }

    const startChat = (id, fullname) => {
        //dispatch(selectSidebarMenuSelection("message"));
        setFullName(fullname)
        setChatId(id)
        setHandleShow(!handleShow)
    }
    const {
        register,
        handleSubmit,
        formState: { errors },
        resetField,
    } = useForm();

    const onSubmit = (data) => {
        const company_loggedin_user_data = JSON.parse(sessionStorage.getItem("company_loggedin_user_data"))
        const token = company_loggedin_user_data.token
        axios.post(ApiConstants.CREATE_CONVERSATIONS, {
            subject: data.subject.trim(),
            candidateId: chatId
        }, {
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
                token: token,
                "Access-Control-Allow-Origin": true,
                "Access-Control-Allow-Methods": "GET, POST, PATCH",
            }
        }).then((response) => {
            axios.post(ApiConstants.CREATE_CHAT_MESSAGE_BY_COMPANY, {
                conversationId: response.data.conversation._id,
                text: data.message
            }, {
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                    token: token,
                    "Access-Control-Allow-Origin": true,
                    "Access-Control-Allow-Methods": "GET, POST, PATCH",
                }
            }).then(res => {
                Swal.fire({
                    title: res.data.message,
                    icon: "success",
                    width: 400,
                    height: 50,
                }).then(() => {
                    resetField('message')
                    resetField('subject')
                    $("[data-dismiss=modal]").trigger({ type: "click" })
                })


            }).catch(error => {
                if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 503 && error.response.status <= 599)) {
                    Interceptor(error.response.status)
                }
            })
        }).catch((error) => {
            if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 503 && error.response.status <= 599)) {
                Interceptor(error.response.status)
            }
        })
    }

    const handleClose = () => {
        setHandleShow(!handleShow)
    }

    return (
        <>
            {props.data.length != 0 && props.data.map(items => {
                return (
                    <div className='card-box mb-2'>
                        <div className='patch-card'>
                            <div className="d-flex justify-content-end menu-item-box">
                                {titleSelection.menuSelection != 'shortlisted' && <div className='menu-item-box-hover-feature'>
                                    <span data-toggle="tooltip" title="Shortlisted" onClick={() => cardItemSelection('shortlisted', items._id)}>
                                        <span className="iconify me-2" data-icon="fluent:task-list-square-person-20-filled" style={{ fontSize: '26px' }}></span>
                                    </span>
                                </div>}
                                {titleSelection.menuSelection != 'rejected' && <div className='menu-item-box-hover-feature'>
                                    <span data-toggle="tooltip" title="Rejected" onClick={() => cardItemSelection('rejected', items._id)}>
                                        <span className="iconify me-2" data-icon="ic:round-group-remove" style={{ fontSize: '26px' }}></span>
                                    </span>
                                </div>}
                                {titleSelection.menuSelection != 'interviewing' && <div className='menu-item-box-hover-feature'>
                                    <span data-toggle="tooltip" title="Interviewing" onClick={() => cardItemSelection('interviewing', items._id)}>
                                        <span className="iconify me-2" data-icon="fa-solid:street-view" style={{ fontSize: '26px' }}></span>
                                    </span>
                                </div>}
                                {titleSelection.menuSelection != 'saved' && <div className='menu-item-box-hover-feature'>
                                    <span data-toggle="tooltip" title="Saved" onClick={() => cardItemSelection('saved', items._id)}>
                                        <span className="iconify me-2" data-icon="dashicons:cloud-saved" style={{ fontSize: '26px' }}></span>
                                    </span>
                                </div>}
                            </div>
                        </div>
                        <div className='for-border'>
                            <div className='student-profile'>
                                <img className="student-profile-pic" src={items.imageLink ? items.imageLink : ProfilePic} alt='student-profile' />
                            </div>

                            <div className='skills'>
                                <div className='row'>
                                    <div className='col-lg-3'>
                                        <span className='card-menu-items'>SKILLS</span>
                                    </div>
                                    <div className='col-lg-9'>

                                        {items.skills.length == 0 ? <span className='card-menu-items'>NA</span> : items.skills.map(s => {
                                            const starTotal = 5;
                                            const starPercentage = (s.rating / starTotal) * 100;
                                            const starPercentageRounded = `${(Math.round(starPercentage / 10) * 10)}%`;
                                            return (
                                                <>
                                                    <span className='card-menu-items-data dyanmic-size-changed'>{s.skill}&nbsp;</span>
                                                    <div className="stars-outer dyanmic-size-changed">
                                                        <div className="stars-inner" style={{ width: starPercentageRounded }}></div>
                                                        &#44;&nbsp;
                                                    </div>

                                                    {/* <ReactStars fillColor='#4B2DFF' size='23px' value={s.rating} /> */}
                                                </>
                                            );
                                        })}

                                    </div>
                                </div>


                            </div>
                            <div className='exprience'>
                                <div className='row'>
                                    <div className='col-lg-3'>
                                        <span className='card-menu-items'>EXPERIENCE</span><br />
                                        <span className='current-role'>CURRENT ROLE</span>
                                    </div>
                                    <div className='col-lg-9'>

                                        {items.overallExperience ? <><span className='college-degree card-menu-items-data'>Total {items.overallExperience} Months of Experience</span><br /></> : <><span className='card-menu-items'>NA</span><br /></>}
                                        {(items.currentRole && items.currentCompany) ? <> <span className='sub-heading card-menu-items-data'>{items.currentRole} at {items.currentCompany} </span></> : <span className='card-menu-items'>NA</span>}


                                    </div>
                                </div>
                            </div>

                            <div className='client'>
                                <div className='row'>
                                    <div className='col-lg-3'>
                                        <span className='card-menu-items'>CLIENT/COMPANY</span>
                                    </div>
                                    <div className='col-lg-9'>
                                        {items.previousEmployers ? <><span className='card-menu-items-data dyanmic-size-changed'>{items.previousEmployers}</span></> : <><span className='card-menu-items'>NA</span></>}


                                    </div>
                                </div>
                            </div>

                            <div className='education'>
                                <div className='row'>
                                    <div className='col-lg-3'>
                                        <span className='card-menu-items'>EDUCATION</span>
                                    </div>
                                    {items.education.length == 0 ? <span className='col-lg-9 card-menu-items'>NA</span> : items.education.slice(0, 1).map(e => {
                                        const endDate = new Date(e.endDate).getFullYear();
                                        const startDate = new Date(e.startDate).getFullYear();

                                        return (<div className='col-lg-9'>
                                            <span className='college-degree card-menu-items-data'>{e.degree}, {e.major} &nbsp; ({startDate} - {endDate})</span><br />
                                            <span className='sub-heading card-menu-items-data'>{e.school} </span>
                                        </div>);

                                    })}
                                </div>
                            </div>

                            <div className='patch-card-last'>
                                <div className='row'>
                                    <div className='col'>
                                        <div className='d-flex justify-content-start view-full-profile'>

                                            <span className='' onClick={() => viewFullProfile

                                                (items._id)}>View Full Profile</span>

                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='d-flex justify-content-end start-chat'>
                                            <span onClick={() => startChat(items._id, items.fullname)}>Start Chat</span> &nbsp;
                                            <span className="iconify me-2" data-icon="bxs:message" style={{ color: '#6E4DCD' }}></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div >
                );
            })}

            <Modal show={handleShow} animation={false}>
                <Modal.Header>
                    <Modal.Title>{fullName}</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>Subject</label>
                            <input type="text" className="form-control"
                                placeholder="FrontEnd Developer"
                                {...register('subject', {
                                    required: true
                                })}

                            />
                            {errors.subject?.type === 'required' && <p role="alert" style={{ color: "red" }}>Subject is required</p>}
                        </div><br />
                        <div className="form-group">
                            <label>Messgae</label>
                            <textarea type="textarea"
                                rows="8"
                                className="form-control"
                                placeholder="Write something to the candidate..."
                                {...register('message', {
                                    required: true
                                })} />
                            {errors.message?.type === 'required' && <p role="alert" style={{ color: "red" }}>Message is required</p>}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose} data-dismiss="modal">Close</button>
                        <button type="submit" className="btn btn-primary">Send</button>
                    </div>
                </form>
            </Modal>
        </>
    );
}