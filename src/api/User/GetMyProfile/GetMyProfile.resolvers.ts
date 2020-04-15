import {Resolvers} from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
    Query: {
        // 미들웨어로 작동하는 resolver 하나가 argument로 전달되고 해당 유저의 request를 찾았을 때 아래의 함수를 실행한다.
        // { req } 컨텍스트를 열어서 그 안의 req를 가져온다.
        // 여기서 처음에 실제로 실행하는 건 privateResolver 자체이지 그 뒤의 내용이 아니다. privateResolver에서 유저 체크를 하면
        GetMyProfile: privateResolver(async (_, __, {req}) => {
            // req를 열어서 user를 가져온다.
            const {user} = req;
            return {
                ok: true,
                error: null,
                user
            };
        })
    }
};
export default resolvers;