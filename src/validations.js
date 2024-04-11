 
/***
 * @typedef {import("./schema.d.ts").components} Components
 **/

/** @param {Components["schemas"]["NewThread"]} thread */
const validateNewThread = (thread) => {
  const { title, text } = thread;

  if (typeof title === "string" && title && title.length > 3 && text && text.length > 3) {
    return 0;
  } else {
    throw Error("new thread is invalid");
  }
}

/** @param {Components["schemas"]["NewPost"]} post */
const validateNewPost = (post) => {
  const { text } = post;

  if (text && text.length > 3) {
    return 0;
  } else {
    throw Error("new thread is invalid");
  }
}

module.exports = {
  validateNewThread,
  validateNewPost
}