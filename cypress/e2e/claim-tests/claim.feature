Feature: Claim Page

  Scenario: Employee submits a claim and admin approves it
    Given a new employee, event type, and expense type
    And the employee has valid login credentials
    When the employee logs in
    And navigates to the Claim Page
    And submits a claim request for the created event using the correct currency
    And add expense with created expense type and set amount
    And logs out
    And the admin logs in
    And navigates to the Claim Page
    And approves the submitted claim
    Then the claim should appear with status "Approved" and with the given amount

  Scenario: Employee submits a claim and admin rejects it
    Given a new employee, event type
    And the employee has valid login credentials
    When the employee logs in
    And navigates to the Claim Page
    And submits a claim request for the created event using the correct currency
    And logs out
    And the admin logs in
    And navigates to the Claim Page
    And rejects the submitted claim
    Then the claim should appear with status "Rejected"  