import { BuzzPage } from "../../support/page-objects/buzz-page";
import { LoginPage } from "../../support/page-objects/login-page";

describe("Buzz News Feed Test Cases", () => {

  let postText, correctUsername, correctPassword;

  beforeEach(() => {
    cy.visit('/')
    cy.fixture("buzz-post-mock").then((postData) => {
      postText = postData.postText;
    });
    cy.fixture("login-page-mock").then((loginData) => {
      correctUsername = loginData.correctUsername;
      correctPassword = loginData.correctPassword;
    });
    cy.then(() => {
      LoginPage.login(correctUsername, correctPassword);
      BuzzPage.goToBuzzPage();
    });
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

  it("Should verify from current date", () => {
    BuzzPage.writePost(postText);
    BuzzPage.submitPost();
    BuzzPage.verifyDateAndTime();
  })

  it.only("Should verify most liked post", () => {
    BuzzPage.getMostLikedPost();
    BuzzPage.verifyMostLikedPost();
  })
})