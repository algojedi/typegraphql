import { createConnection } from 'typeorm'

export const testConn = (drop: boolean = false) => {
    // overwrite the settings from ormconfig:
    return createConnection({
        name: 'default',
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'vic',
        password: 'test',
        database: 'typegraphql_test',
        synchronize: drop,
        dropSchema: drop,
        entities: [__dirname + '/../entity/*.*']
    })
}
