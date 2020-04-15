import {sendVerificationEmail} from "../../../utils/sendEmail";
import privateResolver from "../../../utils/privateResolver";
import {Resolvers} from "../../../types/resolvers";
import Verification from "../../../entities/Verification";
import User from "../../../entities/User";

class RequestEmailVerificationResponse {
}

const resolvers: Resolvers = {
    Mutation: {
        RequestEmailVerification: privateResolver(
            async (_, __, { req }): Promise<RequestEmailVerificationResponse> => {
                const user: User = req.user;
                if (user.email && !user.verifiedEmail) {    // 이미 인증 되었다면 보낼 필요가 없다.
                    try {
                        // 오래된 인증은 삭제한다.
                        const oldVerification = await Verification.findOne({
                            payload: user.email
                        });

                        if (oldVerification) {
                            oldVerification.remove();
                        }

                        const newVerification = await Verification.create({
                            payload: user.email,
                            target: "EMAIL"
                        }).save();

                        await sendVerificationEmail(user.fullName, newVerification.key);

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
                } else {
                    return {
                        ok: false,
                        error: "Your user has no email to verify"
                    };
                }
            }
        )
    }
};

export default resolvers;