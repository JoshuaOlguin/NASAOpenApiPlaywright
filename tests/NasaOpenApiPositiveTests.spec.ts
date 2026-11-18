import { test, expect } from '@playwright/test';
import { NeoFeedResponseJson } from '../models/NeoFeed/NeoFeedResponseJson';
import { NeoLookupResponseJson } from '../models/NeoLookup/NeoLookupResponseJson';
import { NeoBrowseResponseJson } from '../models/NeoBrowse/NeoBrowseResponseJson';

const apiKey = 'C7jh7pPCpfBBRzz9jQnkg6wFdD6HqprnL9JwrWqB';
const neoFeedApiUrl = 'https://api.nasa.gov/neo/rest/v1/feed';
const neoLookUpApiUrl = 'https://api.nasa.gov/neo/rest/v1/neo';
const neoBrowseApiUrl = 'https://api.nasa.gov/neo/rest/v1/neo/browse'
const validRange = { start_date: '2026-10-01', end_date: '2026-10-07' };

//NeoWs API - positive tests
test.describe('Positive test cases of  NeoWs (Near Earth Object Web Service).', () => {
    test('Verify Neo Feed API endpoint returns list of near earth asteroids by date range.', async ({ request }) => {
        const startDate = '2026-10-28';
        const endDate = '2026-11-04';

        const response = await request.get(neoFeedApiUrl, {
            params: {
                    start_date: validRange.start_date,
                    end_date: validRange.end_date,
                    api_key: apiKey,
            }
        });

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
        expect(response.headers()['content-type']).toContain('application/json');

        const objNeoFeedResponseJson = (await response.json()) as NeoFeedResponseJson;

        expect(objNeoFeedResponseJson.element_count).toBeGreaterThan(0);
        expect(objNeoFeedResponseJson.near_earth_objects).toHaveProperty(validRange.start_date);
        expect(objNeoFeedResponseJson.near_earth_objects).toHaveProperty(validRange.end_date);
        expect(objNeoFeedResponseJson.links).toBeDefined();
        expect(objNeoFeedResponseJson.links.self).toContain(validRange.start_date);
        expect(objNeoFeedResponseJson.links.self).toContain(validRange.end_date);

    });

    test('Verify Neo Lookup API endpoint fetches asteroid information by NASA JPL small body id.', async({ request }) => {
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

    test('Verify Neo Browse API endpoint returns a paginated list of all known near earth asteroids.', async({ request }) => {
        const apiKey = 'C7jh7pPCpfBBRzz9jQnkg6wFdD6HqprnL9JwrWqB';

        const response = await request.get(`${neoBrowseApiUrl}`, {
            params: {
                api_key: apiKey,
            }   
        });

        console.log(response.url());

        expect(response.status()).toBe(200);   
        expect(response.ok()).toBeTruthy();
        expect(response.headers()['content-type']).toContain('application/json');

        const objNeoBrowseResponseJson = (await response.json()) as NeoBrowseResponseJson;

        // Paginación coherente
        expect(objNeoBrowseResponseJson.page.number).toBe(0);
        expect(objNeoBrowseResponseJson.page.size).toBeGreaterThan(0);
        expect(objNeoBrowseResponseJson.page.total_elements).toBeGreaterThan(0);
        expect(objNeoBrowseResponseJson.page.total_pages).toBe(
        Math.ceil(objNeoBrowseResponseJson.page.total_elements / objNeoBrowseResponseJson.page.size),);

         // Primera página: sin previous, con next
        expect(objNeoBrowseResponseJson.links.previous).toBeUndefined();
        expect(objNeoBrowseResponseJson.links.next).toBeDefined();

        // Contenido
        expect(objNeoBrowseResponseJson.near_earth_objects.length).toBeGreaterThan(0);
        expect(objNeoBrowseResponseJson.near_earth_objects.length).toBeLessThanOrEqual(objNeoBrowseResponseJson.page.size);

        const ids = objNeoBrowseResponseJson.near_earth_objects.map((n) => n.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});