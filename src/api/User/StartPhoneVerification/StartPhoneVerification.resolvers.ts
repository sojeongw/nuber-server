import Verification from "../../../entities/Verification";
import {
    StartPhoneVerificationMutationArgs,
    StartPhoneVerificationResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import {sendSMS} from "../../../utils/sendSMS";

const resolvers: Resolvers = {
    Mutation: {
        StartPhoneVerification: async (
            _,
            args: StartPhoneVerificationMutationArgs
        ): Promise<StartPhoneVerificationResponse> => {
            const { phoneNumber } = args;
            try {
                const existingVerification = await Verification.findOne({
                    payload: phoneNumber
                });
                if (existingVerification) {
                    existingVerification.remove();
                }
                const newVerification = await Verification.create({
                    payload: phoneNumber,
                    target: "PHONE"
                }).save();

                // 끝나길 기다렸다가 다음 행동인 return을 수행한다.
                await sendSMS(newVerification.payload, newVerification.key);
                return {
                    ok: true,
                    error: null
                }
            } catch (error) {
                return {
                    ok: false,
                    error: error.message
                };
            }
        }
    }
};

export default resolvers;
