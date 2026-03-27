import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { DaimsClient } from '../dist/index.js'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env'), override: true })

const API_KEY = process.argv[2] || process.env.DAIMS_API_KEY
const IMAGE_PATH = process.argv[3] || join(__dirname, 'test.png')
const API_BASE_URL = process.env.API_BASE_URL
const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL

if (!API_KEY) {
  console.error('Usage: node tester.js <api_key> [image_path]')
  process.exit(1)
}

const clientOptions = { apiKey: API_KEY }
if (API_BASE_URL) {
  clientOptions.apiBaseUrl = API_BASE_URL
  console.log(`Using custom API base URL: ${API_BASE_URL}`)
}
if (IMAGE_BASE_URL) {
  clientOptions.imageBaseUrl = IMAGE_BASE_URL
  console.log(`Using custom image base URL: ${IMAGE_BASE_URL}`)
}

const client = new DaimsClient(clientOptions)

async function runTests() {
  console.log('=== Testing DAIMS API ===\n')

  let editCardKey = null
  let editPrompt = null
  let styleCardKey = null

  // Test 1: Search with keyword (edit card type)
  console.log("1. Searching by keyword 'cinematic' (edit card type)...")
  try {
    const searchResult = await client.search({
      card_type: 'edit',
      search_type: 'keyword',
      value: 'cinematic'
    })
    console.log('✓ Search successful!')
    console.log(`  - Count: ${searchResult.data.count}`)
    if (searchResult.data.items.length > 0) {
      editCardKey = searchResult.data.items[0].metadata.key
      console.log(`  - First item key: ${editCardKey}`)
    }
  } catch (error) {
    console.error('✗ Search failed:', error.message)
    if (error.status) console.error(`  - Status: ${error.status}`)
    if (error.responseBody) console.error(`  - Response:`, error.responseBody)
  }

  // Test 2: Search with style using image file as base64
  console.log(`\n2. Searching by style with image file: ${IMAGE_PATH}`)
  try {
    const imageBuffer = readFileSync(IMAGE_PATH)
    const base64Image = imageBuffer.toString('base64')
    const dataUrl = `data:image/png;base64,${base64Image}`

    const searchResult = await client.search({
      card_type: 'create',
      search_type: 'style',
      value: dataUrl
    })
    console.log('✓ Search successful!')
    console.log(`  - Count: ${searchResult.data.count}`)
    if (searchResult.data.items.length > 0) {
      styleCardKey = searchResult.data.items[0].metadata.key
      console.log(`  - First item key: ${styleCardKey}`)
    }
  } catch (error) {
    console.error('✗ Search failed:', error.message)
    if (error.status) console.error(`  - Status: ${error.status}`)
    if (error.responseBody) console.error(`  - Response:`, error.responseBody)
  }

  if (editCardKey) {
    console.log(`\n3. Getting prompt detail with key: ${editCardKey}`)
    try {
      const promptResult = await client.getPrompt(editCardKey)
      console.log('✓ Get prompt successful!')
      editPrompt = promptResult.prompt
      console.log('  Prompt:', editPrompt?.slice(0, 200) + (editPrompt?.length > 200 ? '...' : ''))
    } catch (error) {
      console.error('✗ Get prompt failed:', error.message)
      if (error.status) console.error(`  - Status: ${error.status}`)
      if (error.responseBody) console.error(`  - Response:`, error.responseBody)
    }

    console.log(`\n4. Testing generatePrompt with key: ${styleCardKey}`)
    try {
      const generateResult = await client.generatePrompt({
        skey: styleCardKey
      })
      console.log('✓ Generate prompt successful!')
      console.log('  Generated key:', generateResult.data)
    } catch (error) {
      console.error('✗ Generate prompt failed:', error.message)
      if (error.status) console.error(`  - Status: ${error.status}`)
      if (error.responseBody) console.error(`  - Response:`, error.responseBody)
    }

    console.log(`\n5. Testing generatePrompt with image (origin) and apply_prompt`)
    try {
      const imageBuffer = readFileSync(IMAGE_PATH)
      const base64Image = imageBuffer.toString('base64')
      const dataUrl = `data:image/png;base64,${base64Image}`

      const generateResult = await client.generatePrompt({
        skey: editCardKey,
        origin: dataUrl,
        apply_prompt: editPrompt
      })
      console.log('✓ Generate prompt with image and apply_prompt successful!')
      console.log('  Generated key:', generateResult.data)
    } catch (error) {
      console.error('✗ Generate prompt with image failed:', error.message)
      if (error.status) console.error(`  - Status: ${error.status}`)
      if (error.responseBody) console.error(`  - Response:`, error.responseBody)
    }
  }

  console.log('\n=== Tests completed ===')
}

runTests()
