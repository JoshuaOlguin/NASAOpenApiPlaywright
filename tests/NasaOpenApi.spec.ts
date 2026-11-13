import { test, expect } from '@playwright/test';
import { NeoFeedResponseJson } from '../dto/NeoFeed/NeoFeedResponseJson';
import { NeoLookupResponseJson } from '../dto/NeoLookup/NeoLookupResponse';

const apiKey = 'C7jh7pPCpfBBRzz9jQnkg6wFdD6HqprnL9JwrWqB';
const neoFeedApiUrl = 'https://api.nasa.gov/neo/rest/v1/feed';
const neoLookUpApiUrl = 'https://api.nasa.gov/neo/rest/v1/neo';

test.describe('NeoWs (Near Earth Object Web Service) is a RESTful web service for near earth Asteroid information. With NeoWs a user can: search for Asteroids based on their closest approach date to Earth, lookup a specific Asteroid with its NASA JPL small body id, as well as browse the overall data-set.', () => {
    test('Verify Neo Feed API endpoint returns list of near earth asteroids by date range.', async ({ request }) => {
        const startDate = '2026-10-28';
        const endDate = '2026-11-04';

        const response = await request.get(neoFeedApiUrl, {
            params: {
                    start_date: startDate,
                    end_date: endDate,
                    api_key: apiKey,
            }
        });

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
        expect(response.headers()['content-type']).toContain('application/json');

        const objNeoFeedResponseJson = (await response.json()) as NeoFeedResponseJson;

        expect(objNeoFeedResponseJson.element_count).toBeGreaterThan(0);
        expect(objNeoFeedResponseJson.near_earth_objects).toHaveProperty(startDate);
        expect(objNeoFeedResponseJson.near_earth_objects).toHaveProperty(endDate);
        expect(objNeoFeedResponseJson.links).toBeDefined();
        expect(objNeoFeedResponseJson.links.self).toContain(startDate);
        expect(objNeoFeedResponseJson.links.self).toContain(endDate);

    });

    test('Verify Neo Lookup API endpoint fetches asteroid information by NASA JPL small body id.', async({request}) => {
        const asteroidId = '3542519';
        const designationName = '2010 PK9';

        const response = await request.get(`${neoLookUpApiUrl}/${asteroidId}`, {
            params: {
                api_key: apiKey,
            }
        });

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
        expect(response.headers()['content-type']).toContain('application/json');

        const objNeoLookupResponseJson = (await response.json()) as NeoLookupResponseJson;

        expect(objNeoLookupResponseJson.id).toBe(asteroidId);
        expect(objNeoLookupResponseJson.designation).toBe(designationName);
        expect.soft(objNeoLookupResponseJson.estimated_diameter).toHaveProperty('meters.estimated_diameter_max');
        expect.soft(objNeoLookupResponseJson.close_approach_data.length).toBeGreaterThan(0);
        expect.soft(objNeoLookupResponseJson.orbital_data.orbit_class.orbit_class_type).toBeTruthy();
    });

    test('Verify Neo Browse API endpoint returns a paginated list of all known near earth asteroids.', async({request}) => {
        const apiKey = 'C7jh7pPCpfBBRzz9jQnkg6wFdD6HqprnL9JwrWqB';

        const response = await request.get(`https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${apiKey}`);
        const bodyResponse = await response.json();

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
        expect(response.headers()['content-type']).toContain('application/json');

        expect(bodyResponse).toHaveProperty('near_earth_objects');
    });
});

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

    test('Verify Neo Feed API endpoint returns 403 Forbidden for unauthorized access', async ({ request }) => {
        const response = await request.get(neoFeedApiUrl, {
        params: { 
            start_date: '2026-10-01', 
            end_date: '2026-10-20' },
        });

        expect(response.status()).toBe(403);
        expect((await response.json()).error.code).toBe('API_KEY_MISSING');
    });

    test('Verify Neo Look Up API endpoint returns http code 400 Bad Request for invalid API key', async ({ request }) => {
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
});
