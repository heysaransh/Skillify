const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://saranshsinghtomar:220415@localhost:5432/saranshsinghtomar',
});

console.log("Connecting...");
client.connect()
    .then(() => {
        console.log('Connected successfully');
        return client.end();
    })
    .catch(err => {
        console.error('Connection error', err);
        process.exit(1);
    });
