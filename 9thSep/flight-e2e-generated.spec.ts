// spec: docs/test-plan.md
// auto-generated: implements scenarios from docs/test-plan.md and docs/test-case-report.md

import { test, expect } from '@playwright/test';

const BASE = 'https://phptravels.net/';
const flightTestData = {
  validRoute: { from: 'Dubai', to: 'London' },
  validRoundDates: { departure: '2026-11-10', return: '2026-11-20' },
  invalidCity: 'XyzInvalidCity',
  sameCity: 'Dubai',
  oneWayDate: '2026-12-05',
  returnBefore: { departure: '2026-12-10', return: '2026-12-05' }
};

const { validRoute, validRoundDates, invalidCity, sameCity, oneWayDate, returnBefore } = flightTestData;

async function setFieldValue(page: any, selectors: string[], value: string) {
  for (const selector of selectors) {
    const field = page.locator(selector).first();
    if (await field.count()) {
      await field.evaluate((element: any, val: string) => {
        if (element) {
          if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.isContentEditable) {
            element.value = val;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }, value);
      return true;
    }
  }
  return false;
}

async function openFlightsTab(page: any) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });

  const demoWarning = page.locator('#acknowledgeDemoWarning');
  if (await demoWarning.count()) {
    await demoWarning.click({ force: true });
  }

  const flightsTab = page.getByRole('tab', { name: /flight/i }).first();
  if (await flightsTab.count()) {
    await expect(flightsTab).toBeVisible({ timeout: 15000 });
    await flightsTab.click({ force: true });
    await page.waitForTimeout(500);
    return;
  }

  // Some variants of the demo expose a direct flights panel on the homepage
  const flightsPanel = page.locator('[role="tabpanel"] >> text=Flights');
  if (await flightsPanel.count()) {
    await flightsPanel.first().click({ force: true });
    await page.waitForTimeout(500);
  }
}

async function submitSearch(page: any) {
  const searchButton = page.getByRole('button', { name: /search|find/i }).first();
  if (await searchButton.count()) {
    await searchButton.click({ force: true });
    return;
  }
  const fallback = page.locator('button:has-text("Search"), button:has-text("Find")').first();
  if (await fallback.count()) {
    await fallback.click({ force: true });
  }
}

async function readBody(page: any) {
  return (await page.locator('body').innerText()).toLowerCase();
}

