import React from 'react';
// import { useSelector } from "react-redux";
import Footer from "../../Component/Footer/footer";
import Sidebar from "../../Component/Sidebar/sidebar";
import UserPersonalInfo from "../UserPersonalInfo/userPersonalInfo";
import './userEditProfile.css'


const UserEditProfile = () => {

  // const titleSelection = useSelector(
  //   (state) => state.sidebarMenuSelectionReducer
  // );

  const referralProgram = () => {
    window.open("/referralInfo", "_blank");
  }
  return (
    <div style={{ backgroundColor: "#eeeeee" }}>


      <div className="d-flex justify-content-center">
        <div className='referral-reward-section'>
          <div className='container'>
            <div className='referral-reward'>
              <span><b>Referral Reward</b> </span><span> - </span><span onClick={referralProgram} role="button" 
  tabIndex="0"  style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: '500' }}>Click here to know more</span>
            </div>
          </div>
        </div>
      </div>
      <div className='container' >
        <div className='row'>
          <div className="col-lg-4 pt-lg-4">
            <Sidebar />
          </div>

          <div className="col-lg-8 pt-lg-4">
            <div className='right-content'>
            <UserPersonalInfo />
            </div>
          </div>
        </div>
      </div>
      <Footer />

    </div>
  )
}

export default UserEditProfile
