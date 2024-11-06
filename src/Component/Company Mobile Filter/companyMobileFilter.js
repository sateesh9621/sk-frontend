import React, { useState } from "react";
import "./companyMobileFilter.css";

export default function CompanyMobileFilter() {
  const [addSkill, SetAddSkill] = useState([{}]);
  const [filterExp, SetFilterExp] = useState();

  const test = [
    { skill: "React" },
    { skill: "C++" },
    { skill: "Angular" },
    { skill: "Java" },
    { skill: "Go" },
    { skill: "Python" },
  ];

  const skilladding = (e) => {
    const newElement = e.target.value;
    SetAddSkill((addSkill) => [...addSkill, { skill: newElement }]);
  };

  const handleRemoveItem = (i) => {
    SetAddSkill(addSkill.filter((item) => item.skill !== i));
  };

  const filterExpOption = (e) => {
    SetFilterExp(e.target.value);
  };

  return (
    
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle">
              Filter
            </h5>
          </div>
          <div className="modal-body">
            <div className="filter-search-mobile-box">
              <div className="form-group has-search-mobile-for-filter">
                <select
                  className="form-control"
                  placeholder="Search"
                  onChange={skilladding}
                >
                  <option selected>Search Skill</option>
                  {test.map((s) => {
                    return (
                      
                        <option value={s.skill} name={s.skill}>
                          {s.skill}
                        </option>
                      
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="filter-skill-mobile">
              {addSkill.length == 1 ? (
                <span
                  className="d-flex justify-content-center"
                  style={{ textAlign: "center" }}
                >
                  No Skill is found
                </span>
              ) : (
                addSkill.slice(1, addSkill.length).map((e, i) => {
                  return (
                    <div className="row" key={i}>
                      <div className="col filter-searched-skill-mobile">
                        <i
                          className="fa fa-times"
                          onClick={() => handleRemoveItem(e.skill)}
                          style={{ cursor: "pointer" }}
                          aria-hidden="true" 
                        />
                        &nbsp;
                        <span className="same-formating">{e.skill}</span>
                      </div>

                      <div className="col filter-star">
                        <span
                          className="iconify"
                          data-icon="ant-design:star-filled"
                        ></span>
                        &nbsp;
                        <span
                          className="iconify"
                          data-icon="ant-design:star-filled"
                        ></span>
                        &nbsp;
                        <span
                          className="iconify"
                          data-icon="ant-design:star-filled"
                        ></span>
                        &nbsp;
                        <span
                          className="iconify"
                          data-icon="ant-design:star-filled"
                        ></span>
                        &nbsp;
                        <span
                          className="iconify"
                          data-icon="ant-design:star-filled"
                        ></span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="filter-border-mobile"></div>
            <div className="filter-experience-mobile">
              <span className="same-formating">Experience</span>
              <div className="filter-option-mobile">
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    onChange={filterExpOption}
                    value="12 - 24 Months"
                    id="flexRadio1"
                    name="flexRadio"
                  />
                  <label className="form-check-label" htmlFor="flexRadio1">
                    12 - 24 Months
                  </label>{" "}
                  <br />
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    onChange={filterExpOption}
                    value="24 - 60 Months"
                    id="flexRadio2"
                    name="flexRadio"
                  />
                  <label className="form-check-label" htmlFor="flexRadio2">
                    24 - 60 Months
                  </label>{" "}
                  <br />
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    onChange={filterExpOption}
                    value="60 - 120 Months"
                    id="flexRadio3"
                    name="flexRadio"
                  />
                  <label className="form-check-label" htmlFor="flexRadio3">
                    60 - 120 Months
                  </label>{" "}
                  <br />
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    onChange={filterExpOption}
                    value="12 years & more"
                    id="flexRadio4"
                    name="flexRadio"
                  />
                  <label className="form-check-label" htmlFor="flexRadio4">
                    12 years & more
                  </label>{" "}
                  <br />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
          </div>
        </div>
      </div>
  );
}
