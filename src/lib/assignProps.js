export function assignUserProps(user, setUser) {
  if (typeof user !== "object") throw Error("user must be an object");
  user.isLogedIn = true;
  user.changeUser = setUser;
  user.logout = function () {
    fetch("/auth/logout-user");

    setUser({
      isLogedIn: false,
      username: null,
      originalname: null,
      logout: () => {},
    });
  };
}
