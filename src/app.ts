import cors from "cors";
import {NextFunction} from "express"
import {GraphQLServer, PubSub} from "graphql-yoga";
import logger from "morgan";
import schema from "./schema";
import helmet from "helmet";
import decodeJWT from "./utils/decodeJWT";

class App {
    public app: GraphQLServer;
    /*
    subscription 작업
    pubSub은 메모리 누수 때문에 데모용으로만 쓰 실제 제품 단에선 redis 등을 사용한다.

    subscription은 http가 아닌 웹소켓을 통해 실시간으로 만들어지는데
    지금은 우리 헤더나 토큰 때문에 http에서 모든 인증을 처리하고 있다.

    웹 소켓을 만드는 단계를 하고 나면 인증이 필요하다는 걸 알게 된다.
    listening 하고 있는 모두에게 메시지를 보내고 싶은 게 아니기 때문이다.
    */
    public pubSub: any;

    constructor() {
        this.pubSub = new PubSub();
        this.pubSub.ee.setMaxListeners(99);

        // 리퀘스트에 값을 넣고 나면 graphQL server로 간다.
        this.app = new GraphQLServer({
            schema,  // 키와 값이 같으면 하나만 쓰면 된다. 원래는 schema: schema
            // context란 graphQL resolvers가 가지고 있는 기본적인 서버 정보다. context.req.user 등 여러 정보를 활용할 수 있다.
            // 정리하자면 요청 오브젝트를 컨텍스트로 보내면 모든 리졸버로 보내진다.
            // req를 argument로 가지는 함수를 넘긴다.
            context: req => {
                return {
                    req: req.request,
                    pubSub: this.pubSub // DriversSubscription.resolver에서 context로 받을 정보
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
