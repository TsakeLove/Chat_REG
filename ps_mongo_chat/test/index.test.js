var expect = require('chai').expect;
var app = require('/Users/igor/WebstormProjects/registration/passport-mongo/routes/index.js');
var request = require('supertest');


const userCredentials = {
    username: '123',
    password: '123'
}
//now let's login the user before we run any tests
var authenticatedUser = request.agent(app);
it("should return Hello Test", before(function(done){
    authenticatedUser
        .post('/login')
        .send(userCredentials)


        .end(done);
        })
);