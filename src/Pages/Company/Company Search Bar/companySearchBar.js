import React from 'react'
import './companySearchBar.css'
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { inputSearchBar } from '../../../Redux/Reducer/searchBarSlice';

export default function CompanySearchBar() {
    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        formState: { },
    } = useForm();

    const jobRoleSelection = useSelector(
        (state) => state.jobRole
    );

    const onSubmit = (data) => {
        dispatch(inputSearchBar(data.searchJobRole))
    }


    return (
            <div className="form-group has-search">
                <span className="fa fa-search form-control-feedback"></span>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-group mb-3" style={{ 'zIndex': '1' }}>

                        <input type="text" list="jobRoledata" className="form-control"
                            placeholder="Select Job Role" aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            {...register("searchJobRole")}
                        />
                        <datalist id="jobRoledata">
                            {jobRoleSelection.jobRoleList.data.map((d, i) => {
                                return (
                                
                                        <option key={i} value={d.role} />
                                    
                                );

                            })}
                        </datalist>
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="submit" style={{ backgroundColor: 'white' }}>Search</button>
                        </div>

                    </div>
                </form>



            </div>
    );
}