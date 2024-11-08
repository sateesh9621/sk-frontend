import axios from "axios";
import React, { useEffect, useState } from "react";
import ApiConstants from "../../../Services/apiconstants";
import ShowMoreText from "react-show-more-text";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import "./allCandidates.css";
import { Interceptor } from "../../../ErrorStatus/errorStatus"
export default function AllCandidates() {
  const [values, setValues] = useState({
    candidateData: {},
  });

  const [columnsList, setColumnsList] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [pending, setPending] = useState(true);
  const searchItem = useSelector((state) => state.searchBar);

  const userData = () => {
    const admin_loggedin_user_data = JSON.parse(sessionStorage.getItem("ADMIN"))
    const token = admin_loggedin_user_data.token

    axios
      .get(ApiConstants.ADMIN_CANDIDATE_DATA, {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          token: token,
          "Access-Control-Allow-Origin": true,
          "Access-Control-Allow-Methods": "GET, POST, PATCH",
        }
      })
      .then((response) => {
        var dataTest = [];
        for (var i = 0; i < Object.keys(response.data.candidate).length; i++) {
          if (Object.keys(response.data.candidate[i]).length > 8) {
            dataTest.push(response.data.candidate[i]);
          }
        }
        setValues({
          ...values,
          candidateData: dataTest,
        });
      })
      .catch((error) => {

        if ((error.response.status >= 404 && error.response.status <= 499) || (error.response.status >= 502 && error.response.status <= 599)) {
          Interceptor(error.response.status)
        }
      })
  }



  useEffect(() => {
    userData();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setColumnsList([
        {
          name: "ID",
          cell: (row, index) => index + 1,
        },
        {
          name: "Candidate Name",
          selector: (row) => row.fullname,
        },
        {
          name: "Candidate Email Id",
          selector: (row) => row.email,
        },
        {
          name: "Overall Exprience (Years)",
          selector: (row) => row.overallExperience,
        },
        {
          name: "Current Role",
          selector: (row) => row.currentRole,
        },
        // {
        //   name: "Current Client/admin",
        //   selector: (row) => row.currentadmin,
        // },
        // {
        //   name: "Companies/Client worked with",
        //   selector: (row) => row.previousEmployers,
        // },
        // {
        //   name: "Available In (Weeks)",
        //   selector: (row) => row.timeToJoin,
        // },
        {
          name: "Key Skill Areas",
          selector: (row) => row.knownTechnologies,
        },
        {
          name: "Brief about experience/ skills / key aspects of projects",
          cell: (row) => (
            <ShowMoreText
              lines={1}
              more="Show more"
              less="Show less"
              className="content-css"
              anchorClass="my-anchor-css-class"
              onClick={executeOnClick}
              expanded={isExpanded}
              width={280}
              truncatedEndingComponent={"... "}
            >
              {row.experienceDescription}
            </ShowMoreText>
          ),
        },
        {
          name: "Looking for",
          selector: (row) => row.typeOfJob,
        },
        {
          name: "Expected Salary per year / Rate per hour (C2H/C2C)",
          selector: (row) => row.expectedRateC2CorC2H,
        },
        // {
        //   name: "Open to relocation",
        //   selector: (row) => (row.relocation ? "Yes" : "No"),
        // },
        {
          name: "Resume",
          cell: row => (row.resumeLink ? <a href={row.resumeLink} target="_blank">Download</a> : ""),
          button: true,
        },
      ]);
      setPending(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [])
  const executeOnClick = () => {
    setIsExpanded(!isExpanded);
  };

    return (
      
        <div className="table myTables1">
          {Object.keys(values.candidateData).length && (
            <DataTable
              title='All Candidates'
              striped
              responsive
              pagination
              paginationRowsPerPageOptions={[2, 3, 5]}
              paginationPerPage={5}
              highlightOnHover
              progressPending={pending}
              columns={columnsList}
              data={values.candidateData.filter((item) => {
                if (searchItem.initialValue === "") {
                  return item;
                } else if (
                  item.email.toLowerCase().includes(searchItem.initialValue.toLowerCase())
                ) {
                  return item;
                }
              })}
            />
          )}

        </div>
      
    );
  }
  