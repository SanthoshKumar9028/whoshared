//to verify the user
export function get_is_user(req, res) {
  res.send("hi");
}

//to add a new user
export function post_add_user(req, res) {}

//to log in the user
export function post_login_user(req, res) {}

export default { get_is_user, post_add_user, post_login_user };
