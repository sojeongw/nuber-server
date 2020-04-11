import {Resolvers} from "../../../types/resolvers";
import {FacebookConnectMutationArgs, FacebookConnectResponse} from "../../../types/graph";
import User from "../../../entities/User";
import createJWT from "../../../utils/createJWT";

const resolvers: Resolvers = {
    Mutation: {
        // 인자와 리턴값을 추가한다. parent는 쓰지 않으니 패스하고 리턴은 promise다.
        // FacebookConnect.graphql에 정의한 대로 firstName, lastName email, fbId를 받고 결과인 FacebookConnectResponse까지 받아야 한다.
        // 그것을 더블체크 할 수 있게 타입을 써준다. FacebookConnectMutationArgs는 graph.d.ts에서 정의한 타입 체크 인터페이스다.
        FacebookConnect: async (_, args: FacebookConnectMutationArgs): Promise<FacebookConnectResponse> => {
            // FacebookConnectMutationArgs에서 fbId가 String인 것을 알려준다.
            const {fbId} = args;

            // typeORM 문
            try {
                // fb 아이디를 이용해 존재하는 사용자인지 확인한다.
                const existingUser = await User.findOne({fbId});

                if (existingUser) {

                    const token = createJWT(existingUser.id);

                    // FacebookConnectResponse 타입을 리턴하기로 했으므로 아래의 내용을 리턴한다.
                    return {
                        ok: true,
                        error: null,
                        token
                    };
                }
            } catch (error) {
                return {
                    ok: false,
                    error: error.message,
                    token: null
                };
            }

            try {
                const newUser = await User.create({
                    ...args,
                    profilePhoto: `http://graph.facebook.com/${fbId}/picture?type=square`
                }).save();

                const token = createJWT(newUser.id);

                return {
                    ok: true,
                    error: null,
                    token
                }
            } catch (error) {
                return {
                    ok: false,
                    error: error.message,
                    token: null
                }
            }
        }
    }
}

export default resolvers;