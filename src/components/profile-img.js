export function ProfileImg(props) {
  const {
    src = "/images/user_profile.png",
    username = "user",
    ...rest
  } = props;
  return <img src={src} alt={`${username} profile`} {...rest} />;
}
