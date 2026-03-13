import { Resolver } from 'dns';
const resolver = new Resolver();
resolver.setServers(['8.8.8.8']); // Use Google's Public DNS

resolver.resolveTxt('food.ug25uwu.mongodb.net', (err, records) => {
    if (err) {
        console.error('TXT Error:', err);
        return;
    }
    const txtRecord = records[0].join('');
    console.log('TXT:', txtRecord);

    resolver.resolveSrv('_mongodb._tcp.food.ug25uwu.mongodb.net', (err, addresses) => {
        if (err) {
            console.error('SRV Error:', err);
            return;
        }

        const hosts = addresses.map(a => `${a.name}:${a.port}`).join(',');
        console.log('HOSTS:', hosts);

        let replSetMatch = txtRecord.match(/authSource=([^\&]+)/);
        let authSource = replSetMatch ? replSetMatch[1] : 'admin';

        // Wait, normally replicaSet is in the txt record... let's just log it.
        console.log('REPLICA SET PARAMS:', txtRecord);
    });
});
