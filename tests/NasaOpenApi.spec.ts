import { test, expect } from '@playwright/test';

test.describe('NeoWs (Near Earth Object Web Service) is a RESTful web service for near earth Asteroid information. With NeoWs a user can: search for Asteroids based on their closest approach date to Earth, lookup a specific Asteroid with its NASA JPL small body id, as well as browse the overall data-set.', () => {
    test('Verify Neo Feed API endpoint returns list of near earth asteroids by date range.', async ({ request }) => {
        const apiKey = 'C7jh7pPCpfBBRzz9jQnkg6wFdD6HqprnL9JwrWqB';
        let startDate = '2026-10-28';
        let endDate = '2026-11-04';

        const response = await request.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`);  
        const bodyResponse = await response.json();

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
        expect(response.headers()['content-type']).toContain('application/json');

        console.log('Response Body:', bodyResponse);

        expect(bodyResponse).toHaveProperty('element_count');
        expect(bodyResponse).toHaveProperty('near_earth_objects');
        expect(bodyResponse).toHaveProperty('links');
        expect(bodyResponse.near_earth_objects).toHaveProperty(startDate);
        expect(bodyResponse.near_earth_objects).toHaveProperty(endDate);
    });

    test('Verify Neo Lookup API endpoint fetches asteroid information by NASA JPL small body id.', async({request}) => {
        const apiKey = 'C7jh7pPCpfBBRzz9jQnkg6wFdD6HqprnL9JwrWqB';
        const asteroidId = '3542519';
        const designationName = '2010 PK9';

        const response = await request.get(`https://api.nasa.gov/neo/rest/v1/neo/${asteroidId}?api_key=${apiKey}`);
        const bodyResponse = await response.json();

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
        expect(response.headers()['content-type']).toContain('application/json');

        expect(bodyResponse).toHaveProperty('id');
        expect(bodyResponse).toHaveProperty('designation');

        const id = bodyResponse.id;
        const designation = bodyResponse.designation;
   
        expect(id).toBe(asteroidId);
        expect(designation).toBe(designationName);
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

