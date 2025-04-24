import loginData from "../../fixtures/login-page-mock.json";
import { BuzzPage } from "../../support/page-objects/buzz-page";
import { LoginPage } from "../../support/page-objects/login-page";

describe("Buzz News Feed Test Cases", () => {

  let postText;

  beforeEach(() => {
    cy.visit('/')
    cy.fixture("buzz-post-mock").then((postData) => {
      postText = postData.postText;
    })
    LoginPage.login(loginData.correctUsername, loginData.correctPassword);
    BuzzPage.goToBuzzPage();
  });

  it("Should write a Successful Post", () => {
    BuzzPage.writePost(postText);
    BuzzPage.submitPost();
    BuzzPage.verifyPost(postText);
  });

  it("Should verify Poster Name", () => {
    BuzzPage.writePost(postText);
    BuzzPage.submitPost();
    BuzzPage.verifyPost(postText);
    BuzzPage.verifyPosterMatchesLoggedInUser()
  })
})