export class UniqueError extends Error {
  constructor(message) {
    super(message);
    this.code = 1100;
  }
}
export class UserValidationError extends Error {
  constructor(path, message) {
    super("user validation failed");
    this.errors = {
      [path]: {
        properties: {
          path,
          message,
        },
      },
    };
  }
}

export function validateUserName(username, cb = () => {}) {
  if (typeof username != "string") {
    cb();
    throw new UserValidationError("username", "invalid username");
  }

  if (username.length < 5) {
    cb();
    throw new UserValidationError(
      "username",
      "user name should be more than 4 charecters"
    );
  }
  if (username.length > 15) {
    cb();
    throw new UserValidationError(
      "username",
      "user name should be less than 16 charecters"
    );
  }
}
export function validatePassword(password, cb = () => {}) {
  if (password.length < 7) {
    cb();
    throw new UserValidationError(
      "password",
      "password should be more than 6 charecters"
    );
  }
}

export function handleError(e) {
  let errors = {
    username: "",
    originalname: "",
    password: "",
  };

  //handling errors for login
  if (e.message === "invalid username") {
    errors.username = "invalid username";
    return errors;
  }
  if (e.message === "invalid password") {
    errors.password = "invalid password";
    return errors;
  }

  //handling errors for adding the user
  if (e.code === 11000) {
    errors.username = "user name is alredy taken";
    return errors;
  }

  if (e.message.includes("user validation failed")) {
    Object.values(e.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}
