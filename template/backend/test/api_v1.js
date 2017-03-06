/**
 *
 * Example test for API routes
 *
 */

import chai from "chai";
import chaiHttp from "chai-http";
import server from "../src/app";

let should = chai.should();
chai.use(chaiHttp);

//Our parent block
describe("Example API test", () => {
  before(done => {
    //Before each test we empty the database
    done();
  });
  /*
  * Test the /GET /api/exercise
  */
  describe("GET /api/v1/info", () => {
    it("it should GET 200 with json", done => {
      chai.request(server).get("/api/v1/info").end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("Object");
        res.body.message.should.equal("GET INFO");
        done();
      });
    });
  });
});
