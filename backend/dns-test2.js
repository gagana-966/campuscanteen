import { Resolver } from 'dns';
const resolver = new Resolver();
resolver.setServers(['8.8.8.8']); // Use Google's Public DNS

resolver.resolveSrv('_mongodb._tcp.food.ug25uwu.mongodb.net', (err, addresses) => {
    if (err) {
        console.error('SRV Error:', err);
        return;
    }
    console.log('SRV Addresses:', addresses);
});

resolver.resolveTxt('food.ug25uwu.mongodb.net', (err, records) => {
    if (err) {
        console.error('TXT Error:', err);
        return;
    }
    console.log('TXT Records:', records);
});
