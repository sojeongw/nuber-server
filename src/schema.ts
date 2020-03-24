// api 폴더 안의 모든 폴더를 살펴본 후 graphql, resolver 파일을 찾아서 app에 전달한다.
import {makeExecutableSchema} from "graphql-tools"
import {fileLoader, mergeResolvers, mergeTypes} from "merge-graphql-schemas";
import path from "path";

// 쿼리, 뮤테이션 등 모든 타입을 담을 변수
const allTypes: any = fileLoader(
    // api 폴더 안에서 깊이에 상관없이 모든 폴더의 .graphql 파일을 가져온다.
    path.join(__dirname, "./api/**/*.graphql")
);

// 지금은 ts지만 나중에 배포용으로 빌드하면 js로 바뀌기 때문에 확장자 부분을 *로 한다.
const allResolvers: any = fileLoader(
    path.join(__dirname, "./api/**/*.resolvers.*")
);

// api 폴더 안의 모든 graphql과 resolver를 불러와 합침
const mergedTypes: any = mergeTypes(allTypes, {all: true});
const mergedResolvers: any = mergeResolvers(allResolvers);

// allTypes처럼 스키마를 하나로 합쳐주는 역할을 한다.
const schema = makeExecutableSchema({
    typeDefs: mergedTypes,
    resolvers: mergedResolvers
});

export default schema;