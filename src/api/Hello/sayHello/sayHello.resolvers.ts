import {Greeting} from "../../../types/graph";

const resolvers = {
    Query: {
        // graph.d.ts에서 가져온 Greeting 타입을 리턴한다.
        sayHello: () : Greeting => {
            return{
                error: false,
                text: "love you"
            }
        }
    }
};

export default resolvers;