import { Options } from "graphql-yoga";
import app from "./app";

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

app.start(appOptions, handleAppStart);
