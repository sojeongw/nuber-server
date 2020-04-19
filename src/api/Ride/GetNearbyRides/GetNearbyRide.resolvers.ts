import { Between, getRepository } from "typeorm";
import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import { GetNearbyRideResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";

// 드라이버가 요청하는 함수. 앱을 실행하면 근처의 ride 요청을 받는다.
const resolvers: Resolvers = {
    Query: {
        GetNearbyRide: privateResolver(
            async (_, __, { req }): Promise<GetNearbyRideResponse> => {
                // const { user } : { user : User } = req; 구조 분해 할당으로 타입을 지정해 줄 수 있지만 복잡해서 아래처럼 구현한다.
                const user: User = req.user;
                if (user.isDriving) {
                    const { lastLat, lastLng } = user;
                    try {
                        const ride = await getRepository(Ride).findOne({
                            status: "REQUESTING",
                            pickUpLat: Between(lastLat - 0.05, lastLat + 0.05),
                            pickUpLng: Between(lastLng - 0.05, lastLng + 0.05)
                        });
                        if (ride) {
                            return {
                                ok: true,
                                error: null,
                                ride
                            };
                        } else {
                            return {
                                ok: true,
                                error: null,
                                ride: null
                            };
                        }
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
                        error: "You are not a driver",
                        ride: null
                    };
                }
            }
        )
    }
};

export default resolvers;