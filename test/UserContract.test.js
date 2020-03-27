const assert = require("assert");
const Web = require("web3");
const AssertionError = require("assert").AssertionError;

const provider = new Web.providers.HttpProvider("HTTP://127.0.0.1:7545");
const web3 = new Web(provider);

const { interface, bytecode } = require("../scripts/compile");

let accounts;
let usersContracts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  usersContracts = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Usuario del contrato", async () => {
  it("Se hizo deploy", () => {
    console.log(usersContracts.options.address);
    assert.ok(usersContracts.options.address);
  });

  it("Se unio un usuario", async () => {
    let name = "Robin";
    let surname = "Montijo";
    await usersContracts.methods
      .join(name, surname)
      .send({ from: accounts[0], gas: "500000" });
  });

  it("Recuperar usuario", async () => {
    let name = "Robin";
    let surName = "Montijo";

    await usersContracts.methods
      .join(name, surName)
      .send({ from: accounts[0], gas: "5000000" });

    let user = await usersContracts.methods.getUser(accounts[0]).call();
    assert.equal(name, user[0]);
    assert.equal(surName, user[1]);
  });

  it("should not allow joining an account twice", async () => {
    await usersContracts.methods
      .join("Pedro", "Lopez")
      .send({ from: accounts[1], gas: "5000000" });

    try {
      await usersContracts.methods
        .join("Ana", "Gomez")
        .send({ from: accounts[1], gas: "5000000" });
      assert.fail("la misma cuenta no se puede registrar dos veces");
    } catch (e) {
      if (e instanceof AssertionError) {
        assert.fail(e.message);
      }
    }
  });

  it("should retrieve total registered users", async () => {
    await usersContract.methods
      .join("Ana", "Gomez")
      .send({ from: accounts[0], gas: "500000" });

    await usersContract.methods
      .join("Mario", "Bros")
      .send({ from: accounts[1], gas: "500000" });

    let total = await usersContract.methods.totalUsers().call();
    assert.equal(total, 2);
  });

  it("should not allow retrieving a not registered user", async () => {
    try {
      await usersContract.methods.getUser(accounts[0]).call();
      assert.fail("user should not be registered");
    } catch (e) {
      if (e instanceof AssertionError) {
        assert.fail(e.message);
      }
    }
  });
});
