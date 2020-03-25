import { Options } from "graphql-yoga";
import {createConnection} from "typeorm";
import app from "./app";
import connectionOptions from "./ormConfig";
import dotenv from "dotenv";

// 환경 변수 라이브러리 호출
dotenv.config();

// 타입은 넘버 혹은 스트링. 포트는 환경 변수 혹은 4000.
const PORT: number | string = process.env.PORT || 4000;
const PLAYGROUND_ENDPOINT: string = "/playground";
const GRAPHQL_ENDPOINT: string = "/graphql";

const appOptions: Options = {
  port: PORT,
  playground: PLAYGROUND_ENDPOINT,
  endpoint: GRAPHQL_ENDPOINT
};

// start()가 콜백을 받고 있으므로 콜백 함수
const handleAppStart = () => console.log(`Listening on port ${PORT}`);

// typeorm: 옵션을 넣으면 설정 파일이 자동으로 임포트 된다.
createConnection(connectionOptions).then(() => {
  // 데이터베이스 연결을 먼저 하고 그 다음에 앱을 실행하도록 한다.
  app.start(appOptions, handleAppStart);
}).catch(error => console.log(error));

