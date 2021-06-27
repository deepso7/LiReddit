import { UsernamePasswordInput } from "../utils/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Invalid Email",
      },
    ];
  }

  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "Username must be greater than 2",
      },
    ];
  }

  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "Username cannot include @",
      },
    ];
  }

  if (options.password.length < 3) {
    return [
      {
        field: "password",
        message: "Password must be greater than or equal to 3",
      },
    ];
  }

  return null;
};
