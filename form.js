const express = require('express');
const { Client } = require('pg');
const xss = require('xss');
const router = express.Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator/check');
router.use(express.urlencoded({extended: true}));


function form(req, res) {
  if(req.isAuthenticated()){
    const data = {name: '', email: '', ssn: '', amount: '', error: '', href: `
    <p>Innskráning sem ${req.user.username}</p>
    <p><a href="/logout">Útskráning</a></p
  `};
    res.render('form', {data});
  }

  const data = {name: '', email: '', ssn: '', amount: '', error: '', href: '/login', a: 'Innskráning'};
  res.render('form', {data});
}

router.get('/', form);

async function addUser(name, email, amount, ssn) {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'examples',
    password: 'starwars',
  });
  await client.connect();
  await client.query('INSERT INTO info (name, email, amount, ssn) VALUES ($1, $2, $3, $4)', [name, email, amount, ssn]);
  await client.end();
}



router.post('/addInfo', 
check('name').isLength({ min: 1 }).withMessage('Nafn má ekki vera tómt'),
  check('email').isLength({ min: 1 }).withMessage('Netfang má ekki vera tómt'),
  check('email').isEmail().withMessage('Netfang verður að vera netfang'),
  check('ssn').isLength({ min: 1}).withMessage('Kennitala má ekki vera tóm'),
async (req, res) => {
  
  
  const {
    name = '',
    email = '',
    ssn = '',
    amount = 0,
  } = req.body;

  const errors = validationResult(req);

  const data = {name: name, email: email, ssn: ssn, amount: amount, error: errors, href: '/login', a: 'Innskráning'};

if(!errors.isEmpty()){
  const errorMessages = errors.array().map(i => i.msg);
  const data = {name: name, email: email, ssn: ssn, amount: amount, error: errorMessages, href: '/login', a: 'Innskráning'};
  res.render('form', {data});
}

  await addUser(xss(name), xss(email), xss(amount), xss(ssn));
  res.send( `
  <p>Takk fyrir skráninguna</p>
  <p><a href="/">Forsíða</a></p
`);
});



module.exports = router;
