import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  const tokenHeader = req.headers.authorization || "";
  const token = tokenHeader.split(" ")[1];

  let user = null;
  try {
    if (token) {
      const userDecoded = jwt.verify(token, process.env.JWT_SECRET);
      user = userDecoded;
    }
  } catch (error) {
    throw new GraphQLError("Invalid token!");
  }

  req.user = user;
  next();
};

export { jwtAuth };
