// Deliberately insecure lab code. Never use it in a real project.
const { exec } = require('child_process');
const express = require('express');
const _ = require('lodash');
const config = require('./config');

function createApp() {
  const app = express();
  app.use(express.json());

  const settings = { theme: 'light', language: 'en' };

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/info', (req, res) => {
    res.json({ service: 'task-api', paymentKeyConfigured: Boolean(config.paymentApiKey) });
  });

  // Looks up a host name, for example /resolve?host=localhost
  app.get('/resolve', (req, res) => {
    const host = req.query.host;
    exec('nslookup ' + host, (error, stdout) => {
      if (error) {
        return res.status(404).json({ error: 'Host not found.' });
      }
      res.type('text/plain').send(stdout);
    });
  });

  // Adds two numbers, for example /calc?a=2&b=3
  app.get('/calc', (req, res) => {
    const a = eval(req.query.a);
    const b = eval(req.query.b);
    res.json({ result: a + b });
  });

  // Updates the settings with the JSON body.
  app.post('/settings', (req, res) => {
    _.merge(settings, req.body);
    res.json(settings);
  });

  return app;
}

module.exports = { createApp };
