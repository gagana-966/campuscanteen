import dns from 'dns';

dns.resolveSrv('_mongodb._tcp.food.ug25uwu.mongodb.net', (err, addresses) => {
    if (err) {
        console.error('SRV Error:', err);
        return;
    }
    console.log('SRV Addresses:', addresses);
});

dns.resolveTxt('food.ug25uwu.mongodb.net', (err, records) => {
    if (err) {
        console.error('TXT Error:', err);
        return;
    }
    console.log('TXT Records:', records);
});
