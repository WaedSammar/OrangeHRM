import loginData from "../../fixtures/login-page-mock.json";
import postData from "../../fixtures/buzz-post-mock.json";

describe("Buzz News Feed Test Cases", () => {

  beforeEach(() => {
    cy.visit('/')
    cy.get("input[name='username']").type(loginData.correctUsername)
    cy.get("input[name='password']").type(loginData.correctPassword)
    cy.get("button[type='submit']").click()
    cy.get("span.oxd-main-menu-item--name").contains("Buzz").click();
  });

  it("Should write a Successful Post", () => {
    cy.get(`textarea[placeholder="What's on your mind?"]`).type(postData.postText)
    cy.get('button[type="submit"]').contains('Post').click()
    cy.get('.orangehrm-buzz-post-body').first().should('contain.text', postData.postText);
  });
})