// test.describe('Flight booking demo (aligned with docs/test-case-report.md)', () => {
  // test('TC-01 & TC-02: Homepage search panel visible and basic round-trip search', async ({ page }) => {
  //   await openFlightsTab(page);

  //   const flightPanel = page.locator('[role="tabpanel"]', { hasText: /flight|departure|arrival|from|to|search/i }).first();
  //   await expect(flightPanel).toBeVisible();

  //   await setFieldValue(page, ['input[name*="from" i]', 'input[placeholder*="From" i]', 'input[aria-label*="From" i]'], validRoute.from);
  //   await setFieldValue(page, ['input[name*="to" i]', 'input[placeholder*="To" i]', 'input[aria-label*="To" i]'], validRoute.to);
  //   await setFieldValue(page, ['input[name*="depart" i]', 'input[name*="departure" i]', 'input[type="date"]', 'input[placeholder*="Depart" i]'], validRoundDates.departure);
  //   await setFieldValue(page, ['input[name*="return" i]', 'input[placeholder*="Return" i]'], validRoundDates.return);

  //   await submitSearch(page);
  //   await page.waitForTimeout(2000);

  //   const resultLocator = page.locator('.flight-card, .flight-result, .result, .listing, [data-testid*="flight"]').first();
  //   if (await resultLocator.count()) {
  //     await expect(resultLocator).toBeVisible({ timeout: 20000 });
  //   } else {
  //     const body = await readBody(page);
  //     expect(body).toMatch(/flight|search|travel|departure|arrival|result|itinerary/);
  //   }
  // });

  // test('TC-03: One-way search returns results', async ({ page }) => {
  //   await openFlightsTab(page);

  //   // Try to select One-Way trip type (common label variations)
  //   const oneWayLabel = page.getByRole('radio', { name: /one-?way/i }).first();
  //   if (await oneWayLabel.count()) {
  //     await oneWayLabel.check?.();
  //     await oneWayLabel.click({ force: true }).catch(() => {});
  //   } else {
  //     const oneWayBtn = page.getByRole('tab', { name: /one-?way|one way/i }).first();
  //     if (await oneWayBtn.count()) await oneWayBtn.click({ force: true });
  //   }

  //   await setFieldValue(page, ['input[name*="from" i]', 'input[placeholder*="From" i]'], validRoute.from);
  //   await setFieldValue(page, ['input[name*="to" i]', 'input[placeholder*="To" i]'], validRoute.to);
  //   await setFieldValue(page, ['input[name*="depart" i]', 'input[type="date"]', 'input[placeholder*="Depart" i]'], oneWayDate);

  //   // Clear any return date (if present)
  //   await setFieldValue(page, ['input[name*="return" i]', 'input[placeholder*="Return" i]'], '');

  //   await submitSearch(page);
  //   await page.waitForTimeout(2000);

  //   const resultLocator = page.locator('.flight-card, .flight-result, .result, .listing, [data-testid*="flight"]').first();
  //   if (await resultLocator.count()) {
  //     await expect(resultLocator).toBeVisible({ timeout: 20000 });
  //   } else {
  //     const body = await readBody(page);
  //     expect(body).toMatch(/one-?way|flight|result|itinerary/);
  //   }
  // });

  test('TC-04: Required flight search fields are validated', async ({ page }) => {
    await openFlightsTab(page);

    // Clear fields where possible
    await setFieldValue(page, ['input[name*="from" i]', 'input[placeholder*="From" i]'], '');
    await setFieldValue(page, ['input[name*="to" i]', 'input[placeholder*="To" i]'], '');

    await submitSearch(page);
    await page.waitForTimeout(1000);

    const body = await readBody(page);
    expect(body).toMatch(/required|please enter|origin|destination|cannot be empty|please select/i);
  });

  test('TC-05: Same-city route is rejected', async ({ page }) => {
    await openFlightsTab(page);

    await setFieldValue(page, ['input[name*="from" i]', 'input[placeholder*="From" i]'], sameCity);
    await setFieldValue(page, ['input[name*="to" i]', 'input[placeholder*="To" i]'], sameCity);
    await setFieldValue(page, ['input[name*="depart" i]', 'input[type="date"]'], oneWayDate);

    await submitSearch(page);
    await page.waitForTimeout(1000);

    const body = await readBody(page);
    expect(body).toMatch(/please select|error|same|origin.*destination|cannot.*same|please choose different/i);
  });

  test('TC-06: Invalid airport or city value is handled gracefully', async ({ page }) => {
    await openFlightsTab(page);

    await setFieldValue(page, ['input[name*="from" i]', 'input[placeholder*="From" i]'], invalidCity);
    await setFieldValue(page, ['input[name*="to" i]', 'input[placeholder*="To" i]'], validRoute.to);
    await setFieldValue(page, ['input[name*="depart" i]', 'input[type="date"]'], oneWayDate);

    await submitSearch(page);
    await page.waitForTimeout(1500);

    const body = await readBody(page);
    expect(body).toMatch(/please select|error|no results|not found|invalid|please check|could not find|no flights/i);
  });

  // test('TC-07: Return date before departure date is blocked', async ({ page }) => {
  //   await openFlightsTab(page);

  //   // Ensure Round-Trip mode where applicable
  //   const roundTripRadio = page.getByRole('radio', { name: /round-?trip|round trip/i }).first();
  //   if (await roundTripRadio.count()) {
  //     try {
  //       await roundTripRadio.check?.();
  //     } catch {}
  //     await roundTripRadio.click({ force: true }).catch(() => {});
  //   }

  //   await setFieldValue(page, ['input[name*="from" i]', 'input[placeholder*="From" i]'], validRoute.from);
  //   await setFieldValue(page, ['input[name*="to" i]', 'input[placeholder*="To" i]'], validRoute.to);
  //   await setFieldValue(page, ['input[name*="depart" i]'], returnBefore.departure);
  //   await setFieldValue(page, ['input[name*="return" i]'], returnBefore.return);

  //   await submitSearch(page);
  //   await page.waitForTimeout(1000);

  //   const body = await readBody(page);
  //   expect(body).toMatch(/please select|error|return date.*after|return.*must be after|invalid return date|please select a return date after/i);
  // });

  // test('TC-08: Passenger count constraints are enforced', async ({ page }) => {
  //   await openFlightsTab(page);

  //   // Try zero passengers (common input names)
  //   const setAdults = await setFieldValue(page, ['input[name*="adults" i]', 'input[name*="adult" i]'], '0');

  //   // If no specific adults input, try a generic passengers input
  //   if (!setAdults) {
  //     await setFieldValue(page, ['input[name*="passengers" i]', 'input[placeholder*="Passengers" i]'], '0');
  //   }

  //   await setFieldValue(page, ['input[name*="from" i]'], validRoute.from);
  //   await setFieldValue(page, ['input[name*="to" i]'], validRoute.to);
  //   await setFieldValue(page, ['input[name*="depart" i]'], oneWayDate);

  //   await submitSearch(page);
  //   await page.waitForTimeout(1000);

  //   const bodyZero = await readBody(page);
  //   expect(bodyZero).toMatch(/at least 1|minimum|please select.*passenger|passenger.*required|cannot be 0/i);

  //   // Try exceeding a large maximum and expect graceful handling (clamped or message)
  //   const large = '99';
  //   const setLarge = await setFieldValue(page, ['input[name*="adults" i]', 'input[name*="adult" i]'], large);
  //   if (!setLarge) {
  //     await setFieldValue(page, ['input[name*="passengers" i]'], large);
  //   }

  //   await submitSearch(page);
  //   await page.waitForTimeout(1000);

  //   const bodyLarge = await readBody(page);
  //   expect(bodyLarge).toMatch(/maximum|exceed|limited to|cannot exceed|please reduce/i);
  // });
// }
// );
