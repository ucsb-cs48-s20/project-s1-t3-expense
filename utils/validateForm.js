export const validateForm = (title, description) => {
  let err = {};

  if (!title) {
    err.title = "Title is required";
  } else if (title.length > 40) {
    err.title = "Title must be less than 40 characters";
  }
  if (!description) {
    err.description = "Description is required";
  } else if (description.length > 200) {
    err.description = "Description must be less than 200 characters";
  }
  return err;
};
