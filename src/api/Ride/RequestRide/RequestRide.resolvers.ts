import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import {
    RequestRideMutationArgs,
    RequestRideResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
    Mutation: {
        RequestRide: privateResolver(
            async (
                _,
                args: RequestRideMutationArgs,
                { req, pubSub }
            ): Promise<RequestRideResponse> => {
                const user: User = req.user;

                // user가 드라이빙 중이 아니라면 ride를 요청할 수 있다.
                if (!user.isRiding) {
                    try {
                        const ride = await Ride.create({ ...args, passenger: user }).save();

                        // 드라이버에 대한 subscription을 publish 한다.
                        pubSub.publish("rideRequest", { NearbyRideSubscription: ride });

                        user.isRiding = true;
                        user.save();

                        return {
                            ok: true,
                            error: null,
                            ride
                        };
                    } catch (error) {
                        return {
                            ok: false,
                            error: error.message,
                            ride: null
                        };
                    }
                } else {
                    return {
                        ok: false,
                        error: "You can't request two rides",
                        ride: null
                    };
                }
            }
        )
    }
};

export default resolvers;