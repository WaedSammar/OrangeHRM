import APIsHelper from "../../support/helpers/apis-helpers";
import CommonHelper from "../../support/helpers/common-helper";
import BuzzPage, {
  POST_FILTER_OPTION,
} from "../../support/page-objects/buzz-page";
import { LoginPage } from "../../support/page-objects/login-page";

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
    });
  });

  it("Create a new post via UI", () => {
    BuzzPage.writePost(postText);

    const createPostAliasName = CommonHelper.generate_random_string(
      3,
      "CreatePost_"
    );
    APIsHelper.interceptPostRequest(createPostAliasName);

    BuzzPage.submitPost();

    APIsHelper.getInterceptionApiResponse(createPostAliasName).then(() => {
      BuzzPage.verifyPost(postText);
    });
  });

  it("Verify poster name for the created post", () => {
    BuzzPage.writePost(postText);

    const createPostAliasName = CommonHelper.generate_random_string(
      undefined,
      "CreatePost_"
    );
    APIsHelper.interceptPostRequest(createPostAliasName);
    BuzzPage.submitPost();

    APIsHelper.getInterceptionApiResponse(createPostAliasName).then(
      (response: any) => {
        BuzzPage.verifyPosterName(response.data.employee);
        BuzzPage.verifyPost(postText);
      }
    );
  });

  it("Verify date and time of the created post", () => {
    BuzzPage.writePost(postText);

    const createPostAliasName = CommonHelper.generate_random_string(
      3,
      "CreatePost_"
    );
    APIsHelper.interceptPostRequest(createPostAliasName);

    BuzzPage.submitPost();

    APIsHelper.getInterceptionApiResponse(createPostAliasName).then(
      (response: any) => {
        BuzzPage.verifyDateAndTime(response.data.createdAt);
      }
    );
  });

  it("Filter and verify most liked posts", () => {
    const mostLikedPostsFilterAliasName = CommonHelper.generate_random_string(
      5,
      "MostLikedPostsFilter_"
    );
    APIsHelper.interceptPostsFilter(mostLikedPostsFilterAliasName);

    BuzzPage.applyPostFilter(POST_FILTER_OPTION.MOST_LIKED);

    APIsHelper.waitForApiResponse(mostLikedPostsFilterAliasName);
    BuzzPage.verifyMostLikedPosts();
  });
});
