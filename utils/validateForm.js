/* This is where errors are checked for, and if any errors are detected 
   then they are added to the err variable and returned */
export const validateForm = (title, description = null) => {
  let err = {};

  if (!title) {
    err.title = "Title is required";
  } else if (title.length > 40) {
    err.title = "Title must be less than 40 characters";
  }
  if (description !== null) {
    if (!description) {
      err.description = "Description is required";
    } else if (description.length > 200) {
      err.description = "Description must be less than 200 characters";
    }
  }
  return err;
};
