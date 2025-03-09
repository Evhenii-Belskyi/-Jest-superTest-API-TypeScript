import * as supertest from 'supertest';

const request = supertest('https://practice-react.sdetunicorns.com/api/test');

describe('Testing Brands', () => {
    let newBrand;

    describe('POST Create a brand', () => {
        it('Schema Verification - Name is too short', async () => {
            const data = {
                'name': '1',
                'description': 'Brand Description '
            };

            const res = await request
                .post('/brands')
                .send(data);
            
            expect(res.statusCode).toEqual(422);
            expect(res.body.error).toEqual('Brand name is too short');
        });

        it('Schema Verification - Name is a mandatory field', async () => {
            const data = {
                'name': '',
                'description': 'Brand Description ' + (Math.random() * 10000).toFixed(1)
            };

            const res = await request
                .post('/brands')
                .send(data);
            
            expect(res.statusCode).toEqual(422);
            expect(res.body.error).toEqual('Name is required');
        });

        it('Check for duplicate brands entries not allowed', async () => {
            const name = 'Test name ' + (Math.random() * 10000).toFixed(1);
            const data = {
                'name': name,
                'description': 'Brand Description ' + (Math.random() * 10000).toFixed(1)
            };

            // First request
            const res1 = await request
                .post('/brands')
                .send(data);
            
            expect(res1.statusCode).toEqual(200);
            
            // Second request
            const res2 = await request
                .post('/brands')
                .send(data);
         
            expect(res2.statusCode).toEqual(422);
            expect(res2.body.error).toContain('already exists');
            
            newBrand = res1.body;

            if (newBrand && newBrand.name && newBrand.description) {
                console.log('What has been created: ' + newBrand.name + ' ' + newBrand.description);
            } else {
                console.log('New brand was not created or missing properties.');
            }
        });

        it('Create brand name', async () => {
            const name = 'string21 ' + (Math.random() * 10000).toFixed(1);
            const data = {
                'name': name,
                'description': 'Brand Description ' + (Math.random() * 10000).toFixed(1)
            };

            const res = await request
                .post('/brands')
                .send(data);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toEqual(data.name);
            expect(res.body.description).toEqual(data.description);
            expect(res.body).toHaveProperty('createdAt');
        });
    });

    describe('GET requests', () => {
        it('GET /brands', async () => {
            const res = await request.get('/brands');
            
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThan(1);
            
            const brands = res.body; 
            const brandNames = brands.map((brand: { name: string }) => brand.name);
            console.log('all brand names ' + brandNames);
            
            expect(brandNames).toContain("A Plus 3159");
        });

        it('GET /brands/:id', async () => {
            const res = await request.get('/brands/' + newBrand._id);
            console.log(res.body);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.name).toEqual(newBrand.name);
            console.log('this is get method new id ' + newBrand._id);
        });

        it('GET check invalid _id should display throw 404', async () => {
            const res = await request.get('/brands/' + '12347e8d49e85607248e28d9');
            console.log(res.body);
                    
            expect(res.statusCode).toBe(404);
            expect(res.body.error).toEqual('Brand not found.');
        });
    });

    describe('PUT requests', () => {
        it('PUT /brands/:id', async () => {
            const data = {
                'name': newBrand.name + ' updated',
                'description': newBrand.description + ' string12'
            };

            const res = await request
                .put('/brands/' + newBrand._id)
                .send(data);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toEqual(data.name);
            expect(res.body.description).toEqual(data.description);
            expect(res.body).toHaveProperty('createdAt');
            console.log('this is put method ' + JSON.stringify(res.body));
        });

        it('PUT edit more than 30 characters of brand name', async () => {
            const data = {
                'name': newBrand.name + 'This is a really long brand name ',
                'description': newBrand.description + ' string12'
            };

            const res = await request
                .put('/brands/' + newBrand._id)
                .send(data);
            
            expect(res.statusCode).toEqual(422);
            expect(res.body.error).toContain('Brand name is too long');

            console.log('this is put method ' + JSON.stringify(res.body));
        });

        it('Check the description if numbers = error "Brand description must be a string"', async () => {
            const data = {
                'name': newBrand.name + 'Test',
                'description': 1234567
            };

            const res = await request
                .put('/brands/' + newBrand._id)
                .send(data);
            
            expect(res.statusCode).toEqual(422);
            expect(res.body.error).toContain('Brand description must be a string');

            console.log('this is put method ' + JSON.stringify(res.body));
        });

        it('PUT /brands/invalid_id', async () => {
            const data = {
                'name': ' updated'
            };
            const res = await request
                .put('/brands/' + 123)
                .send(data);
      
            expect(res.statusCode).toEqual(422);
            expect(res.body.error).toContain('Unable to update brands');
        });
    });

    describe('DELETE requests', () => {
        it('DELETE /brands/:id', async () => {
            const res = await request.delete('/brands/' + newBrand._id);
            expect(res.statusCode).toEqual(200);
            console.log(res.body);
        });
        
        it('DELETE /brands/invalid_id', async () => {
            const res = await request.delete('/brands/' + 123);
            expect(res.statusCode).toEqual(422);
            expect(res.body.error).toContain('Unable to delete brand');
        });
    });
});