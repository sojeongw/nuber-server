// 근처에 있는 운전자를 알려주는 리졸버
const resolvers = {
    Subscription: {
        DriversSubscription: {
            subscribe: (_, __, { pubSub }) => {
                return pubSub.asyncIterator("driverUpdate");    // driverUpdate 채널을 업데이트할 때마다 알려주도록 리턴한다.
            }
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