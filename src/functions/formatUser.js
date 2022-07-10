export const formatUser = ({ user }) => {
  const [email, user_id, username, password] = user.split(",");

  return {
    email,
    user_id,
    username,
    password,
  };
};
