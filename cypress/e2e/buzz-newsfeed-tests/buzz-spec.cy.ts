import { ICreatePostResponse } from '../../support/apis/response/buzz-page/buzz-post'
import { BuzzPage, POST_FILTER_OPTION } from '../../support/page-objects/buzz-page'

describe('Buzz News Feed Test Cases', () => {
  let postText: string

  beforeEach(() => {
    cy.fixture('buzz-post-mock').then((postData) => {
      postText = postData.postText
    })
    cy.login()
    BuzzPage.goToBuzzPage()
  })

  it('Create a new post via API', () => {
    BuzzPage.createPostViaAPI(postText).then(() => {
      BuzzPage.goToBuzzPage()
      BuzzPage.verifyPost(postText)
    })
  })

  it('Write a successful post via UI', () => {
    BuzzPage.writePost(postText)
    BuzzPage.submitPost().then(() => {
      BuzzPage.verifyPost(postText)
    })
  })

  it('Verify poster name who created the post', () => {
    BuzzPage.writePost(postText)
    BuzzPage.submitPost().then((response: ICreatePostResponse) => {
      BuzzPage.verifyPosterName(response.data.employee)
      BuzzPage.verifyPost(postText)
    })
  })

  it('Verify date and time for the post', () => {
    BuzzPage.writePost(postText)
    BuzzPage.submitPost().then((response: ICreatePostResponse) => {
      BuzzPage.verifyDateAndTime(response.data.createdAt)
    })
  })

  it('Filter and Verify most liked post', () => {
    BuzzPage.applyPostFilter(POST_FILTER_OPTION.MOST_LIKED)
    BuzzPage.verifyMostLikedPost()
  })
})
