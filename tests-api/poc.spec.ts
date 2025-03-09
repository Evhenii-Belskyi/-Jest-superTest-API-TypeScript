import * as supertest from 'supertest';

const request = supertest('https://jsonplaceholder.typicode.com/');

describe('POC tests API', () => {

    describe('GET requests', () => {
        it('GET /posts', async () => {
            const res = await request.get('/posts');
            console.log(res)
            expect(res.body[1].title).toBe('qui est esse')
        })
    
        it('GET / comments with query params', async () => {
            // const res = await request.get('/comments?postId=1')
            const res = await request
            .get('/posts/1/comments')
            .query({userId: 1, title: 'my item', id: 101})
            console.log(res)
    
            // expect(res.body[0].postId).toBe(1)
        })

    })
    
    describe('POST requests', () => {
        it('Post / posts', async () => {

            const data = {
                title: 'my item',
                body: 'Witcher, Hunter, Casino',
                userId: 1,
            }

            const res = await request
            .post('/posts')
            .send(data)
            
            expect(res.body.title).toBe(res.body.title)
            console.log(res.body)
        })
    })

    describe('PUT Request', () => {
        it('PUT /posts/{id}', async () => {
          const data = {
            title: 'Updated title',
            body: 'Updated body..',
            userId: 5,
          }
    
          const getRes = await request.get('/posts/5');
          const beforeTitle = getRes.body.title;
    
          const res = await request
            .put('/posts/5')
            .send(data)
          expect(res.body.title).not.toBe(beforeTitle); // null
          expect(res.body.title).toBe(data.title);
          console.log(res.body.title)
    
        });
      });

      describe('PATCH Request', () => {
        it('PATCH /posts/{id}', async () => {
          const data = {
            title: 'Updated NEW title',
          }
    
          const getRes = await request.get('/posts/5');
          const beforeTitle = getRes.body.title;
    
          const res = await request
            .patch('/posts/5')
            .send(data)
          console.log(res)

          expect(res.body.title).not.toBe(beforeTitle); // null
          expect(res.body.title).toBe(data.title);
          console.log(res.body.title)
    
        });
      });

      describe('Delete Request', () => {
        it('Delete /posts/{id}', async () => {
    
          const res = await request
          .delete('/posts/5');

          expect(res.statusCode).toBe(200)
          expect(res.body).toEqual({})
    
        });
      });

})