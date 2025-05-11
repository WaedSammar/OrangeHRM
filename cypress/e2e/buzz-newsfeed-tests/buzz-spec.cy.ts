import { APIsHelper } from "../../support/helpers/apis-helpers";
import CommonHelper from "../../support/helpers/common-helper";
import { BuzzPage, POST_FILTER_OPTION } from "../../support/page-objects/buzz-page";
import { LoginPage } from "../../support/page-objects/login-page";
import { CreatePostResponse } from "../../support/types/buzz-api-response";

describe("Buzz News Feed Test Cases", () => {

  let postText, correctUsername, correctPassword;

  beforeEach(() => {

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

  it("Create a new post via API", () => {
    BuzzPage.createPostViaAPI(postText).then(() => {
      BuzzPage.goToBuzzPage();
      BuzzPage.verifyPost(postText);
    })
  })

  it("Write a successful post via UI", () => {
    BuzzPage.writePost(postText);
    const createPostAliasName = CommonHelper.generateRandomAlias(
      7,
      "CreatePost_"
    );
    APIsHelper.interceptPostRequest(createPostAliasName);
    BuzzPage.submitPost();
    APIsHelper.getInterceptionApiResponse(createPostAliasName).then(() => {
      BuzzPage.verifyPost(postText);
    })
  });

  it("Verify poster name who created the post", () => {
    BuzzPage.writePost(postText);
    const createPostAliasName = CommonHelper.generateRandomAlias(
      4,
      "CreatePost_"
    );
    APIsHelper.interceptPostRequest(createPostAliasName);
    BuzzPage.submitPost();
    APIsHelper.getInterceptionApiResponse(createPostAliasName)
      .then(
        (response: CreatePostResponse) => {
          BuzzPage.verifyPosterName(response.data.employee);
          BuzzPage.verifyPost(postText);
        })
  });

  it("Verify date and time for the post", () => {
    BuzzPage.writePost(postText);
    const createPostAliasName = CommonHelper.generateRandomAlias(
      2,
      "CreatePost_"
    );
    APIsHelper.interceptPostRequest(createPostAliasName);
    BuzzPage.submitPost();
    APIsHelper.getInterceptionApiResponse(createPostAliasName)
      .then(
        (response: CreatePostResponse) => {
          console.log(response);
          BuzzPage.verifyDateAndTime(response.data.createdAt);
        })
  });

  it("Filter and Verify most liked post", () => {
    const mostLikedFilterAliasName = CommonHelper.generateRandomAlias(
      2,
      "mostLikedPost"
    );
    APIsHelper.interceptPostFilter(mostLikedFilterAliasName)
    BuzzPage.applyPostFilter(POST_FILTER_OPTION.MOST_LIKED);
    APIsHelper.waitForApiResponse(mostLikedFilterAliasName);
    BuzzPage.verifyMostLikedPost();
  });
})