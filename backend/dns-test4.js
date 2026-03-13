import { Resolver } from 'dns';
import fs from 'fs';
const resolver = new Resolver();
resolver.setServers(['8.8.8.8']); // Use Google's Public DNS

resolver.resolveTxt('food.ug25uwu.mongodb.net', (err, records) => {
    if (err) return;
    const txtRecord = records[0].join('');

    resolver.resolveSrv('_mongodb._tcp.food.ug25uwu.mongodb.net', (err, addresses) => {
        if (err) return;

        const hosts = addresses.map(a => `${a.name}:${a.port}`).join(',');

        let replSetMatch = txtRecord.match(/authSource=([^\&]+)/);
        let authSource = replSetMatch ? replSetMatch[1] : 'admin';

        // MongoDB legacy connection string format
        const uri = `mongodb://gagana-966:Gagana123@${hosts}/onlinefood?ssl=true&replicaSet=atlas-ozg3gh-shard-0&authSource=admin&retryWrites=true&w=majority&appName=food`;

        fs.writeFileSync('resolved-uri.txt', uri, 'utf8');
    });
});
