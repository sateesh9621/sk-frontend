import React, { useState } from 'react';
import './companySideFilter.css'
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { changeSkillSideFilterDataCompany } from '../../../Redux/Reducer/skillSideFilterDataCompanySlice';



export default function CompanySideFilter() {

    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { },
    } = useForm();

    const skillSelection = useSelector(
        (state) => state.skills
    );

    const [addSkill, SetAddSkill] = useState([{}]);
    const [skillQuery] = useState('');
    const [finalSkill, SetFinalSkill] = useState([{}]);
    const [minExp, SetMinExp] = useState(0);
    const [maxExp, SetMaxExp] = useState(0);


    const handleRemoveItem = (i) => {
        SetAddSkill(addSkill.filter(item => item.skill !== i));
    };

    const filterExpOption = (e) => {
        if (e.target.value == '2 - 4 Years') {
            SetMinExp(2);
            SetMaxExp(4)
        }
        if (e.target.value == '4 - 8 Years') {
            SetMinExp(4);
            SetMaxExp(8)
        }
        if (e.target.value == '8 - 10 Years') {
            SetMinExp(8);
            SetMaxExp(10)
        }
        if (e.target.value == '10 - 15 Years') {
            SetMinExp(10);
            SetMaxExp(15);
        }
        if (e.target.value == '15 Years & more') {
            SetMinExp(0);
            SetMaxExp(15);
        }


    }

    const ratingChanged = (rate, skill) => {
        SetFinalSkill(finalSkill => [...finalSkill, { skill: skill, rating: rate }])
    }

    const onSubmit = (data) => {
        const newElement = data.searchSkill
        SetAddSkill(addSkill => [...addSkill, { skill: newElement, rating: 0 }])
    }
    const showResult = () => {
        const finalFilterArray = [finalSkill.slice(1, finalSkill.length), minExp, maxExp]
        dispatch(changeSkillSideFilterDataCompany(finalFilterArray))
    }



    return (
        <>
            <div className='filter-box'>
                <div className='row'>
                    <div className='col filter'>
                        <span className='same-formating'>Filter</span>
                    </div>
                    <div className='col clear-all d-flex justify-content-end'>
                        <span>Clear All</span>
                    </div>
                </div>

                <div className='filter-border'></div>

                <div className="filter-search-box">
                    <div className="form-group has-search-for-filter">
                        <span className="fa fa-search form-control-feedback-for-filter"></span>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="input-group mb-3">

                                <input type="text" list="data" className="form-control"
                                    placeholder="Search" aria-label="Recipient's username"
                                    aria-describedby="basic-addon2"
                                    {...register("searchSkill")}
                                    required />
                                <datalist id="data">
                                    {skillSelection.skillList.data.length != 1 && skillSelection.skillList.data.slice(1, skillSelection.skillList.data.length).map((item, key) => {
                                        if (item.skill.toUpperCase().includes(skillQuery.toUpperCase())) {
                                            return (
                                                <>
                                                    <option key={key} value={item.skill} />
                                                </>
                                            );
                                        }

                                    })}
                                </datalist>
                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary" type="submit">Add</button>
                                </div>

                            </div>
                        </form>


                    </div>
                </div>
                <div className='filter-skill'>
                    {
                        addSkill.length == 1
                            ? <span className='d-flex justify-content-center' style={{ textAlign: 'center' }}>No Skill is found</span>
                            : addSkill.slice(1, addSkill.length).map((e, i) => {
                                return (
                                    <div className='row'>
                                        <div className='col filter-searched-skill'>
                                            <i className="fa fa-times" onClick={() => handleRemoveItem(e.skill)} style={{ 'cursor': 'pointer' }} />&nbsp;
                                            <span className='same-formating'>{e.skill}</span>

                                        </div>

                                        {/* <div className='col filter-star'>
                                            <ReactStars onChange={(rating) => ratingChanged(rating, e.skill)} fillColor='#4B2DFF' size='23px' value={e.rating} />
                                        </div> */}
                                    </div>
                                );
                            })
                    }
                </div>

                <div className='filter-border'></div>

                <div className='filter-experience'>
                    <span className='same-formating'>Experience</span>
                    <div className='filter-option'>
                        <div className="form-check">
                            <input type="radio"
                                className="form-check-input"
                                onChange={filterExpOption}
                                value="2 - 4 Years"
                                id="flexRadio1"
                                name="flexRadio"
                            />
                            <label className="form-check-label" for="flexRadio1">

                                2 - 4 Years
                            </label> <br />
                        </div>
                        <div className='form-check'>
                            <input type="radio"
                                className="form-check-input"
                                onChange={filterExpOption}
                                value="4 - 8 Years"
                                id="flexRadio2"
                                name="flexRadio"
                            />
                            <label className="form-check-label" for="flexRadio2">

                                4 - 8 Years
                            </label> <br />
                        </div>
                        <div className='form-check'>
                            <input type="radio"
                                className="form-check-input"
                                onChange={filterExpOption}
                                value="8 - 10 Years"
                                id="flexRadio3"
                                name="flexRadio"
                            />
                            <label className="form-check-label" for="flexRadio3">

                                8 - 10 Years
                            </label> <br />
                        </div>
                        <div className='form-check'>
                            <input type="radio"
                                className="form-check-input"
                                onChange={filterExpOption}
                                value="10 - 15 Years"
                                id="flexRadio4"
                                name="flexRadio"
                            />
                            <label className="form-check-label" for="flexRadio4">

                                10 - 15 Years
                            </label> <br />
                        </div>
                        <div className='form-check'>
                            <input type="radio"
                                className="form-check-input"
                                onChange={filterExpOption}
                                value="15 years & more"
                                id="flexRadio5"
                                name="flexRadio"
                            />
                            <label className="form-check-label" for="flexRadio5">

                                15 Years & more
                            </label> <br />
                        </div>
                    </div>
                </div>

                <div className='filter-border'></div>

                <div className='filter-button'>
                    <button type='submit' className='btn show-result' onClick={showResult}>Show Results</button>
                </div>
            </div>
        </>
    );
}