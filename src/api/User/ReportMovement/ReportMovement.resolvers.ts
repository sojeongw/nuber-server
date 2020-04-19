import User from "../../../entities/User";
import {
    ReportMovementMutationArgs,
    ReportMovementResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import cleanNullArgs from "../../../utils/cleanNullArgs";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
    Mutation: {
        ReportMovement: privateResolver(
            async (
                _,
                args: ReportMovementMutationArgs,
                { req, pubSub }
            ): Promise<ReportMovementResponse> => {
                const user: User = req.user;
                const notNull: any = cleanNullArgs(args);
                try {
                    await User.update({ id: user.id }, { ...notNull });

                    // 이전 코드에서는 변경 전의 user를 publish 하도록 되어있어서 이전 정보가 출력되었다.
                    // 아래처럼 업데이트 된 유저로 publish 하도록 수정한다.
                    const updatedUser = await User.findOne({ id : user.id });

                    // driverUpdate라는 채널에 DriversSubscription라는 user타입 정보를 payload로 보내서 publish 한다.
                    // 이때 payload 이름(DriversSubscription)은 DriversSubscription.graphql에 subscription 타입으로 정의한 것과 일치해야 한다.
                    pubSub.publish("driverUpdate", { DriversSubscription: updatedUser });

                    return {
                        ok: true,
                        error: null
                    };
                } catch (error) {
                    return {
                        ok: false,
                        error: error.message
                    };
                }
            }
        )
    }
};

export default resolvers;