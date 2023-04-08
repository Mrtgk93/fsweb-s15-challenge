const supertest = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");
// testleri buraya yazın

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db.seed.run();
});

test("[0] Testler çalışır durumda]", () => {
  expect(true).toBe(true);
});
describe("Auth test", () => {
  it("[1] Register payload dolu başarılı sonuç veriyor mu ? /", async () => {
    let sampleUser = { username: "ali12", password: "1234", rolename: "user" };
    const res = await supertest(server)
      .post("/api/auth/register")
      .send(sampleUser);
    expect(res.status).toBe(201);
    expect(res.body.user_id).toBeGreaterThan(0);
  }, 1000);
  it("[2] Register payload eksik gönderilince doğru hata kodu ve mesajı ? /", async () => {
    let sampleUser = { username: "ali12", rolename: "user" };
    const res = await supertest(server)
      .post("/api/auth/register")
      .send(sampleUser);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("username veya password eksik");
  }, 1000);
  it("[3] Login için yanlış bir username gönderildiğinde doğru hata kodu ve mesajını dönüyor mu ? /", async () => {
    let sampleUser = { username: "ali123", password: "123" };
    const res = await supertest(server)
      .post("/api/auth/login")
      .send(sampleUser);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Böyle bir user yok");
  }, 1000);
  it("[4] Login olurken yanlış şifre girilince doğru hata kodu ve mesajını dönüyor mu ? /", async () => {
    let sampleUser = { username: "mertgok", password: "123" };
    const res = await supertest(server)
      .post("/api/auth/login")
      .send(sampleUser);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Geçersiz kriter");
  }, 1000);
  it("[5] Bilmecelere get isteği atıldığında token eksikse doğru hata kodu ve mesajı dönüyor mu ? /", async () => {
    const res = await supertest(server).get("/api/bilmeceler");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("token gereklidir");
  }, 1000);
  it("[6] Bilmeceler token ile listeleniyor mu ? /", async () => {
    let sampleUser = {
      username: "mertgok",
      password: "1234",
    };
    const loginResult = await supertest(server)
      .post("/api/auth/login")
      .send(sampleUser);
    const res = await supertest(server)
      .get("/api/bilmeceler")
      .set("authorization", loginResult.body.token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
  }, 1000);
});
