import puppeteer from 'puppeteer'
import { NextResponse } from 'next/server'

export async function POST (request) {
  try {
    const participant = 'emmanuel'

    // Launch Puppeteer browser
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    // Navigate to the Google form or voting page
    await page.goto(
      // 'https://docs.google.com/forms/d/e/1FAIpQLSewwQ1Qodt0RMuJTUvma5zwZ7Dt_OycbCzfGKPNHwIh4A9EJg/viewform',

      // test link
      'https://docs.google.com/forms/d/e/1FAIpQLSeWgS74Ad3brGCV6oxZtDcMqWR8R4V5bCNGpGDNzqglpTjYog/viewform',
      { waitUntil: 'networkidle2' }
    )

    // Search for the input with the matching aria-label and click on it
    // const participantSelector = `[aria-label="University Of Lagos: ${participant}"]`

    // test
    const participantSelector = `[aria-label="${participant}"]`
    await page.click(participantSelector)

    // Click the submit button based on role="button" and label="Submit"
    const submitButtonSelector = '[role="button"][aria-label="Submit"]'
    await page.click(submitButtonSelector)

    // Wait for the submission to complete
    await page.waitForNavigation()

    // Close the browser
    await browser.close()

    return NextResponse.json({
      success: true,
      message: `Vote for ${participant} submitted successfully!`
    })
  } catch (error) {
    console.error('Puppeteer error:', error)

    return NextResponse.json({
      success: false,
      message: `Failed to submit vote. Error: ${error.message}`
    })
  }
}
