const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the partitionKey when one is provided in the event with length < 256 length", () => {
    const key = deterministicPartitionKey({ partitionKey: "test" });
    expect(key).toBe("test");
  });

  it("Returns the partitionKey when one is provided in the event with length exactly 256 length", () => {
    const partitionKey = "X".repeat(256);
    const key = deterministicPartitionKey({ partitionKey });
    expect(key).toBe(partitionKey);
  });

  it("Returns the hashed partitionKey when a partition key is provided in the event with length > 256 length", () => {
    const partitionKey = "";
    const hashedKey = crypto
      .createHash("sha3-512")
      .update(partitionKey)
      .digest("hex");
    const key = deterministicPartitionKey({ partitionKey: hashedKey });
    expect(key).toBe(hashedKey);
  });

  it("Returns a hashed version of the JSON stringified event if a partition key isn't provided", () => {
    const event = { timestamp: new Date(), id: "abcd" };
    const hashedKey = crypto
      .createHash("sha3-512")
      .update(JSON.stringify(event))
      .digest("hex");
    const key = deterministicPartitionKey(event);
    expect(key).toBe(hashedKey);
  });

  it("Returns the JSON stringified partition key if the partition key isn't a string and the stringified key is <= 256 length", () => {
    const event = { partitionKey: { timestamp: new Date(), id: "abcd" } };
    const stringifiedKey = JSON.stringify(event.partitionKey);
    const key = deterministicPartitionKey(event);
    expect(key).toBe(stringifiedKey);
  });

  it("Returns a hashed version of the JSON stringified partition key if the partition key isn't a string and the stringified key is > 256 length", () => {
    const event = {
      partitionKey: { timestamp: new Date(), id: "X".repeat(256) },
    };
    const hashedKey = crypto
      .createHash("sha3-512")
      .update(JSON.stringify(event.partitionKey))
      .digest("hex");
    const key = deterministicPartitionKey(event);
    expect(key).toBe(hashedKey);
  });
});
