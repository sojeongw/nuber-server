import { Options } from "graphql-yoga";
import {createConnection} from "typeorm";
import app from "./app";
import connectionOptions from "./ormConfig";
import dotenv from "dotenv";
import decodeJWT from "./utils/decodeJWT";

// 환경 변수 라이브러리 호출
dotenv.config();

// 타입은 넘버 혹은 스트링. 포트는 환경 변수 혹은 4000.
const PORT: number | string = process.env.PORT || 4000;
const PLAYGROUND_ENDPOINT: string = "/playground";
const GRAPHQL_ENDPOINT: string = "/graphql";
const SUBSCRIPTION_ENDPOINT: string = "/subscription";

const appOptions: Options = {
  port: PORT,
  playground: PLAYGROUND_ENDPOINT,
  endpoint: GRAPHQL_ENDPOINT,
  subscriptions: {
    path: SUBSCRIPTION_ENDPOINT,
    onConnect: async connectionParams => {
      const token = connectionParams["X-JWT"];
      if (token) {
        // http는 커넥션을 한 번 연결하고 나면 끝이지만 웹소켓은 계속 연결되어 있어야 한다.
        // 즉, 한 번 인증하면 서버 메모리가 그것을 기억하고 있어야 한다.
        const user = await decodeJWT(token);
        if (user) {
          return {
            // currentUser는 onConnect로 부터 리턴되어야 하며, subscription resolver의 context에 추가된다.
            // currentUser라는 키를 리턴하면 그 값인 user가 subscription resolver의 context에 추가되는 것이다.
            // 여기서는 DriversSubscription resolver의 context로 받는다.
            currentUser: user
          };
        }
      }
      throw new Error("No JWT. Can't subscribe");
    }
  }
};


// start()가 콜백을 받고 있으므로 콜백 함수
const handleAppStart = () => console.log(`Listening on port ${PORT}`);

// typeorm: 옵션을 넣으면 설정 파일이 자동으로 임포트 된다.
createConnection(connectionOptions).then(() => {
  // 데이터베이스 연결을 먼저 하고 그 다음에 앱을 실행하도록 한다.
  app.start(appOptions, handleAppStart);
}).catch(error => console.log(error));

