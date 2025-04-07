import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium-min";
import puppeteerCore from "puppeteer-core";
// import chromium from 'chrome-aws-lambda'
import { NextResponse } from "next/server";

// fetch a random user
async function fetchRandomEmail() {
  const response = await fetch("https://randomuser.me/api/");
  const data = await response.json();

  const user = data.results[0];
  const email = user.email;

  // Replace @example with @gmail.com
  const username = email.split("@")[0];
  return `${username}@gmail.com`;
}

export async function POST(request) {
  let browser;
  let page;

  const remoteExecutablePath =
    "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";

  const randomEmail = await fetchRandomEmail();

  try {
    if (browser) return browser;
    // This runs the browser process in the background
    // Condition for development in vercel
    if (process.env.NEXT_PUBLIC_VERCEL_ENVIRONMENT === "production") {
      browser = await puppeteerCore.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(remoteExecutablePath),
        headless: true,
      });
    } else {
      browser = await puppeteer.launch({
        headless: true,
      });
    }

    // use this if you want the browser to keep opening so you can see the voting in action
    // browser = await chromium.puppeteer.launch({
    //   args: chromium.args,
    //   defaultViewport: chromium.defaultViewport,
    //   executablePath: await chromium.executablePath,
    //   headless: chromium.headless
    // })

    page = await browser.newPage();

    await page.goto(
      "https://riceuniversity.co1.qualtrics.com/jfe/form/SV_bIq5iYJz8sws2yi",
      { waitUntil: "networkidle2", timeout: 6000000 }
    );

    // select the necessary elements
    const emailSelector = 'input[type="text"]';
    await page.waitForSelector(emailSelector);
    await page.type(emailSelector, randomEmail);

    const participantSelector = `[aria-labelledby="choice-display-QID2-19"]`;
    await page.click(participantSelector);

    const buttonSelector = "button";
    await page.waitForSelector(buttonSelector);
    await page.click(buttonSelector);

    // await page.close() // ✅ close the tab
    // await browser.close()

    return NextResponse.json({
      success: true,
      message: `Vote for The GUARDIAN submitted successfully with email ${randomEmail}`,
    });
  } catch (error) {
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});

    return NextResponse.json({
      success: false,
      message: `Failed to submit vote. Error: ${error.message}`,
    });
  }
}
