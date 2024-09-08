import server from './server';

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`.blue);
});
