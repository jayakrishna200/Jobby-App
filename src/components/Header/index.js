import './index.css'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {MdHome} from 'react-icons/md'
import {FaShoppingBag} from 'react-icons/fa'
import {FiLogOut} from 'react-icons/fi'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    history.replace('/login')
    Cookies.remove('jwt_token')
  }
  return (
    <ul className="header-ul-item">
      <li className="header-list" >
        <nav className="header-item">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="header-logo"
            />
          </Link>
          <div className="laptop-header-container">
            <Link to="/" className="link-item">
              <p className="laptop-home">Home</p>
            </Link>
            <Link to="/jobs" className="link-item">
              <p className="laptop-jobs">Jobs</p>
            </Link>
          </div>
          <div className="laptop-btn-container">
            <button className="laptop-logout-btn" onClick={onClickLogout}>
              Logout
            </button>
          </div>

          <div className="header-mobile-details-container">
            <li>
              <nav>
                <Link to="/" className="link-item">
                  <button className="mobile-header-home">
                    <MdHome className="home-icon" />
                  </button>
                </Link>
              </nav>
            </li>
            <li>
              <nav>
                <Link to="/jobs" className="link-item">
                  <button className="mobile-header-home">
                    <FaShoppingBag className="jobs-icon" />
                  </button>
                </Link>
              </nav>
            </li>
            <li>
              <nav>
                <button className="mobile-header-home" onClick={onClickLogout}>
                  <FiLogOut className="jobs-icon" />
                </button>
              </nav>
            </li>
          </div>
        </nav>
      </li>
    </ul>
  )
}

export default withRouter(Header)
