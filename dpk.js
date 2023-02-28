const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const MAX_PARTITION_KEY_LENGTH = 256;
  // helper function to perform hashing
  const createHash = (data) => {
    if (!data) {
      return "0";
    }

    return crypto.createHash("sha3-512").update(data).digest("hex");
  };

  // extract candidate from partition key or hashed event & stringify it if it is not a string
  let candidate = event?.partitionKey ?? createHash(JSON.stringify(event));
  if (typeof candidate !== "string") {
    candidate = JSON.stringify(candidate);
  }

  // return the candidate or it's hash if it is over the max length
  return candidate.length > MAX_PARTITION_KEY_LENGTH
    ? createHash(candidate)
    : candidate;
};
