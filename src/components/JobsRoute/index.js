import './index.css'
import {Component} from 'react'
import Header from '../Header'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import JobDetailsCard from '../JobDetailsCard'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobsRoute extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    profileDetails: {},
    empTypeInput: [],
    minimumPackage: '',
    searchInput: '',
    jobDetailsList: [],
    jobDetailsApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfile()
    this.getJobDetails()
  }
  getProfile = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/profile'
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
      const profileDetails = data.profile_details
      const formattedProfileDetails = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profileDetails: formattedProfileDetails,
        apiStatus: apiStatusConstants.success,
      })
    }else{
      this.setState({apiStatus:apiStatusConstants.failure})
    }
  }

  getJobDetails = async () => {
    this.setState({jobDetailsApiStatus: apiStatusConstants.inProgress})
    const {empTypeInput, searchInput, minimumPackage} = this.state
    console.log(empTypeInput, searchInput, minimumPackage)
    const empType = empTypeInput.join(',')
    console.log(empType)
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${empType}&minimum_package=${minimumPackage}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const {jobs} = data
      const jobsList = jobs.map(eachJob => ({
        id: eachJob.id,
        title: eachJob.title,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
      }))
      this.setState({
        jobDetailsList: jobsList,
        jobDetailsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobDetailsApiStatus: apiStatusConstants.failure})
    }
  }
  /*Retry Buttons*/
  onClickRetry = () => {
    this.getProfile()
  }
  onClickRetryJobDetails = () => {
    this.getJobDetails()
  }

  renderJobProfileFailureView = () => {
    return (
      <div className="profile-failure-container">
        <button
          className="retry-btn"
          type="button"
          role="button"
          onClick={this.onClickRetry}
        >
          Retry
        </button>
      </div>
    )
  }

  renderLoadingView = () => {
    return (
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  }

  renderJobProfile = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="jobs-profile-container">
        <img src={profileImageUrl} className="profile-img" alt="profile" />
        <h1 className="profile-name">{name} </h1>
        <p className="profile-bio">{shortBio} </p>
      </div>
    )
  }

  renderJobProfileResult = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobProfile()
        break
      case apiStatusConstants.failure:
        return this.renderJobProfileFailureView()
        break
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
        break
      default:
        return null
    }
  }
  onChangeEmpType = event => {
    const {empTypeInput} = this.state
    const {value} = event.target
    if (empTypeInput.includes(value)) {
      const newEmpTypeList = empTypeInput.filter(eachItem => eachItem !== value)
      this.setState({empTypeInput: newEmpTypeList}, this.getJobDetails)
    } else {
      this.setState(
        {empTypeInput: [...empTypeInput, value]},
        this.getJobDetails,
      )
    }
  }
  onChangeSalaryValue = event => {
    this.setState({minimumPackage: event.target.value}, this.getJobDetails)
  }
  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }
  onClickSearch = () => {
    this.getJobDetails()
  }
  renderSalaryRangeSection = () => {
    return (
      <ul className="emp-type-list">
        {salaryRangesList.map(eachItem => (
          <li className="emp-type-item" key={eachItem.salaryRangeId}>
            <input
              type="radio"
              name="salary"
              id={eachItem.salaryRangeId}
              className="checkbox"
              value={eachItem.salaryRangeId}
              onChange={this.onChangeSalaryValue}
            />
            <label htmlFor={eachItem.salaryRangeId} className="label">
              {eachItem.label}
            </label>
          </li>
        ))}
      </ul>
    )
  }

  renderEmploymentTypeSection = () => {
    return (
      <ul className="emp-type-list">
        {employmentTypesList.map(eachItem => (
          <li key={eachItem.employmentTypeId} className="emp-type-item">
            <input
              type="checkbox"
              id={eachItem.employmentTypeId}
              value={eachItem.employmentTypeId}
              className="checkbox"
              onChange={this.onChangeEmpType}
            />
            <label htmlFor={eachItem.employmentTypeId} className="label">
              {eachItem.label}
            </label>
          </li>
        ))}
      </ul>
    )
  }
  /* job Details Section*/
  renderJobDetailsLoadingView = () => {
    return (
      <div className="job-details-loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  }
  renderJobDetailsFailureView = () => {
    return (
      <div className="job-details-failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="job-details-failure-img"
        />
        <h1 className="job-details-failure-head">Oops! Something Went Wrong</h1>
        <p className="job-details-failure-desc">
          We cannot seem to find the page you are looking for
        </p>
        <button
          className="retry-btn"
          type="button"
          onClick={this.onClickRetryJobDetails}
          role="button"
        >
          Retry
        </button>
      </div>
    )
  }

  renderJobDetailsSuccessView = () => {
    const {jobDetailsList} = this.state
    const len = jobDetailsList.length
    if (len !== 0) {
      return (
        <ul className="job-details-list-container">
          {jobDetailsList.map(eachJob => (
            <JobDetailsCard key={eachJob.id} eachJobDetails={eachJob} />
          ))}
        </ul>
      )
    } else {
      return (
        <div className="job-details-failure-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="job-details-failure-img"
          />
          <h1 className="job-details-failure-head">No Jobs Found</h1>
          <p className="job-details-failure-desc">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      )
    }
  }

  renderJobDetailsSection = () => {
    const {jobDetailsApiStatus} = this.state
    switch (jobDetailsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderJobDetailsLoadingView()
        break
      case apiStatusConstants.success:
        return this.renderJobDetailsSuccessView()
        break
      case apiStatusConstants.failure:
        return this.renderJobDetailsFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <main className="jobs-main">
        <Header />
        <section className="jobs-main-container">
          <div className="jobs-profile-main-container">
            <div className="mobile-jobs-search-container">
              <input
                type="search"
                placeholder="Search"
                className="mobile-jobs-input-element"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
              <button
                className="search-icon-container"
                onClick={this.onClickSearch}
                type="button"
                data-testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobProfileResult()}
            <hr className="hr-line" />
            <div className="employment-type-container">
              <h1 className="emp-type-head">Type of Employment</h1>
              {this.renderEmploymentTypeSection()}
            </div>
            <hr className="hr-line" />
            <div>
              <h1 className="emp-type-head">Salary Range</h1>
              {this.renderSalaryRangeSection()}
            </div>
          </div>

          <div className="job-details-main-bg">
            <div className="laptop-jobs-search-container">
              <input
                type="search"
                placeholder="Search"
                className="laptop-jobs-input-element"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-icon-container"
                onClick={this.onClickSearch}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            /*Rendering Job Detsils Section*/
            {this.renderJobDetailsSection()}
          </div>
        </section>
      </main>
    )
  }
}

export default JobsRoute
