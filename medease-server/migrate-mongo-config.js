import 'dotenv/config';

const config = {
  mongodb: {
    url: process.env.MONGODB_URI,
    databaseName: process.env.DB_NAME || 'medease',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'migrations',
  migrationFileExtension: '.js',
};

export default config;
