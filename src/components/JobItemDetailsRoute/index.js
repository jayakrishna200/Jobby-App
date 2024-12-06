import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {FaShoppingBag} from 'react-icons/fa'
import {FaExternalLinkAlt} from 'react-icons/fa'
import SkillItem from '../SkillItem'
import SimilarJobItem from '../SimilarJobItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetailsRoute extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    currentJobDetails: {},
    lifeAtCompany: {},
    skills: [],
    similarJobs: [],
  }
  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const jobDetails = data.job_details
      const similarJobs = data.similar_jobs
      const {life_at_company, skills, ...currentJobDetails} = jobDetails
      const formattedCurrentJobDetails = {
        id: currentJobDetails.id,
        title: currentJobDetails.title,
        companyLogoUrl: currentJobDetails.company_logo_url,
        companyWebsiteUrl: currentJobDetails.company_website_url,
        employmentType: currentJobDetails.employment_type,
        jobDescription: currentJobDetails.job_description,
        location: currentJobDetails.location,
        packagePerAnnum: currentJobDetails.package_per_annum,
        rating: currentJobDetails.rating,
      }
      const lifeAtCompany = {
        description: life_at_company.description,
        imageUrl: life_at_company.image_url,
      }
      const formattedSkills = skills.map(skill => ({
        name: skill.name,
        imageUrl: skill.image_url,
      }))
      const formattedSimilarJobs = similarJobs.map(eachJob => ({
        id: eachJob.id,
        title: eachJob.title,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
      }))

      this.setState({
        currentJobDetails: formattedCurrentJobDetails,
        lifeAtCompany,
        skills: formattedSkills,
        similarJobs: formattedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }
  /*Retry Buttons */
  onClickRetryJobItemDetails = () => {
    this.getJobItemDetails()
  }

  /*Job Item Details Sections */

  jobItemDetailsLoadingView = () => {
    return (
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  }

  jobItemDetailsFailureView = () => {
    return (
      <div className="job-details-failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="job-details-failure-img"
        />
        <h1 className="job-details-failure-head">Oops! Something Went Wrong</h1>
        <p className="job-details-failure-desc">
          We cannot seem to find the page you are looking for.
        </p>
        <button className="retry-btn" onClick={this.onClickRetryJobItemDetails}>
          Retry
        </button>
      </div>
    )
  }

  jobItemDetailsSuccessView = () => {
    const {currentJobDetails, lifeAtCompany, skills, similarJobs} = this.state
    console.log(currentJobDetails)
    const {
      id,
      title,
      companyWebsiteUrl,
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
    } = currentJobDetails
    const {description, imageUrl} = lifeAtCompany
    return (
      <section className="job-item-section">
        <div className="job-details-item">
          <div className="job-details-logo-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo-img"
            />
            <div className="job-name-container">
              <h1 className="job-details-title">{title} </h1>
              <div className="rating-container">
                <FaStar className="star" />
                <p className="job-details-rating">{rating} </p>
              </div>
            </div>
          </div>

          <div className="job-details-type-container">
            <div className="job-type-container">
              <div className="location-container">
                <MdLocationOn className="location-icon" />
                <p className="location">{location}</p>
              </div>
              <div className="jobs-container">
                <FaShoppingBag className="job-details-jobs-icon" />
                <p className="location">{employmentType} </p>
              </div>
            </div>
            <p className="package">{packagePerAnnum} </p>
          </div>
          <hr className="hr-line" />
          <div className="job-descp-container">
            <h1 className="job-item-desc-head">Description</h1>
            <a href={companyWebsiteUrl} target="_blank">
              <button className="link-button">
                <p className="visit">Visit</p>
                <FaExternalLinkAlt className="link-element" />
              </button>
            </a>
          </div>
          <p className="job-description">{jobDescription} </p>
          <h1 className="job-item-desc-head">Skills</h1>
          <ul className="skills-list-container">
            {skills.map(eachSkill => (
              <SkillItem key={eachSkill.name} skillItem={eachSkill} />
            ))}
          </ul>
          <div className="life-at-company-container">
            <div>
              <h1 className="job-item-desc-head">Life At Company</h1>
              <p className="job-description">{description} </p>
            </div>
            <img src={imageUrl} alt="life at company" className="company-img" />
          </div>
        </div>
        <h1 className="job-item-desc-head">Similar Jobs</h1>
        <ul className="similar-jobs-list-container">
          {similarJobs.map(eachJob => (
            <SimilarJobItem key={eachJob.id} similarJobItem={eachJob} />
          ))}
        </ul>
      </section>
    )
  }

  renderJobItemDetailsSection = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.jobItemDetailsLoadingView()
        break
      case apiStatusConstants.success:
        return this.jobItemDetailsSuccessView()
        break
      case apiStatusConstants.failure:
        return this.jobItemDetailsFailureView()
        break
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-item-main-bg">
        <Header />
        <main className="job-item-main-container">
          {this.renderJobItemDetailsSection()}
        </main>
      </div>
    )
  }
}

export default JobItemDetailsRoute
