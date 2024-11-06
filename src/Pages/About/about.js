import React from 'react'
import './about.css'
import AboutUs_Banner from '../../Assets/aboutus_banner.jpg'
import About_Pic_One from '../../Assets/about_pic_1.png';
import About_Pic_two from '../../Assets/about_pic_2.png';
import Footer from '../../Component/Footer/footer';
import { Helmet } from 'react-helmet';
import NavBarNew from '../../Component/NavBar New/navBarNew';
export default function About() {
  return (
    <>
      <Helmet>
        <meta name="title"
          content="About - Skilltera" />
        <meta name="description"
          content="Skilltera seeks to address all of your priorities. Our goal is to significantly improve the candidate conversion ratio at the recruiter’s end. We attempt to bring down the hiring cycle time drastically by leveraging the power of professional networks to vet every candidate before we send them to you." />
      </Helmet>
      <NavBarNew />
      <div className="aboutus-banner">
        <img className="img-fluid-banner" src={AboutUs_Banner} alt='img-fluid'/>
        <h1 className="hero-text">About Us</h1>
      </div>
      <div className="section-one container-fluid">
        <div className="row">
          <div className="col-12 col-md-6 col-lg-6">
            <img src={About_Pic_One} className="img-fluid" alt='About_Pic_One'/>
          </div>
          <div className="col-12 col-md-6 col-lg-6">
            <h3 className="heading-one">For Experienced Talent and Companies to Win Together</h3>
            <p className="para-one">We believe that the hiring process is broken – both recruiters and job seekers are suffering from long hiring cycles. Open positions and long hiring cycles lead to revenue and opportunity losses.</p>
            <p className="para-one">We bring the promise of reducing the hiring cycle. We understand the core problem of technology hiring. Our knack for identifying the right talent and vetting their skills for our clients, helps to improve the effectiveness of your recruitment funnel.</p>
          </div>
        </div>
      </div>
      <div className="about-patch">
        <div className="col-md-12 text-center pb-3">
          <h2 className="pt-3">Get Optimal Job-Fitment. Every time</h2>
          <button type="button" className="btn btn-primary">Learn More</button>
        </div>
      </div>
      <div className="section-two container-fluid">
        <div className="row">
          <div className="col-12 col-md-6 col-lg-6">
            <h3 className="heading-two">What Makes Us Different</h3>
            <p className="para-two">We understand your priorities:</p>
            <ol className="order-two">
              <li>Speed up hiring process</li>
              <li>Improve candidate experience</li>
              <li>Reduce time to fill</li>
            </ol>
            <p className="para-two">Skilltera seeks to address all of your priorities. Our goal is to significantly improve the candidate conversion ratio at the recruiter’s end. We attempt to bring down the hiring cycle time drastically by leveraging the power of professional networks to vet every candidate before we send them to you.</p>
          </div>
          <div className="col-12 col-md-6 col-lg-6">
            <img src={About_Pic_two} className="img-fluid d-flex justify-content-center" alt='About_Pic_two'/>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}




