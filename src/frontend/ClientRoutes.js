const express = require('express');
const frontendRouter = express.Router();
const path = require('path');

frontendRouter.use(express.static('static'));
frontendRouter.use(express.urlencoded({extended: true}));
const html_dir = path.join(__dirname, '../../templates/');

frontendRouter.get('/', (req, res) => {
    res.sendFile(`${html_dir}home.html`);
});

frontendRouter.get('/login', (req, res) => {
    res.sendFile(`${html_dir}login.html`);
});

frontendRouter.get('/:username', (req, res) => {
    res.sendFile(`${html_dir}follow.html`);
});

module.exports = frontendRouter;