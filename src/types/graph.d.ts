export const typeDefs = ["type Query {\n  sayBye: String!\n  sayHello(name: String!): SayHelloResponse!\n}\n\ntype SayHelloResponse {\n  text: String!\n  error: Boolean!\n}\n"];
/* tslint:disable */

export interface Query {
  sayBye: string;
  sayHello: SayHelloResponse;
}

// 인자 수정 시 생성
export interface SayHelloQueryArgs {
  name: string;
}

// 리턴 값 수정 시 생성
export interface SayHelloResponse {
  text: string;
  error: boolean;
}
