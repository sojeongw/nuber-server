import User from "../../../entities/User";
import {
    UpdateMyProfileMutationArgs,
    UpdateMyProfileResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import cleanNullArgs from "../../../utils/cleanNullArgs";

const resolvers: Resolvers = {
    Mutation: {
        UpdateMyProfile: privateResolver(
            async (
                _,
                args: UpdateMyProfileMutationArgs,
                { req }
            ): Promise<UpdateMyProfileResponse> => {
                const user: User = req.user;
                const notNull:any = cleanNullArgs(args); // 👈🏻 Add ':any'

                // ⚠️ Take the if(notNull.password) OUT of the try/catch
                if(notNull.password !== null) { // 👈🏻 Change from args to notNull
                    user.password = notNull.password; // 👈🏻 Same here
                    user.save();
                    delete notNull.password; // <--  ⚠️⚠️⚠️ Delete password  from notNull or is going to be saved again without encoding ⚠️⚠️⚠️
                }
                try {
                    await User.update({ id: user.id }, { ...notNull });
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