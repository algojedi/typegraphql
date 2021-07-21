import { Connection } from "typeorm";
import { testConn } from "../../../test-utils/test-conn";
import { gCall } from "../../../test-utils/gCall";

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});
afterAll(async () => {
  await conn.close();
});


/**
 * 
const registerMutation = `
mutation Register($data: AppUserArgs!) {
  register(
    data: $data
  ) {
    id
    firstName
    lastName
    email
    name
  }
}
`;
 * 
 */

const registerMutation = `
mutation {
  register(
    email: "test@hotmail.com"
    firstName: "test"
    lastName: "mcTester"
    password: "testing"
  ) {
    name
  }
}
`

describe("Register", () => {
  it("create user", async () => {
    console.log(
      await gCall({
        source: registerMutation
        // variableValues: {
        //   // data: {
        //     firstName: "bob",
        //     lastName: "bob2",
        //     email: "bob@bob.com",
        //     password: "asdfasdf"
        //   }
        // }
      })
    );
  });
});