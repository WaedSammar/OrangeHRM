import loginData from "../../fixtures/login-page-mock.json";
import postData from "../../fixtures/buzz-post-mock.json";
import { BuzzPage } from "../../support/page-objects/buzz-page";

describe("Buzz News Feed Test Cases", () => {

  beforeEach(() => {
    cy.visit('/')
    BuzzPage.login(loginData.correctUsername, loginData.correctPassword);
    BuzzPage.goToBuzzPage();
  });

  it("Should write a Successful Post", () => {
    BuzzPage.writePost(postData.postText);
    BuzzPage.verifyPost(postData.postText);
  });
})