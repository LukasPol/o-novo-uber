interface IDatabases {
  [key: string]: string;
}

const databases: IDatabases = {
  development: 'mydatabase',
  test: 'mydatabase_test',
  production: 'mydatabase'
}
const node_env = process.env.NODE_ENV || 'development'
const database = databases[node_env] || databases.development

export const database_url =`postgres://${process.env.POSTGRES_USERNAME}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:5432/${database}`
