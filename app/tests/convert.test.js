const request = require('supertest');
const app = require('../server');

describe('Markdown to HTML Conversion API', () => {
    it('should convert basic markdown to HTML', async () => {
        const response = await request(app)
            .post('/api/convert')
            .send({ markdown: '# Hello World' });
        
        expect(response.statusCode).toBe(200);
        // Depending on the marked version, it might not generate id attributes. 
        // We'll check for the <h1> tag.
        expect(response.body.html).toMatch(/<h1.*>Hello World<\/h1>/);
    });

    it('should convert bold text', async () => {
        const response = await request(app)
            .post('/api/convert')
            .send({ markdown: '**Bold**' });
        
        expect(response.statusCode).toBe(200);
        expect(response.body.html).toContain('<strong>Bold</strong>');
    });

    it('should convert links', async () => {
        const response = await request(app)
            .post('/api/convert')
            .send({ markdown: '[Link](https://example.com)' });
        
        expect(response.statusCode).toBe(200);
        expect(response.body.html).toContain('<a href="https://example.com">Link</a>');
    });

    it('should return 400 if markdown text is missing', async () => {
        const response = await request(app)
            .post('/api/convert')
            .send({});
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Markdown text is required');
    });
});
