
import { testConn } from "./test-conn";

// sometimes node doesn't quit after finishing with the promise, hence the exit call
testConn(true).then(() => process.exit());
