import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";

// 근처에 있는 운전자를 알려주는 리졸버
const resolvers = {
    Subscription: {
        DriversSubscription: {
            subscribe: withFilter(
                // withFilter의 첫번째 함수 asyncIteratorFn은 asyncIterator를 반환해야 한다.
                (_, __, { pubSub }) => pubSub.asyncIterator("driverUpdate"), // driverUpdate 채널을 업데이트할 때마다 알려주도록 리턴한다
                // filterFn은 true를 리턴하면 이 함수 listening 하고 있는 유저에게 결과물을 전송한다.
                // false라면 유저에게 아무것도 전송하지 않는다.
                (payload, _, { context }) => {
                    const user: User = context.currentUser;
                    const {
                        DriversSubscription: {
                            lastLat: driverLastLat,
                            lastLng: driverLastLng
                        }
                    } = payload;

                    // 구조 분해 할당 시 : 뒤에 다른 이름을 붙여줄 수 있다.
                    const { lastLat: userLastLat, lastLng: userLastLng } = user;

                    // 드라이버가 사용자 가까이에 있으면 true를 리턴한다.
                    return (
                        driverLastLat >= userLastLat - 0.05 &&
                        driverLastLat <= userLastLat + 0.05 &&
                        driverLastLng >= userLastLng - 0.05 &&
                        driverLastLng <= userLastLng + 0.05
                    );
                }
            )
        }
    }
};
export default resolvers;

/*
* Subscription
*
* 어떤 것이 도착할 때마다 받을 수 있다. TV 채널을 예로 들어보자. 채널을 subscription 한다는 건 그 채널을 계속 주시할 수 있다는 의미다.
* 매번 서버가 어떤 새로운 것을 받았을 때 그걸 나에게 보여주게 된다.
*
* subscription을 사용하려면 app.ts에서 subscription 서버를 시작해줘야 한다.
* */