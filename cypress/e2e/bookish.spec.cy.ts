/// <reference types="cypress" />

const apiUrl = Cypress.env("apiUrl") || "http://localhost:8080";

// 1) 공통 함수들
const gotoApp = () => {
  cy.intercept("GET", `${apiUrl}/books*`).as("getBooks");
  cy.visit("http://localhost:3000/");
  cy.wait("@getBooks");
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
  cy.get('[data-test="search"] input').clear().type(term);
};

const gotoNthBookInTheList = (index: number) => {
  cy.get("div.book-item").eq(index).contains("View Details").click();
};

const checkBookDetail = (content: string = "") => {
  cy.url().should("include", "/books/");
  cy.get("h2.book-title").contains(content);
};

// 2) 새로 추가: 리뷰를 작성해주는 함수
const composeReview = (name: string, content: string) => {
  cy.get('input[name="name"]').type(name);
  cy.get('input[name="content"]').type(content);
  cy.get('button[name="submit"]').click();
};

// 3) 새로 추가: 리뷰 목록을 검사해주는 함수
const checkReview = () => {
  cy.get('div[data-testid="reviews-container"] .review').should("have.length", 1);
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

  it("Write a review for a book", () => {
    // 테스트 시작 전에 reviews 초기화
    cy.request("DELETE", `${apiUrl}/books/1/reviews`);

    gotoNthBookInTheList(0);
    checkBookDetail("Refactoring");

    // composeReview 함수로 리뷰 작성
    composeReview("Juntao Qiu", "Excellent work!");

    // checkReview 함수로 목록에 1개가 추가되었는지 확인
    checkReview();
  });
});
