import { readFileSync } from 'fs'
import { DaimsClient } from '../dist/index.js'

const API_KEY = 'REDACTED'

const client = new DaimsClient({ apiKey: API_KEY })

async function runTests() {
  console.log('=== Testing DAIMS API ===\n')

  let cardKey = null

  // Test 1: Search with keyword
  console.log("1. Searching by keyword 'cinematic'...")
  try {
    const searchResult = await client.search({
      card_type: 'create',
      search_type: 'keyword',
      value: 'cinematic'
    })
    console.log('✓ Search successful!')
    console.log(`  - Count: ${searchResult.data.count}`)
    if (searchResult.data.items.length > 0) {
      cardKey = searchResult.data.items[0].metadata.key
      console.log(`  - First item key: ${cardKey}`)
    }
  } catch (error) {
    console.error('✗ Search failed:', error.message)
    if (error.status) console.error(`  - Status: ${error.status}`)
    if (error.responseBody) console.error(`  - Response:`, error.responseBody)
  }

  // Test 2: Search with style using image file as base64
  console.log('\n2. Searching by style with image file...')
  try {
    const imageBuffer = readFileSync(new URL('./illustration-DSYSxJLi.png', import.meta.url).pathname)
    const base64Image = imageBuffer.toString('base64')
    const dataUrl = `data:image/png;base64,${base64Image}`

    const searchResult = await client.search({
      card_type: 'create',
      search_type: 'style',
      value: dataUrl
    })
    console.log('✓ Search successful!')
    console.log(`  - Count: ${searchResult.data.count}`)
  } catch (error) {
    console.error('✗ Search failed:', error.message)
    if (error.status) console.error(`  - Status: ${error.status}`)
    if (error.responseBody) console.error(`  - Response:`, error.responseBody)
  }

  if (cardKey) {
    console.log(`\n3. Getting prompt detail with key: ${cardKey}`)
    try {
      const promptResult = await client.getPrompt(cardKey)
      console.log('✓ Get prompt successful!')
      console.log(
        '  Prompt:',
        promptResult.prompt?.slice(0, 200) + (promptResult.prompt?.length > 200 ? '...' : '')
      )
    } catch (error) {
      console.error('✗ Get prompt failed:', error.message)
      if (error.status) console.error(`  - Status: ${error.status}`)
      if (error.responseBody) console.error(`  - Response:`, error.responseBody)
    }
  }

  console.log('\n=== Tests completed ===')
}

runTests()
