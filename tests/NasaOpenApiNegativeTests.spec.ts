import { test, expect } from '@playwright/test';

const apiKey = 'C7jh7pPCpfBBRzz9jQnkg6wFdD6HqprnL9JwrWqB';
const neoFeedApiUrl = 'https://api.nasa.gov/neo/rest/v1/feed';
const neoLookUpApiUrl = 'https://api.nasa.gov/neo/rest/v1/neo';
const neoBrowseApiUrl = 'https://api.nasa.gov/neo/rest/v1/neo/browse'
const validRange = { start_date: '2026-10-01', end_date: '2026-10-07' };
const invalidDates: Array<{ name: string; value: string }> = [
        { name: 'DD-MM-YYYY format', value: '28-10-2026' },
        { name: 'slash separators', value: '2026/10/28' },
        { name: 'non-date text', value: 'abc' },
        { name: 'month out of range', value: '2026-13-01' },
        { name: 'non-existent date (Feb 30)', value: '2026-02-30' },
    ];

test.describe('Negative test cases of NeoWs (Near Earth Object Web Service)', () => {
   test('Verify Neo Feed API endpoint returns 400 Bad Request for invalid date range', async ({ request }) => {
        const response = await request.get(neoFeedApiUrl, {
        params: { 
            start_date: '2026-10-01', 
            end_date: '2026-10-20', 
            api_key: apiKey },
        });

      expect(response.status()).toBe(400);
    });

    test('Verify Neo Feed API endpoint returns 403 Forbidden for missing API key', async ({ request }) => {
        const response = await request.get(neoFeedApiUrl, {
        params: { 
            start_date: '2026-10-01', 
            end_date: '2026-10-20' },
        });

        expect(response.status()).toBe(403);
        expect((await response.json()).error.code).toBe('API_KEY_MISSING');
    });

        test('Neo Feed returns 403 when api_key is invalid', async ({ request }) => {
        const response = await request.get(neoFeedApiUrl, {
            params: { 
                start_date: '2026-10-01', 
                end_date: '2026-10-20', 
                api_key: 'invalid_key_12345' },
        });

        expect(response.status()).toBe(403);
        expect((await response.json()).error.code).toBe('API_KEY_INVALID');
    });

    for (const { name, value } of invalidDates) {
        test(`Neo Feed rejects an invalid start_date (${name})`, async ({ request }) => {
            const response = await request.get(neoFeedApiUrl, {
                params: { start_date: value, end_date: validRange.end_date, api_key: apiKey },
            });

            expect(response.status()).toBeGreaterThanOrEqual(400);
            expect(response.status()).toBeLessThan(500);
        });
    }

    test('Verify Neo Look Up API endpoint returns http code 403 Forbiddenfor invalid API key', async ({ request }) => {
        const response = await request.get(neoLookUpApiUrl, {
        params: { 
            start_date: '2026-10-01', 
            end_date: '2026-10-20', 
            api_key: 'invalid_key' },
        });

        console.log(response.status());    
        expect(response.status()).toBe(403);
    });

    test('Verify Neo Look Up API endpoint returns http code 403 Forbidden when api_key is invalid', async ({ request }) => {
        const asteroidId = '3542519';
        const response = await request.get(`${neoLookUpApiUrl}/${asteroidId}`, {
            params: { api_key: 'invalid_key_12345' },
        });

        expect(response.status()).toBe(403);

        const body = await response.json();
        expect(body.error.code).toBe('API_KEY_INVALID');
    });

    test('Verify Neo Look Up API endpoint returns http code 404 Not Found when the asteroid id does not exist', async ({ request }) => {
        const invalidAsteroidId = '0000000';
        const response = await request.get(`${neoLookUpApiUrl}/${invalidAsteroidId}`, {
            params: { api_key: apiKey },
        });

        expect(response.status()).toBe(404);
        expect(response.ok()).toBeFalsy();
    });

    test('Neo Browse returns 403 when api_key is missing', async ({ request }) => {
        const response = await request.get(neoBrowseApiUrl);

        expect(response.status()).toBe(403);
        expect((await response.json()).error.code).toBe('API_KEY_MISSING');
    });

    test('Neo Browse returns 403 when api_key is invalid', async ({ request }) => {
        const response = await request.get(neoBrowseApiUrl, {
            params: { api_key: 'invalid_key_12345' },
        });

        expect(response.status()).toBe(403);
        expect((await response.json()).error.code).toBe('API_KEY_INVALID');
    });
});
