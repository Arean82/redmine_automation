describe("Automation editor", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.get("#username").type("test");
    cy.get("#password").type("12345678");
    cy.get("input[name=login]").click();
  });

  it("loads the editor for an existing rule", () => {
    cy.visit("/automation_rules");
    cy.contains("New Rule").click();
    cy.contains("WHEN (trigger)");
    cy.contains("IF (condition)");
    cy.contains("FOR EACH (branch)");
    cy.contains("THEN (action)");
  });

  it("adds, selects and removes a trigger", () => {
    cy.visit("/automation_rules");
    cy.contains("New Rule").click();

    // Add the default trigger
    cy.contains("WHEN (trigger)").parent().find("button").contains("Add").click();
    cy.contains("Issue created");

    // Remove it again
    cy.contains("Issue created").parent().find("button").contains("remove").click();
    cy.contains("Issue created").should("not.exist");
  });

  it("adds an action and saves", () => {
    cy.visit("/automation_rules");
    cy.contains("New Rule").click();

    cy.contains("THEN (action)").parent().find("select").select("COMMENT_ISSUE");
    cy.contains("THEN (action)").parent().find("button").contains("Add").click();
    cy.contains("Comment on issue");

    cy.contains("Save").click();
    cy.contains("Comment on issue");
  });
});
