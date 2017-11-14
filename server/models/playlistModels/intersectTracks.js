const client = require('./redis.js');

async function intersect(playlist, collab, collaborator) {
  return new Promise(async (resolve, reject) => {
    client.sismember(`collabs:${playlist.collabs}`, collaborator, (err, results) => {
      if (err) reject(500);
      if (results) {
        console.log(results, playlist.collabs);
      } else {
        client.SINTER(`tracks:${playlist.bank}`, `tracks:${collab}`, (err, intersect) => {
          if (intersect.length) client.sadd(`tracks:${playlist.tracks}`, intersect);
          if (err) reject(500);
          client.sdiff(`tracks:${collab}`, `tracks:${playlist.bank}`, (err, diff) => {
            if (diff.length) client.sadd(`tracks:${playlist.bank}`, diff);
            client.sadd(`collabs:${playlist.collabs}`, collaborator);
            if (err) reject(500);
            resolve(200);
          });
        });
      }
    });
  });
}

module.exports = intersect;