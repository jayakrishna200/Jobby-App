import './index.css'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {FaShoppingBag} from 'react-icons/fa'

const SimilarJobItem = props => {
  const {similarJobItem} = props
  const {
    id,
    title,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
  } = similarJobItem
  return (
    <div className="job-details-item">
      <div className="job-details-logo-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
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
      <h1 className="job-desc-head">Description</h1>
      <p className="job-description">{jobDescription} </p>
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
      </div>
    </div>
  )
}

export default SimilarJobItem
