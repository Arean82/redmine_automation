describe("Automation editor", () => {
  const login = () => {
    cy.visit("/login");
    cy.get("#username").type("test");
    cy.get("#password").type("12345678");
    cy.get("input[name=login]").click();
  };

  const createRule = (name) => {
    cy.visit("/automation_rules");
    cy.get(".contextual .icon-add").click();
    cy.get("#automation_rule_form").should("be.visible");
    cy.get('input[name="automation_rule[name]"]').type(name);
    cy.get("input[testid=submit-automation]").click();
  };

  const openRule = (name) => {
    cy.visit("/automation_rules");
    cy.contains(name, { timeout: 15000 }).click();
    cy.contains("WHEN (trigger)", { timeout: 15000 });
  };

  it("loads the editor for a rule", () => {
    login();
    createRule("Editor Rule");
    openRule("Editor Rule");
    cy.contains("IF (condition)");
    cy.contains("FOR EACH (branch)");
    cy.contains("THEN (action)");
  });

  it("adds, selects and removes a trigger", () => {
    login();
    createRule("Editor Rule 2");
    openRule("Editor Rule 2");

    cy.contains("WHEN (trigger)").parent().find("button").contains("Add").click();
    cy.contains("Issue created");

    cy.contains("Issue created").parent().find("button").contains("remove").click();
    cy.contains("Issue created").should("not.exist");
  });

  it("adds an action and saves", () => {
    login();
    createRule("Editor Rule 3");
    openRule("Editor Rule 3");

    cy.contains("THEN (action)").parent().find("select").select("COMMENT_ISSUE");
    cy.contains("THEN (action)").parent().find("button").contains("Add").click();
    cy.contains("Comment on issue");

    cy.contains("Save").click();
    cy.contains("Comment on issue");
  });
});
