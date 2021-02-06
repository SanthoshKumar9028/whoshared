export function assignUserProps(user, setUser) {
  if (typeof user !== "object") throw Error("user must be an object");
  user.isLogedIn = true;
  user.changeUser = setUser;
  user.logout = async function () {
    try {
      await fetch("/auth/logout-user");
    } finally {
      setUser({ isLogedIn: false });
    }
  };
}
