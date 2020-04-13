import { Resolvers } from "../../../types/resolvers";

const resolvers: Resolvers = {
    Query: {
        // { req } 컨텍스트를 열어서 그 안의 req를 가져온다.
        GetMyProfile: async (_, __, { req }) => {
            // req를 열어서 user를 가져온다.
            const { user } = req;
            return {
                ok: true,
                error: null,
                user
            };
        }
    }
};
export default resolvers;