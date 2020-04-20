const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
  let errors = {};
  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.feildofstudy = !isEmpty(data.feildofstudy) ? data.feildofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (validator.isEmpty(data.school)) {
    errors.school = "School Feild is required.";
  }

  if (validator.isEmpty(data.degree)) {
    errors.degree = "Degree Feild is required.";
  }

  if (validator.isEmpty(data.feildofstudy)) {
    errors.feildofstudy = "Feildofstudy Feild is required.";
  }

  if (validator.isEmpty(data.from)) {
    errors.from = "From Feild is required.";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
