Feature: Recruitment Page

  Scenario: Candidate gets Shortlisted, passed interview, declines job offer, and gets rejected
    Given the user is logged into the system
    And there is a candidate with status Shortlisted

    When the user schedules an interview
    And marks the interview as Mark Interview Passed
    And offers the candidate a job
    And marks the job offer as Declined
    And rejects the candidate

    Then the candidate status should be Rejected
