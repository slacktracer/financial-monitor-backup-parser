export const formatUser = ({ user }) => {
  const [email, password, userID, username] = user.split(",");

  return {
    email,
    password,
    userID,
    username,
  };
};
