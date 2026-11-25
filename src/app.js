// Deliberately insecure lab code. Never use it in a real project.
const dns = require('node:dns').promises;
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
  app.get('/resolve', async (req, res) => {
    const host = String(req.query.host || '');
    if (!/^[a-z0-9.-]{1,253}$/i.test(host)) {
      return res.status(400).json({ error: 'Invalid host name.' });
    }
    try {
      const { address } = await dns.lookup(host);
      res.json({ host, address });
    } catch {
      res.status(404).json({ error: 'Host not found.' });
    }
  });

  // Adds two numbers, for example /add?a=2&b=3
  app.get('/add', (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      return res.status(400).json({ error: 'a and b must be numbers.' });
    }
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