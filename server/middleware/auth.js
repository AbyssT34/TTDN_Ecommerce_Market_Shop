import jwt from "jsonwebtoken";

const auth = async (request, response, next) => {
  try {
    const token =
      request.cookies?.accessToken ||
      request.headers?.authorization?.split(" ")[1] ||
      request.query?.token;


    if (!token) {
      return response.status(401).json({
        message: "Provide token",
        error: true,
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    request.userId = decode.id;
    next();
  } catch (error) {
    console.log("auth error:", error.message); // ← xem lỗi cụ thể
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};
export default auth;