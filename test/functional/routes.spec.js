'use strict'

const { test, trait } = use('Test/Suite')('Routes')

trait('Test/ApiClient')

test('rota get /', async ({ assert, client }) => {
  const response = await client.get('/').end()
  response.assertStatus(200)
  response.assertJSONSubset({
    greeting: 'Hello world in JSON'
  })
})
