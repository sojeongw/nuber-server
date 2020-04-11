import jwt from "jsonwebtoken";

// 함수에 id를 넣으면 string인 토큰값을 리턴한다.
const createJWT = (id: number): string => {
    const token = jwt.sign(
        {
            id
        },
        process.env.JWT_TOKEN
    );
    return token;
};

export default createJWT;