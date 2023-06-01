import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'
import './index.css'

const status = {
  pending: 'PENDING',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class CowinDashboard extends Component {
  state = {apiData: {}, apiStatus: status.initial}

  componentDidMount() {
    this.getCowinData()
  }

  getCowinData = async () => {
    this.setState({apiStatus: status.pending})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    console.log(response.ok)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }
      this.setState({apiStatus: status.success, apiData: updatedData})
    } else {
      this.setState({apiStatus: status.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  unSuccessful = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure logo"
        className="failure-logo"
      />
      <h1 className="failure-msg">Something went wrong</h1>
    </div>
  )

  success = () => {
    const {apiData} = this.state
    const {
      last7DaysVaccination,
      vaccinationByGender,
      vaccinationByAge,
    } = apiData
    return (
      <>
        <VaccinationCoverage VaccinationData={last7DaysVaccination} />
        <VaccinationByGender vaccinationByGenderData={vaccinationByGender} />
        <VaccinationByAge vaccinationByAgeData={vaccinationByAge} />
      </>
    )
  }

  renderSwitch = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case status.success:
        return this.success()
      case status.failure:
        return this.unSuccessful()
      case status.pending:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="container">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo"
          />
          <h1 className="logo-head">Co-WIN</h1>
        </div>
        <h1 className="main-head">CoWIN Vaccination in India</h1>
        <div className="main-container">{this.renderSwitch()}</div>
      </div>
    )
  }
}

export default CowinDashboard
