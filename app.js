const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const bcrypt = require('bcrypt');
const { User } = require('./models/User');
const { Contact } = require('./models/Contact');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
// mongoose.connect('mongodb://localhost/node-authentication');
mongoose.connect('mongodb+srv://rajan:fddGgOBLH8BCfLgJ@cluster0.d8girz9.mongodb.net/studentcrudmm?retryWrites=true&w=majority');
 //, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'rajankumar',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// Set up HBS
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Routes


app.get('/login', (req, res) => {
  res.render('login');
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user;
      res.redirect('/index');
    } else {
      req.flash('error', 'Invalid username or password');
      res.redirect('/login');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', (req, res) => {
  if (req.session.user) {
    res.render('index', { user: req.session.user });
  } else {
    res.redirect('/login');
  }
});
app.get('/index', (req, res) => {
  if (req.session.user) {
    res.render('index', { user: req.session.user });
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.get('/register', (req, res) => {
    res.render('register');
  });

 // ...

app.post('/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  console.log(req.body);
  console.log(req.body.password)
  console.log(req.body.confirmPassword)

  try {
    if (password != confirmPassword) {
      req.flash('error', 'Passwords do not match. Please try again.');
      res.redirect('/register');
      return;
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      req.flash('error', 'Username already exists. Please choose a different one.');
      res.redirect('/register');
    } else {
      const newUser = new User({ username, password });
      await newUser.save();
      req.session.user = newUser;
      res.redirect('/index');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// ...


// Start server

  app.get('/contact', (req, res) => {
    res.render('contact');
  });
  app.post('/contact', async (req, res) => {
    const { fullName, mobileNumber, email, description } = req.body;
  
    try {
      const newContact = new Contact({ fullName, mobileNumber, email, description });
      await newContact.save();
      res.redirect('/thankyou');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  app.get('/thankyou', (req, res) => {
    res.render('thankyou');
  });
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
