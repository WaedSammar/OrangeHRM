import CommonHelper from "../../support/helpers/common-helper";
import { BuzzPage, POST_FILTER_OPTION } from "../../support/page-objects/buzz-page";
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

  it("Should create a new post via API", () => {
    BuzzPage.createPostViaAPI(postText).then(() => {
      BuzzPage.goToBuzzPage();
      BuzzPage.verifyPost(postText);
    })
  })

  it("Should write a successful post", () => {
    BuzzPage.writePost(postText);
    const createPostAliasName = CommonHelper.generate_random_string(
      7,
      "CreatePost_"
    );
    BuzzPage.interceptPostRequest(createPostAliasName);
    BuzzPage.submitPost();
    BuzzPage.waitForSucceedPost(createPostAliasName).then(() => {
      BuzzPage.verifyPost(postText);
    })
  });

  it("Should verify poster name", () => {
    BuzzPage.writePost(postText);
    const createPostAliasName = CommonHelper.generate_random_string(
      4,
      "CreatePost_"
    );
    BuzzPage.interceptPostRequest(createPostAliasName);
    BuzzPage.submitPost();
    BuzzPage.waitForSucceedPost(createPostAliasName).then((response) => {
      // @ts-ignore
      BuzzPage.verifyPosterName(response.data.employee);
      BuzzPage.verifyPost(postText);
    })
  });

  it("Should verify post date is current", () => {
    BuzzPage.writePost(postText);
    const createPostAliasName = CommonHelper.generate_random_string(
      2,
      "CreatePost_"
    );
    BuzzPage.interceptPostRequest(createPostAliasName);
    BuzzPage.submitPost();
    BuzzPage.waitForSucceedPost(createPostAliasName).then((response) => {
      // @ts-ignore
      BuzzPage.verifyDateAndTime(response.data.createdAt);
    })
  });

  it("Should verify most liked post", () => {
    BuzzPage.applyPostFilter(POST_FILTER_OPTION.MOST_LIKED);
    BuzzPage.verifyMostLikedPost();
  });
})