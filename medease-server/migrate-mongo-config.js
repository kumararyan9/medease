require('dotenv/config');

const dns = require('dns');

const customDns = process.env.DNS_SERVERS;
if (customDns) {
  const servers = customDns.split(',').map((s) => s.trim());
  dns.setServers(servers);
} else if (process.env.NODE_ENV === 'development') {
  const currentServers = dns.getServers();
  if (currentServers.length === 1 && currentServers[0] === '127.0.0.1') {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  }
}

const config = {
  mongodb: {
    url: process.env.MONGODB_URI,
    databaseName: process.env.DB_NAME || 'medease',
    options: {},
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'migrations',
  migrationFileExtension: '.js',
};

module.exports = config;
