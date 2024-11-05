import React from 'react';
import { useSelector } from "react-redux";
import Footer from "../../../Component/Footer/footer";
import NavBarNew from '../../../Component/NavBar New/navBarNew';
import ReferalSidebar from "../../../Component/ReferalSidebar/referalSidebar";
import ReferOther from '../ReferOther/referOther.js';
import './referedPage.css';


const ReferedPage = () => {

  const titleSelection = useSelector(

    (state) => state.sidebarMenuSelectionReducer
  )
  const referralProgram = () => {
    window.open("/referralInfo", "_blank");
  }

  return (
    <>
      <NavBarNew />

      <div className="container-fluid  " style={{ paddingLeft: "0", paddingRight: "0" }}>
        <div className="" style={{ backgroundColor: "#eeeeee", height: "100vh" }}>
          <div className="row d-flex justify-content-center  ">
            <div className='referral-reward-section'>
              <div className='referral-reward'>
                <span><b>Referral Reward</b> </span><span> - </span><span onClick={referralProgram} role="button" 
  tabIndex="0" style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: '500' }}>Click here to know more</span>
              </div>
            </div>
            <div className="col-md-3 p-md-4 p-sm-5 ">
              <ReferalSidebar />
            </div>

            <div className="col-md-8 p-md-4 ">

            <ReferOther />
            </div>
          </div>
          <div className="row ">
          </div>
        </div>
        <Footer />
      </div>

    </>
  )
}

export default ReferedPage
