import cors from "cors";
import {NextFunction} from "express"
import {GraphQLServer} from "graphql-yoga";
import logger from "morgan";
import schema from "./schema";
import helmet from "helmet";
import decodeJWT from "./utils/decodeJWT";

class App {
    public app: GraphQLServer;

    constructor() {
        // 리퀘스트에 값을 넣고 나면 graphQL server로 간다.
        this.app = new GraphQLServer({
            schema,  // 키와 값이 같으면 하나만 쓰면 된다. 원래는 schema: schema
            // context란 graphQL resolvers가 가지고 있는 기본적인 서버 정보다. context.req.user 등 여러 정보를 활용할 수 있다.
            // 정리하자면 요청 오브젝트를 컨텍스트로 보내면 모든 리졸버로 보내진다.
            // req를 argument로 가지는 함수를 넘긴다.
            context: req => {
                return {
                    req: req.request
                }
            }
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
    private jwt = async (req, res: Response, next: NextFunction): Promise<void> => {
        const token = req.get("X-JWT");   // 임의의 이름을 넣어준다. 리액트 쪽에서도 같은 이름으로 작업 예정이다.
        if (token) {
            // 미들웨어 호출
            const user = await decodeJWT(token);
            if (user) {
                // 리퀘스트에 유저를 담는다.
                req.user = user;
            } else {
                req.user = undefined;
            }
        }
        next();
    };
}

export default new App().app;
