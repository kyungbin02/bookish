// server.js

const jsonServer = require("json-server");
const cors = require("cors");
const bodyParser = require("body-parser");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// 포트 설정 (환경 변수에서 가져오거나 기본값 8080 사용)
const PORT = process.env.PORT || 8080;

// 미들웨어 설정
server.use(cors());
server.use(middlewares);

// 예제에서처럼 body-parser 사용
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// 리뷰 추가 기능 (POST /books/:id/reviews)
server.post("/books/:id/reviews", (req, res) => {
  const { id } = req.params;
  const { name, content } = req.body;

  const book = router.db.get("books").find({ id: parseInt(id) }).value();

  if (book) {
    if (!book.reviews) {
      book.reviews = [];
    }

    const review = {
      id: book.reviews.length + 1,
      bookId: parseInt(id),
      name,
      content,
    };

    book.reviews.push(review);
    router.db.write();

    return res.status(201).json(review);
  } else {
    return res.status(404).json({ error: "Book not found" });
  }
});

// DELETE /books/:id/reviews 로 리뷰 초기화
server.delete("/books/:id/reviews", (req, res) => {
  const { id } = req.params;
  const book = router.db.get("books").find({ id: parseInt(id) }).value();

  if (book) {
    book.reviews = [];
    router.db.write();
    return res.sendStatus(204);
  } else {
    return res.status(404).json({ error: "Book not found" });
  }
});

// 마지막에 router 등록
server.use(router);

// 서버 실행
server.listen(PORT, () => {
  console.log(`📢 JSON Server is running on port ${PORT}`);
});
