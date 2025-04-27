import { BuzzPage } from "../../support/page-objects/buzz-page";

describe("Buzz News Feed Test Cases", () => {

  let postText, correctUsername, correctPassword;

  beforeEach(() => {
    cy.visit('/')
    cy.fixture("buzz-post-mock").then((postData) => {
      cy.fixture("login-page-mock").then((loginData) => {
        postText = postData.postText;
        correctUsername = loginData.correctUsername;
        correctPassword = loginData.correctPassword;
        BuzzPage.goToBuzzPage();
      })
    })
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

  it("Should verify most liked post", () => {
    BuzzPage.getMostLikedPost();
    BuzzPage.verifyMostLikedPost();
  })
})