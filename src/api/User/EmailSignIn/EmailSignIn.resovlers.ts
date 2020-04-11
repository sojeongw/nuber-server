import {Resolvers} from "../../../types/resolvers";
import { EmailSignInMutationArgs, EmailSignInResponse } from '../../../types/graph';
import User from '../../../entities/User';

const resolvers: Resolvers = {
    Mutation: {
        EmailSignIn: async (_, args: EmailSignInMutationArgs) : Promise<EmailSignInResponse> => {
            const {email, password} = args;
            try{
                const user = await User.findOne({email});

                // user가 없다면 그 패스워드를 가진 user가 없다는 의미다.
                if(!user){
                    return {
                        ok: false,
                        error: "No user found with that email",
                        token: null
                    }
                }

                const checkPassword = await user.comparePassword(password);
                if(checkPassword){
                    return {
                        ok: true,
                        error: null,
                        token: "Coming soon"
                    };
                }else{
                    return{
                        ok: false,
                        error: "Wrong password",
                        token: null
                    }
                }
            }catch(error){
                return {
                    ok: false,
                    error: error.message,
                    token: null
                }
            }
        }
    }
};

export default resolvers;
