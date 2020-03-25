import {ConnectionOptions} from "typeorm";

console.log(process.env.DB_ENDPOINT);

const connectionOptions: ConnectionOptions = {
    type: "postgres",
    database: "nuber",
    synchronize: true,
    logging: true,
    entities: [
        "entities/*.*"
    ],
    host: process.env.DB_ENDPOINT,
    // postgres의 기본 포트 번호
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
};

export default connectionOptions;