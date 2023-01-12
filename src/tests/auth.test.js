import request from 'supertest'
import User from "../models/User.js";
// import app from "../server.js";
import useApp from "./jest_s.js";
const app = useApp;

describe("/users", () => {
    let user;
    let userAfterSignup;
    beforeAll(async () => {
        user = {
            'email':"ndatumuremyi@gmail.com",
            'password':'password'
        }
    });
    it("should return 200 :GET /users/signup", async () => {

        const response = await request(app)
            .post("/api/v1/users/signup")
            .send(user);
        userAfterSignup = User.findOne({ email:user.email });
        expect(response.statusCode).toBe(201);
        expect(userAfterSignup).toBeDefined();
    });
    it("should return 200 :GET /users/login", async () => {
        const response = await request(app).post("/api/v1/users/login").send(user);
        console.log(response.body)
        expect(response.statusCode).toBe(200);
        expect(response.body.token !== undefined).toBe(true);
    });
    it("should return 403 <<INVALID-EMAIL>> :GET /users/login", async () => {
        const response = await request(app).post("/api/v1/users/login").send({...user, email:"test@gmail"});
        expect(response.statusCode).toBe(403);
        expect(response.body.token !== undefined).toBe(false);
        expect(response.body).toHaveProperty("error");
    });
    it("should return 403 <<INVALID-PASSWORD>> :GET /users/login", async () => {
        const response = await request(app).post("/api/v1/users/login").send({...user, email:"test@gmail"});
        expect(response.statusCode).toBe(403);
        expect(response.body.token !== undefined).toBe(false);
        expect(response.body).toHaveProperty("error");
    });
    it("should return 400 <<MISSING-PASSWORD>> :GET /users/login", async () => {
        const response = await request(app).post("/api/v1/users/login").send({email:user.email});
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message");
    });
    it("should return 400 <<MISSING-EMAIL>> :GET /users/login", async () => {
        const response = await request(app).post("/api/v1/users/login").send({password:user.password});
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message");
    });


})