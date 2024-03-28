const express = require('express');

const app = express();
const PORT = 80;

const router = require('./src/routes');
app.use(router);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));