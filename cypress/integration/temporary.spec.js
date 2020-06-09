describe("Temporary Bill", () => {
  context("When guest goes to Temporary Bill Page", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/new-temporary");
    });

    it("shows me a form", () => {
      cy.get("form");
    });

    it("shows me a 'Create' button", () => {
      cy.get('button[type="submit"]');
      cy.get("form").contains("Create");
    });

    it("allows me to fill the form", () => {
      cy.get("form");

      cy.get('input[name="title"]')
        .type("Grocery")
        .should("have.value", "Grocery");

      cy.get('input[name="groupSize"]')
        .clear()
        .type("1")
        .should("have.value", "1");

      cy.get('input[name="members"]')
        .type("Gavin")
        .should("have.value", "Gavin");

      cy.get('input[name="dollarAmount"]')
        .clear()
        .type("30")
        .should("have.value", "30");

      // description is removed from 'Temporary Bill'
      // cy.get('textarea[name="description"]')
      //   .type("Apple and Banana")
      //   .should("have.value", "Apple and Banana");

      cy.get("form").submit();
    });

    // When the Custom button is clicked
    // the amount for each member can be
    // customized
    it(`allows me to get another field when 'Custom' 
        button is clicked`, () => {
      cy.get('[type="radio"]', { force: true }).check({ force: true });

      cy.get('input[name="expense"]')
        .clear()
        .type("20")
        .should("have.value", "20");

      cy.get("form").submit();
    });

    it(`allows me to go to the result page when 'Create' 
        button is clicked`, () => {
      cy.get('input[name="title"]').type("Drinks");

      cy.get('input[name="dollarAmount"]').clear().type("20");

      // cy.get('textarea[name="description"]').type("Coke");

      cy.get('button[type="submit"]')
        .click()
        .location("pathname")
        .should("eq", "/bill-temporary");
    });
  });

  context("When guest goes to result page", () => {
    let title = "Grocery";
    let amount = 30;
    // let description = "Apple and Banana";
    beforeEach(() => {
      cy.visit("http://localhost:3000/new-temporary");
      cy.get('input[name="title"]').type(title);

      cy.get('input[name="dollarAmount"]').clear().type(amount.toString());

      // cy.get('textarea[name="description"]').type(description);

      cy.get('button[type="submit"]').click();
    });

    it("allows me to see the result page", () => {
      // Examine the information of the result page
      cy.get("h4").contains("Group Size: 1");

      cy.get("h4").contains(`Total Amount: $${amount}`);

      cy.get("h4").contains(`Remaining Balance: $${amount}`);

      cy.get("h4").contains("Members:");

      cy.get("p").contains(`: $${amount}.00`);

      // cy.get("p").contains(description);
    });

    it("has a delete button", () => {
      cy.get("button").contains("Delete");
    });
  });
});
