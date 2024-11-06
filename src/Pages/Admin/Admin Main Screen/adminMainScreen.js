import React from "react";
import "./adminMainScreen.css";
import { useDispatch, useSelector } from "react-redux";
import AdminSidebar from "../../../Component/Admin Sidebar/adminSidebar";
import CompanySignup from "../Company Signup/companySignup";
import ResetCompanyPassword from "../Reset Company Password/resetCompanyPassword";
import AllCompanies from "../All Companies/allCompanies";
import AllCandidates from "../All Candidates/allCandidates";
import CandidateSignup from "../Cadidate Signup/candidateSignup";
import SkillAddRemove from "../Skill Add Remove/skillAddRemove";
import Hamburger from '../../../Assets/ci_hamburger.png';
import { useForm } from "react-hook-form";
import JobRole from "../Job Role/jobRole";
import JobApproval from "../Job Approval/jobApproval";
import NavBarNew from "../../../Component/NavBar New/navBarNew";
import { inputSearchBar } from "../../../Redux/Reducer/searchBarSlice";

export default function AdminMainScreen() {
  const dispatch = useDispatch();
  const titleSelection = useSelector((state) => state.sidebarMenuSelectionReducer);
  const { register, handleSubmit } = useForm();

  const logout = () => {
    sessionStorage.clear();
    window.location.pathname = "/";
  };

  const onSubmit = (data) => {
    dispatch(inputSearchBar(data.searchKeyword));
  };

  const getPlaceholderText = () => {
    switch (titleSelection.menuSelection) {
      case "All Companies":
        return "Search By Company Name";
      case "allCandidate":
        return "Search By Candidate Email";
      case "Skill Add/Remove":
        return "Search By Skill Name";
      case "Job Role Add/Remove":
        return "Search By Job Role Name";
      default:
        return "Disabled";
    }
  };

  const isDisabled = ["Company Signup", "Reset Company Password", "Candidate Signup"].includes(titleSelection.menuSelection);

  const renderContent = () => {
    switch (titleSelection.menuSelection) {
      case "Company Signup":
        return <CompanySignup />;
      case "Reset Company Password":
        return <ResetCompanyPassword />;
      case "All Companies":
        return <AllCompanies />;
      case "allCandidate":
        return <AllCandidates />;
      case "Candidate Signup":
        return <CandidateSignup />;
      case "Skill Add/Remove":
        return <SkillAddRemove />;
      case "Job Role Add/Remove":
        return <JobRole />;
      case "Job Approval":
        return <JobApproval />;
      case "logout":
        logout();
        return null;
      default:
        return <h1>Error</h1>;
    }
  };

  return (
    <>
      <NavBarNew />
      <div style={{ height: "auto", background: "white" }}>
        <hr />
        <div className="hamburger-input-section m-2">
          <div className="row">
            <div className="col-2 col-lg-1">
              <img
                src={Hamburger}
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasWithBothOptions"
                aria-controls="offcanvasWithBothOptions"
                style={{ cursor: "pointer" }}
                alt="Hamburger"
              />
            </div>
            <div className="col-10 col-lg-11">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-group mb-3 input-group-lg">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={getPlaceholderText()}
                    disabled={isDisabled}
                    {...register("searchKeyword")}
                  />
                  <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="submit" style={{ height: "52px" }}>
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {renderContent()}
        </div>
        <AdminSidebar />
      </div>
    </>
  );
}
