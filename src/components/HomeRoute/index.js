import './index.css'
import Header from '../Header'
import {Link} from 'react-router-dom'

const HomeRoute = props => {
  const onClickJobs = () => {
    const {history} = props
    history.replace('/jobs')
  }
  return (
    <div className="home-container">
      <Header />
      <div className="home-sub-container">
        <div className="home-find-jobs-desc-container">
          <h1 className="home-heading">Find The Job that Fits Your Life</h1>
          <p className="home-desc">
            Millions of people are searching for jobs, salary, information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs" className="link-item" >
            <button className="find-jobs-btn" onClick={onClickJobs}>
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomeRoute
