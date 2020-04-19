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
                try {
                    const ride = await Ride.create({ ...args, passenger: user }).save();

                    // 드라이버에 대한 subscription을 publish 한다.
                    pubSub.publish("rideRequest", { NearbyRideSubscription: ride });

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
            }
        )
    }
};

export default resolvers;