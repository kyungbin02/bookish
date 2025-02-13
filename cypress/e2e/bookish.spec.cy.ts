/// <reference types="cypress" />
import axios from "axios";


const gotoApp = () => {
  cy.visit("http://localhost:3000/");
};


const checkAppTitle = () => {
  cy.get('h2[data-test="heading"]').contains("Bookish");
};


const checkBookListWith = (expectation: string[] = []) => {
  cy.get('div[data-test="book-list"]').should("be.visible");
  cy.get("div.book-item").should((books) => {
    expect(books).to.have.length(expectation.length);

 
    const titles = [...books].map((el) =>
      el.querySelector("h2")?.innerHTML.trim()
    );

    expect(titles).to.deep.equal(expectation);
  });
};


const performSearch = (term: string) => {
  cy.get('[data-test="search"] input').type(term);
};


const gotoNthBookInTheList = (index: number) => {
  cy.get("div.book-item").contains("View Details").eq(index).click();
};


const checkBookDetail = (content: string = "") => {
  cy.url().should("include", "/books/1");
  cy.get("h2.book-title").contains(content);
};

describe("Bookish application", () => {
  beforeEach(() => {
    gotoApp();
  });

  it("Visits the bookish", () => {
    checkAppTitle();
  });

  it("Shows a book list", () => {
    checkBookListWith([
      "Refactoring",
      "Domain-driven design",
      "Building Microservices",
      "Acceptance Test Driven Development with React",
    ]);
  });

  it("Goes to the detail page", () => {
    gotoNthBookInTheList(0); 
    checkBookDetail("Refactoring");
  });

  it("Searches for a title", () => {

    checkBookListWith([
      "Refactoring",
      "Domain-driven design",
      "Building Microservices",
      "Acceptance Test Driven Development with React",
    ]);


    performSearch("Refactoring");

  
    checkBookListWith(["Refactoring"]);
  });
});