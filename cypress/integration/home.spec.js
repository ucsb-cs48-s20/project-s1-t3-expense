describe("Home Page Guest", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("has a nav bar", () => {
    cy.get("nav.navbar").should("exist");
  });

  it("has a home page brand button on nav bar", () => {
    cy.get("nav.navbar * a.navbar-brand").should("exist");
  });

  it("has a 'Temporary Bills' button on nav bar", () => {
    cy.get("nav.navbar * a.nav-link").should("exist");
    cy.get("nav.navbar").contains("Temporary Bills");
  });

  it("has a 'Login' button on nav bar", () => {
    cy.get("nav.navbar * a.nav-link").should("exist");
    cy.get("nav.navbar").contains("Login");
  });

  it("has a jumbotron", () => {
    cy.get(".Jumbotron").should("exist");
  });
});
