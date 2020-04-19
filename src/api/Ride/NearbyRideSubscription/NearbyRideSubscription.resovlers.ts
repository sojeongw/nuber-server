import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";

// 드라이버를 위한 subscription
const resolvers = {
    Subscription: {
        NearbyRideSubscription: {
            subscribe: withFilter(
                (_, __, { pubSub }) => pubSub.asyncIterator("rideRequest"),
                (payload, _, { context }) => {
                    // 이 user는 드라이버를 의미한다.
                    const user: User = context.currentUser;
                    const {
                        NearbyRideSubscription: { pickUpLat, pickUpLng }
                    } = payload;
                    const { lastLat: userLastLat, lastLng: userLastLng } = user;

                    // 모든 메시지를 받아보다가 요청하는 사람의 픽업 위치가 드라이버 근처라면 true를 반환한다.
                    return (
                        pickUpLat >= userLastLat - 0.05 &&
                        pickUpLat <= userLastLat + 0.05 &&
                        pickUpLng >= userLastLng - 0.05 &&
                        pickUpLng <= userLastLng + 0.05
                    );
                }
            )
        }
    }
};

export default resolvers;