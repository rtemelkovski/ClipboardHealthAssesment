# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

As part of my refactor, I moved all hashing & empty-case handling (IE returning of "0") into a helper function, as this is something that is repeated in-code multiple times. Additionally, I used optional chaining & null coalescing to clean-up the first if-block section into a single statement. This is cleaner & more readable as it no longer has a nested if structure and is significantly shorter. I kept the logic for stringifying the candidate if it isn't a string the same but due to the nested if structure being broken up, it is now only a single layer deep which makes it easier to read. Additionally, I used a ternary operator for the last step to decide whether to return the candidate or a hashed version of it for the greater-than-max-length case. This is cleaner & more readable as it's significantly shorter and no longer part of a nested if structure.
