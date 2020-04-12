import cors from "cors";
import {GraphQLServer} from "graphql-yoga";
import logger from "morgan";
import schema from "./schema";
import helmet from "helmet";
import decodeJWT from "./utils/decodeJWT";

class App {
    public app: GraphQLServer;

    constructor() {
        this.app = new GraphQLServer({
            // 키와 값이 같으면 하나만 쓰면 된다. 원래는 schema: schema
            schema
        });
        this.middlewares();
    }

    private middlewares = (): void => {
        this.app.express.use(cors());
        this.app.express.use(logger("dev"));
        this.app.express.use(helmet());
        this.app.express.use(this.jwt);
    };

    // express 내에서 middleware를 만들면 express가 req, res, next라는 3개의 argument를 준다.
    // req가 있으면 res를 보내주고 없으면 next로 가서 다음 미들웨어를 실행한다.
    private jwt = async (req, res, next): Promise<void> => {
        const token = req.get("X-JWT");   // 임의의 이름을 넣어준다. 리액트 쪽에서도 같은 이름으로 작업 예정이다.
        if (token) {
            // 미들웨어 호출
            const user = await decodeJWT(token);
            console.log(user);
        }
        next();
    };
}

export default new App().app;
