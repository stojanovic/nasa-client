'use strict'

const rp = require('minimal-request-promise')

module.exports = class NASAClient {
  constructor(apiKey) {
    if (!apiKey)
      throw new Error(`NASA API key is required, if you don't https://api.nasa.gov/index.html#getting-started`)

    this.apiKey = apiKey
    this.apiUrl = 'https://api.nasa.gov/'
  }

  getAPOD(date) {
    let url = `${this.apiUrl}planetary/apod?api_key=${this.apiKey}`

    if (date && typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/g.test(date))
      url += `&date=${date}`

    if (date && date instanceof Date)
      url += `&date=${date.getFullYear}-${date.getMonth() + 1}-${date.getDate()}`

    return rp.get(url)
      .then(response => response.body)
  }
}
