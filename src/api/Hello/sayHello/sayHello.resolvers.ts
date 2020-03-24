import {SayHelloQueryArgs, SayHelloResponse} from "../../../types/graph";

const resolvers = {
    Query: {
        // graph.d.ts에서 가져온 Greeting 타입을 리턴한다.
        // () 는 인자를 받는다는 의미다. parent, args, context 순으로 전달된다.
        // 따라서 받을 인자인 SayHelloQueryArgs를 두번째에 써준다.
        sayHello: (_, args: SayHelloQueryArgs) : SayHelloResponse => {
            return{
                error: false,
                text: `Hello ${args.name}`
            }
        }
    }
};

export default resolvers;