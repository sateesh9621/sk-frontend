import React, { useEffect, useState } from 'react';
import './companyMessage.css'
import { ChatItem, MessageBox } from "react-chat-elements"
import axios from 'axios';
import ApiConstants from '../../../Services/apiconstants';
import { useForm } from 'react-hook-form';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import Loading from '../../../Component/Loading/loading';
import ChatImage from '../../../Assets/chatImage.png';
import { Interceptor } from '../../../ErrorStatus/errorStatus';
import CompanyLayout from '../Layout';
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";

export default function CompanyMessage() {
    const company_loggedin_user_data = JSON.parse(sessionStorage.getItem("company_loggedin_user_data"))
    const token = company_loggedin_user_data.token
    const companyId = company_loggedin_user_data.company._id
    const companyName = company_loggedin_user_data.company.companyName

    const [values, setValues] = useState({
        chatListData: {},
        conversation: {},
    });
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const [activeChat, setActiveChat] = useState(false);
    const [candidateName, setCandidateName] = useState('');
    const [converstionShown, setConverstionShown] = useState(false)
    const [styleChat, setStyleChat] = useState();
    const { promiseInProgress } = usePromiseTracker();

    const [messageData, setMessageDate] = useState({
        candidateName: '',
        subject: '',
        conversationId: '',
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
        resetField,
    } = useForm();

    const getAllChatListData = () => {
        trackPromise(
            axios
                .get(ApiConstants.GET_CONVERSATION_BY_COMPANY,

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
                    setValues({ ...values, chatListData: response.data.conversation })
                })
                .catch((error) => {
                    if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 503 && error.response.status <= 599)) {
                        Interceptor(error.response.status)
                    }
                })
        )
    }

    const createChatMessage = (message) => {
        axios
            .post(ApiConstants.CREATE_CHAT_MESSAGE_BY_COMPANY, {
                text: message,
                conversationId: messageData.conversationId
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
                getConversation(messageData.conversationId)
            })
            .catch((error) => {
                if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 503 && error.response.status <= 599)) {
                    Interceptor(error.response.status)
                }
            });
    }
    const getConversation = (id) => {

        axios
            .get(ApiConstants.GET_COMPANY_MESSAGE_BY_ID + id,

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
                setValues({ ...values, conversation: response.data.messages })
                setCandidateName(response.data.conversation.candidateName)
                setConverstionShown(true)
            })
            .catch((error) => {
                console.log(error)
                if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 503 && error.response.status <= 599)) {
                    Interceptor(error.response.status)
                }
            })

    }
    useEffect(() => {
        getAllChatListData();

    }, [])
    const messageDialogBox = (id, candidateName, subject) => {
        setMessageDate({ ...messageData, candidateName: candidateName, subject: subject, conversationId: id })
        setActiveChat(true)
        getConversation(id)
        setConverstionShown(false)
        setStyleChat(id);
        values.chatListData.map((data) => {
            if (data._id == id) {
                data.companyUnread = '0'
            }
        })

    }
    const onMessageSubmit = (data) => {
        createChatMessage(data.message);
        resetField("message")
    }

    const endConversation = async (conversationId) =>  {
      setLoading(true);
  
     await axios.post( ApiConstants.END_CONVERSATION_COMPANY,
        {
          conversationId:conversationId,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            token: token,
            // _id: userId,
            "Access-Control-Allow-Origin": true,
            "Access-Control-Allow-Methods": "GET, POST, PATCH",
          },
        }
      )
      .then((response) => {
          setTimeout(() => {
              setLoading(false);
              setDisabled(true);
          }, 1500);
      })
      .catch((error) => {
        setLoading(false);
        if (
          (error.response.status >= 404 && error.response.status <= 499) ||
          (error.response.status >= 503 && error.response.status <= 599)
        ) {
          Interceptor(error.response.status);
        }
      });
    }
   
     

    return (
        <CompanyLayout>
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-lg-5">
                <div className="message-heading">
                  <span>Messages</span>
                </div>

                <div className="chat-list">
                  {promiseInProgress == true ? (
                    <Loading />
                  ) : Object.keys(values.chatListData).length > 0 ? (
                    values.chatListData.map((d, index) => {
                      return (
                        <ChatItem
                          className={styleChat == d._id ? "chat-list-st" : ""}
                          avatar={
                            d.candidateImage?.length > 0
                              ? d.candidateImage
                              : "https://avatars.githubusercontent.com/u/80540635?v=4"
                          }
                          alt={"image" + index}
                          title={d.candidateName}
                          subtitle={"Sub: " + d.subject}
                          date={d.updatedAt}
                          onClick={() =>
                            messageDialogBox(d._id, d.candidateName, d.subject)
                          }
                          unread={d.companyUnread}
                        />
                      );
                    })
                  ) : (
                    <p
                      className="d-flex justify-content-center"
                      style={{ marginTop: "10px", color: "red" }}
                    >
                      There are no messages. <br />
                      Please initiate a conversation with the candidate you are
                      interested in. When initiating a conversation, please
                      include a subject that would motivate the candidate to
                      respond.
                    </p>
                  )}
                </div>
              </div>

              {activeChat && (
                <div className="col-md-12 col-lg-7">
                  <div className="chat-box-heading  d-flex justify-content-between">
                    <div>
                      <span className="chat-name">
                        {messageData.candidateName}
                      </span>
                      <br />
                      <span className="chat-subject">
                        Sub: {messageData.subject}
                      </span>
                    </div>
                    <div>
                      <Button
                         onClick={ () => endConversation(messageData.conversationId)}
                        endIcon={<SendIcon />}
                        loadingPosition="end"
                        variant="contained"
                        disabled={disabled}
                        sx={{
                          backgroundColor: disabled ? "#b3cde0" : "#246da2",
                          "&:hover": {
                            backgroundColor: disabled ? "#b3cde0" : "#246da2",
                          },
                        }}
                      >
                        {loading ? (
                          <CircularProgress sx={{ color: "white" }} size={20} />
                        ) : (
                          "End Conversation"
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="message-window">
                    {converstionShown ? (
                      Object.keys(values.conversation).length > 0 &&
                      values.conversation.map((m) => {
                        return (
                          <MessageBox
                            position={
                              m.senderId != companyId ? "left" : "right"
                            }
                            type="text"
                            title={
                              m.senderId == companyId
                                ? companyName
                                : candidateName
                            }
                            text={m.text}
                            date={m.updatedAt}
                          />
                        );
                      })
                    ) : (
                      <p className="d-flex justify-content-center">
                        Loading....
                      </p>
                    )}
                  </div>
                  <div className="chat-input">
                    <form onSubmit={handleSubmit(onMessageSubmit)}>
                      <div className="input-group mb-3">
                        <textarea
                          className="form-control"
                          placeholder="Write a message here...."
                          rows="3"
                          {...register("message", {
                            required: true,
                          })}
                        />

                        <button
                          type="submit"
                          className="btn btn-outline-secondary"
                        >
                          Send
                        </button>
                        <br />
                      </div>
                      {errors.message?.type === "required" && (
                        <p role="alert" style={{ color: "red" }}>
                          Message is required
                        </p>
                      )}
                    </form>
                  </div>
                </div>
              )}

              {!activeChat && (
                <div className="col-md-12 col-lg-7">
                  <div className="chat-image">
                    <img src={ChatImage} className="img-fluid" alt='ChatImage' />
                  </div>
                  <div className="new-message">
                    <span>Welcome to Skilltera Chat</span>
                  </div>
                  <div className="welcome-content">
                    <p>
                      Please click on the conversation based on the candidate
                      and conversation subject to continue with the
                      conversation.
                    </p>
                  </div>
                </div>
              )}

              {/* for mobile */}
            </div>
          </div>
        </CompanyLayout>
    );
}