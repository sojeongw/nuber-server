import jwt from "jsonwebtoken";
import User from "../entities/User";

// 토큰으로 유저를 찾을 때마다 미들웨어에 넘기는 작업
const decodeJWT = async (token: string): Promise<User | undefined> => {
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_TOKEN || "");
        const { id } = decoded;
        const user = await User.findOne({ id });
        return user;
    } catch (error) {
        return undefined;
    }
};

export default decodeJWT;