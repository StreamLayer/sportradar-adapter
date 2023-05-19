

const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');

fastify.post('/save', async (request, reply) => {
  const db = request.body;

  // Save the db object to db.json
  fs.writeFileSync('db.json', JSON.stringify(db));

  // Marks change, so the ad trigger server can pickup the change.
  fs.writeFileSync('changed', ' ');

  return { status: 'ok' };
});

fastify.register(require('fastify-static'), {
  root: path.join(__dirname),
  prefix: '/', // optional: default '/'
});

async function start () {
  try {
    await fastify.listen(8001, '0.0.0.0');
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
