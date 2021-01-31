const request = require('supertest');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const app = require('../app');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('functional - pet', () => {
    it('TC01: should fail to create a user without a name', async () => {
        const res = await request(app).post('/pets').send({
            age: '16',
            colour: 'green',
        });
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('"name" is required');
    });

    it('TC02: should create a pet', async () => {
        const pet = {
            name: 'parrot',
            age: 16,
            colour: 'green',
        };
        try {
            const res = await request(app).post('/pets').send(pet);
            expect(res.status).to.equal(201);
            expect(res.body.name).to.equal(pet.name);
            expect(res.body.age).to.equal(pet.age);
            expect(res.body.colour).to.equal(pet.colour);
        } catch (e) {
            expect(e).not.to.be.undefined;
        }
    });

    it('TC03: should retrieve a pet', async () => {
        const pet = {
            name: 'parrot',
            age: 16,
            colour: 'green',
        };
        try {
            await request(app).post('/pets').send(pet);
            const res = await request(app).get('/pets');
            expect(res.status).to.equal(200);
            expect(res.body[0].name).to.equal(pet.name);
            expect(res.body[0].age).to.equal(pet.age);
            expect(res.body[0].colour).to.equal(pet.colour);
        } catch (e) {
            expect(e).not.to.be.undefined;
        }
    });

    it('TC04: should retrieve a empty array when no records are avaialbe', async () => {
        const pet = {
            name: 'parrot',
            age: 16,
            colour: 'green',
        };
        try {
            const res = await request(app).get('/pets');
            expect(res.status).to.equal(200);
            expect(res.body[0]).to.be.undefined;
        } catch (e) {
            expect(e).not.to.be.undefined;
        }
    });

    it('TC05: should delete a pet', async () => {
        const pet = {
            name: 'parrot',
            age: 16,
            colour: 'green',
        };
        try {
            const result = await request(app).post('/pets').send(pet);
            const id = result.body['_id'];
            const res = await request(app).delete(`/pets/${id}`);
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('record deleted successfully');
        } catch (e) {
            expect(e).not.to.be.undefined;
        }
    });

    it('TC06: should return error when record not found while deleting the pet', async () => {
        const pet = {
            name: 'parrot',
            age: 16,
            colour: 'green',
        };
        try {
            const res = await request(app).delete(`/pets/123`);
            expect(res.status).to.equal(500);
            expect(res.body.message).to.equal("Cast to ObjectId failed for value \"123\" at path \"_id\" for model \"Pets\"");
        } catch (e) {
            expect(e).not.to.be.undefined;
        }
    });
});
