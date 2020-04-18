import { Between, getRepository } from "typeorm";
import User from "../../../entities/User";
import { GetNearbyDriversResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";

/*
* TypeORM에는 두 가지 방식이 있다.
* 1. Active Record
* 지금 우리가 사용하는 방식이다. Base Entity를 상속 Entities를 만들어야 한다. export class User extends BaseEntity
* 2. Data Mapper
* export class User {}와 connection.getRepository를 사용한다.
* 데이터를 생성하고 찾고 지우는 방식이 좀 더 어렵고 다르다.
*
* Between 같은 find operators는 Active Record에서 작동하지 않으므로 2번 방식으로 해야 한다.
* */
const resolvers: Resolvers = {
    Query: {
        GetNearbyDrivers: privateResolver(
            async (_, __, { req }): Promise<GetNearbyDriversResponse> => {
                const user: User = req.user;
                const { lastLat, lastLng } = user;
                try {
                    const drivers: User[] = await getRepository(User).find({
                        isDriving: true,
                        lastLat: Between(lastLat - 0.05, lastLat + 0.05),
                        lastLng: Between(lastLng - 0.05, lastLng + 0.05)
                    });
                    return {
                        ok: true,
                        error: null,
                        drivers
                    };
                } catch (error) {
                    return {
                        ok: false,
                        error: error.message,
                        drivers: null
                    };
                }
            }
        )
    }
};
export default resolvers;