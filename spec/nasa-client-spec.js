/* global describe, it, expect */
'use strict'

const NASAClient = require('../index')
const https = require('https')

describe('NASA API Client', () => {
  it('should export a class', () => {
    const nasa = new NASAClient('token')
    expect(typeof NASAClient).toBe('function')
    expect(nasa instanceof NASAClient).toBeTruthy()
  })

  it('should throw an error if API key is not provided', () => {
    expect(() => new NASAClient()).toThrowError(`NASA API key is required, if you don't https://api.nasa.gov/index.html#getting-started`)
  })

  it('should fail if invalid token is used', () => {
    const nasa = new NASAClient('invalid-token')
    nasa.getAPOD()
      .catch(err => expect(err.body.error.code).toBe('API_KEY_INVALID'))

    https.request.pipe(() => this.respond('403', 'Forbidden', {
      error: {
        code: 'API_KEY_INVALID',
        message: 'An invalid api_key was supplied. Get one at https://api.nasa.gov'
      }
    }))
  })

  it('should fail if limit is exceeded', () => {
    const nasa = new NASAClient('token')
    nasa.getAPOD()
      .catch(err => expect(err.body.error.code).toBe('OVER_RATE_LIMIT'))

    https.request.pipe(() => this.respond('403', 'Forbidden', {
      error: {
        code: 'OVER_RATE_LIMIT',
        message: 'You have exceeded your rate limit. Try again later or contact us at https://api.nasa.gov/contact/ for assistance'
      }
    }))
  })

  describe('Astronomy Picture of the Day', () => {
    it('should return APOD', () => {
      const nasa = new NASAClient('token')
      nasa.getAPOD()
        .then(result => expect(result.url).toBe('http://apod.nasa.gov/apod/image/1607/MagCloudsDeep_BeletskyEtAl_960.jpg'))

      https.request.pipe(() => this.respond('200', 'OK', {
        copyright: 'Yuri Beletsky',
        date: '2016-07-25',
        explanation: 'Did the two most famous satellite galaxies of our Milky Way Galaxy once collide? No one knows for sure, but a detailed inspection of deep images like that featured here give an indication that they have. Pictured, the Large Magellanic Cloud (LMC) is on the top left and the Small Magellanic Cloud (SMC) is on the bottom right.  The surrounding field is monochrome color-inverted to highlight faint star streams, shown in gray. Perhaps surprisingly, the featured research-grade image was compiled with small telescopes to cover the large angular field -- nearly 40 degrees across.  Much of the faint nebulosity is Galactic Cirrus clouds of thin dust in our own Galaxy, but a faint stream of stars does appear to be extending from the SMC toward the LMC. Also, stars surrounding the LMC appear asymmetrically distributed, indicating in simulations that they could well have been pulled off gravitationally in one or more collisions.  Both the LMC and the SMC are visible to the unaided eye in southern skies. Future telescopic observations and computer simulations are sure to continue in a continuing effort to better understand the history of our Milky Way and its surroundings.',
        hdurl: 'http://apod.nasa.gov/apod/image/1607/MagCloudsDeep_BeletskyEtAl_1800.jpg',
        media_type: 'image',
        service_version: 'v1',
        title: 'Deep Magellanic Clouds Image Indicates Collisions',
        url: 'http://apod.nasa.gov/apod/image/1607/MagCloudsDeep_BeletskyEtAl_960.jpg'
      }))
    })
  })
})

