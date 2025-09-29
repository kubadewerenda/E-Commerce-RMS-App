import { Sequelize } from 'sequelize-typescript'
import path from 'path'
import { logger } from '../lib/logger'

const DB_URL = process.env.SUPABASE_DB_URL
if(!DB_URL) throw new Error('Missing DB URL')

function getModelGlobs(): string[]{
    const base = path.resolve(__dirname, '../models')
    return [
        path.join(base , '**/*.model.js'),
        path.join(base , '**/*.model.ts'),
    ]
}

const isProd = process.env.NODE_DEV === 'production'
function sqlLogger(mess: string, executionTimeMs?: number){
    const msg = mess.replace(/^Executing \\(default\\):\\s*/i, '')
    const meta = executionTimeMs != null ? { ms: executionTimeMs } : undefined
    if(isProd) logger.info(meta, msg)
    else logger.debug(meta, msg)
}

export const sequelize = new Sequelize(DB_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    pool: {
        max: 5,
        idle: 30_000,
        acquire: 60_000
    },
    define: {
        underscored: true,
        freezeTableName: true
    },
    benchmark: true,
    logQueryParameters: false,
    logging: process.env.SQL_LOG === '1' ? sqlLogger : false
})

function registerModelsByGlob(){
    sequelize.addModels(getModelGlobs())
}

export async function initOrm() {
    registerModelsByGlob()
    await sequelize.authenticate()

    if(process.env.DB_SYNC === '1'){
        await sequelize.sync({alter: true})
    }
    logger.info('Sequelize ORM ready')
}
