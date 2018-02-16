const express = require('express');
const { Client } = require('pg');
const router = express.Router();

function ensureLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
  
    return res.redirect('/login');
  }

router.get('/admin', ensureLoggedIn, async (req, res) => {
    const infos = await fetchInfo();
    
    res.render('admin', {infos});
});

async function fetchInfo() {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'examples',
        password: 'starwars',
      });
      await client.connect();
      const result = await client.query('SELECT * FROM info');
      await client.end();

      return result.rows;
}


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });

module.exports = router;


