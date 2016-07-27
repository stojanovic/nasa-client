'use strict'

const rp = require('minimal-request-promise')

function formatDate(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function parseDate(date) {
  if (date && typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/g.test(date))
    return date

  if (date && date instanceof Date)
    return formatDate(date)

  return false
}

module.exports = class NASAClient {
  constructor(apiKey) {
    if (!apiKey)
      throw new Error(`NASA API key is required, if you don't https://api.nasa.gov/index.html#getting-started`)

    this.apiKey = apiKey
    this.apiUrl = 'https://api.nasa.gov/'
  }

  getAPOD(date) {
    let url = `${this.apiUrl}planetary/apod?api_key=${this.apiKey}`

    if (parseDate(date))
      url += `&date=${parseDate(date)}`

    return rp.get(url)
      .then(response => response.body)
  }

  getNeoFeed(startDate, endDate) {
    if (!startDate)
      throw new Error('Start date is required for NEO Feed.')

    if (!parseDate(startDate))
      throw new Error('Start date needs to be a string in YYYY-MM-DD format or JavaScript date object')

    if (endDate && !parseDate(endDate))
      throw new Error('End date needs to be a string in YYYY-MM-DD format or JavaScript date object') 

    let url = `${this.apiUrl}/neo/rest/v1/feed?api_key=${this.apiKey}&start_date=${parseDate(startDate)}`

    if (endDate)
      url += `&end_date=${parseDate(endDate)}`

    return rp.get(url)
      .then(response => response.body)
  }

  neoLookup(id) {
    if (!id)
      throw new Error('An ID is required for NEO lookup')

    return rp.get(`${this.apiUrl}/neo/rest/v1/neo/${id}?api_key=${this.apiKey}`)
      .then(response => response.body)
  }

  neoBrowse() {
    return rp.get(`${this.apiUrl}/neo/rest/v1/neo/browse?api_key=${this.apiKey}`)
      .then(response => response.body)
  }
}

