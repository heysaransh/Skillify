const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://saranshsinghtomar:220415@localhost:5432/saranshsinghtomar',
});

client.connect()
    .then(async () => {
        const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';");
        console.log(res.rows);
        return client.end();
    })
    .catch(err => {
        console.error('Connection error', err);
        process.exit(1);
    });
