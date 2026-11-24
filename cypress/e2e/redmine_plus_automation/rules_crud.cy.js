describe("Rules CRUD operations", () => {
  const login = () => {
    cy.visit("/login");
    cy.get("#username").type("test");
    cy.get("#password").type("12345678");
    cy.get("input[name=login]").click();
  };

  const openNewRuleForm = () => {
    cy.get(".contextual .icon-add").click();
    cy.get("#automation_rule_form").should("be.visible");
  };

  describe("global rules", () => {
    beforeEach(() => {
      login();
      cy.visit("/automation_rules");
    });

    it("creates a new rule for all projects", () => {
      openNewRuleForm();
      cy.get('input[name="automation_rule[name]"]').type("New Rule");
      cy.get("#automation_rule_description").type("This is a new rule");
      cy.get("#automation_rule_is_for_all").check();
      cy.get("input[testid=submit-automation]").click();

      cy.visit("/automation_rules");
      cy.contains("New Rule", { timeout: 15000 });
    });

    it("checks the rule in the project", () => {
      cy.visit("/projects/test-project-1/automation_rules");
      cy.contains("New Rule", { timeout: 15000 });
      cy.contains("No data to display").should("not.exist");

      cy.visit("/projects/test-project-2/automation_rules");
      cy.contains("New Rule", { timeout: 15000 });
      cy.contains("No data to display").should("not.exist");
    });

    it("edits a rule from index page", () => {
      cy.get(".icon-actions").first().click();
      cy.get("#context-menu .icon-settings").click();
      cy.get("#automation_rule_name").clear().type("Edited Rule");
      cy.get("#automation_rule_description").clear().type("This is an edited rule");
      cy.get("#automation_rule_form input[name=commit]").click();
      cy.contains("Edited Rule", { timeout: 15000 });
    });

    it("edits a rule from show page", () => {
      cy.contains("Edited Rule", { timeout: 15000 }).click();
      cy.get(".contextual .icon-actions").first().click();
      cy.get(".contextual .icon-settings").click();
      cy.get("#automation_rule_name").clear().type("Edited Rule in show page");
      cy.get("#automation_rule_description").clear().type("This is an edited rule in show page");
      cy.get("#automation_rule_form input[name=commit]").click();
      cy.contains("Edited Rule in show page", { timeout: 15000 });
    });

    it("deletes a rule", () => {
      cy.get(".icon-actions").first().click();
      cy.get(".icon-del").click();
      cy.contains("No data to display", { timeout: 15000 });
    });
  });

  describe("project rules", () => {
    beforeEach(() => {
      login();
      cy.visit("/projects/test-project-1/automation_rules");
    });

    it("creates a new rule for a project", () => {
      openNewRuleForm();
      cy.get('input[name="automation_rule[name]"]').type("New Rule");
      cy.get("#automation_rule_description").type("This is a new rule");
      cy.get("input[testid=submit-automation]").click();

      cy.visit("/projects/test-project-1/automation_rules");
      cy.contains("New Rule", { timeout: 15000 });
    });

    it("checks the rule in the project", () => {
      cy.contains("New Rule", { timeout: 15000 });
      cy.contains("No data to display").should("not.exist");
    });

    it("checks the rule a different project", () => {
      cy.visit("/projects/test-project-2/automation_rules");
      cy.contains("No data to display", { timeout: 15000 });
    });

    it("edits a rule from index page", () => {
      cy.get(".icon-actions").first().click();
      cy.get("#context-menu .icon-settings").click();
      cy.get("#automation_rule_name").clear().type("Edited Rule");
      cy.get("#automation_rule_description").clear().type("This is an edited rule");
      cy.get("#automation_rule_form input[name=commit]").click();
      cy.contains("Edited Rule", { timeout: 15000 });
    });

    it("edits a rule from show page", () => {
      cy.contains("Edited Rule", { timeout: 15000 }).click();
      cy.get(".contextual .icon-actions").first().click();
      cy.get(".contextual .icon-settings").click();
      cy.get("#automation_rule_name").clear().type("Edited Rule in show page");
      cy.get("#automation_rule_description").clear().type("This is an edited rule in show page");
      cy.get("#automation_rule_form input[name=commit]").click();
      cy.contains("Edited Rule in show page", { timeout: 15000 });
    });

    it("deletes a rule", () => {
      cy.get(".icon-actions").first().click();
      cy.get(".icon-del").click();
      cy.contains("No data to display", { timeout: 15000 });
    });
  });
});
