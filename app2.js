//jshint eversion:6
// used for syntax checking

// declaring array to store the data retrieved from database
let names = [];
let id = [];
let cost = [];

let reviewName = [];
let reviewEmail = [];
let reviewContent = [];

let names2 = [];
let id2 = [];
let cost2 = [];

let namesCart = [];
let quantityCart = [];
let costCart = [];




// importing modules
const nodemailer = require("nodemailer");
const express = require('express'); // for use of get,post functions, acts a framework and middleware while using nodejs

const mysql = require('mysql2'); //for sql database, used mysql2 as few functions were not working with mysql

const bodyParser = require("body-parser"); //parse and handle incoming get request, to get json format data

const path = require('path'); //used for working with directories, file paths and manipulate it

const http = require('http');

const app = express();

app.use(express.static("public"));

app.use(express.json()); //accept data in json format

app.use(express.static(__dirname + 'assets'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");


app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

// creating connection between server and database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MYsql@123#",
  database: "userdata"
});

// if error occurs, error is thrown and code stops, if not then logs connected to database
connection.connect(function (error) {
  if (error)
    throw error
  else
    console.log("Connected to database ");
});


// making constant variable to select particular columns for database
const namedata = '';
const costdata = '';
const iddata = '';

const namedata2 = '';
const costdata2 = '';
const iddata2 = '';



// pushing elements retrived from database into specific array
connection.query('select name from userdata.products_grooming', (err, res) => { // connection query is a method that has 2 arguments, name of data from where data is to be taken and a call back function toexcute when query is complete
  if (err) {
    throw error
  } else {
    res.forEach((res) => { // res contains array of data from database, for each is method to iterate over each object in the array
      names.push(res.name);
    });
    return;
    // console.log(names[2], names[5], names[8]);
  }
});


connection.query('select id from userdata.products_grooming', (err, res) => {
  if (err) {
    throw error
  } else {
    res.forEach((res) => {
      id.push(res.id);
    });

    return;
    // console.log(id[2], id[5], id[8]);
  }
});

connection.query('select cost from userdata.products_grooming', (err, res) => {
  if (err) {
    throw error
  } else {
    res.forEach((res) => {
      cost.push(res.cost);
    });

    return;
    // console.log(cost[2], cost[5], cost[8]);
  }
})


connection.query('select name from userdata.products_gyming', (err, res) => {
  if (err) {
    throw error
  } else {
    res.forEach((res) => {
      names2.push(res.name);
    });
    return;
    // console.log(names2[2], names2[5], names2[8]);
  }
})


connection.query('select id from userdata.products_gyming', (err, res) => {
  if (err) {
    throw error
  } else {
    res.forEach((res) => {
      id2.push(res.id);
    });
    return;
    // console.log(id2[2], id2[5], id2[8]);
  }
})

connection.query('select cost from userdata.products_gyming', (err, res) => {
  if (err) {
    throw error
  } else {
    res.forEach((res) => {
      cost2.push(res.cost);
    });
    return;
    // console.log(cost2[2], cost2[5], cost2[8]);
  }
})

connection.query('select name from userdata.review', (err, res) => {
  if (err) {
    throw error
  } else {
    res.forEach((res) => {
      reviewName.push(res.name);
    });
    return;
  }
})


connection.query('select email from userdata.review', (err, res) => {
  if (err) {
    throw error
  } else {
    res.forEach((res) => {
      reviewEmail.push(res.email);
    });
    return;
  }
})


connection.query('select content from userdata.review', (err, res) => {
  if (err) {
    throw error
  } else {
    res.forEach((res) => {
      reviewContent.push(res.content);
    });
    return;
  }
})

// SEARCH FUNCTIONALITY
let searchPerformed = false; // keeps track of whether search is perfomed by user
let searchResults = []; // empty array to store results of search
let query = ''; // initialize query variable

app.get('/index', function (req, res) { // get requests from homepage
  if (searchPerformed) {
    // render search results page
    res.render('searchresults', {
      searchResults
    });
  } else {
    // render main page
    res.sendFile(__dirname + '/index.html');
  }
});

app.get('/search', function (req, res) { // when user submits the query this route is triggered
  query = req.query.query; // retreives search query entered by user
  console.log(query);
  // const searched = `SELECT * FROM userdata.products_grooming WHERE name LIKE '%${query}%'`;

  const searched = `
  SELECT * FROM userdata.products_grooming
  WHERE name LIKE '%${query}%'
  UNION
  SELECT * FROM userdata.products_gyming
  WHERE name LIKE '%${query}%'
`;
  // searching from these two coulmns for the queery

  connection.query(searched, (error, results) => {
    if (error)
      throw error;
    if (results.length > 0) {
      // search found results
      searchPerformed = true;
      // store search results in a variable for later use
      searchResults = results;
      // then render search results page
      res.render('searchresults', {
        query,
      });
    } else {
      // search did not find any results
      searchPerformed = true;
      // render not found page
      res.render('notfound', {
        query
      });
    }
  });
});

//trying to solve error (cannot revisit home page after search function is used)

app.get('/views/cart', function (req, res) {


  connection.query('SELECT * FROM cart', (error1, results1, fields1) => {
    if (error1) throw error;

    const itemNames = results1.map((item) => item.name);
    const itemQuantities = results1.map((item) => item.quantity);
    const itemCosts = results1.map((item) => item.cost);

    res.render('cart', {
      itemName: itemNames,
      itemPrice: itemCosts,
      quantity: itemQuantities,
      message: "This is your cart"
    });
  });
});

app.get('/views/finalOrder', function (req, res) {
  connection.query('SELECT * FROM cart', (error1, results1, fields1) => {
    if (error1) throw error;

    const itemNames = results1.map((item) => item.name);
    const itemQuantities = results1.map((item) => item.quantity);
    const itemCosts = results1.map((item) => item.cost);
    res.render('finalOrder', {
      itemName: itemNames,
      itemPrice: itemCosts,
      quantity: itemQuantities
    });
  });


});




app.post('/finalOrder', function (req, res) {
  const confirmationEmail = req.body.confirmationEmail;
  connection.query('SELECT email FROM loginuser', (error1, results1, fields1) => {
    if (error1) throw error;

    const EMAIL = results1.map((item) => item.email);

    connection.query('SELECT * FROM cart', (error1, results1, fields1) => {
      if (error1) throw error;

      const itemNames = results1.map((item) => item.name);
      const itemQuantities = results1.map((item) => item.quantity);
      const itemCosts = results1.map((item) => item.cost);

      // const transporter = nodemailer.createTransport({
      //   service: 'gmail',
      //   auth: {
      //     user: 'karanbdave007@gmail.com',
      //     pass: ''
      //   }
      // });

      // const mailOptions = {
      //   from: 'karanbdave007@gmail.com',
      //   to: confirmationEmail,
      //   subject: 'Your order is confirmed',
      //   html: `Dear customer,<br><br>Thank you for placing your order with us. Your order is confirmed.<br><br>Order details:<br>${itemNames}<br>${itemCosts}<br>${itemQuantities}<br><br>Thank you for shopping with us.`
      // };

      // transporter.sendMail(mailOptions, function (error, info) {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log('Email sent: ' + info.response);
      //   }
      // });


      res.render('finalOrder', {
        itemName: itemNames,
        itemPrice: itemCosts,
        quantity: itemQuantities,
        EMAIL,
        confirmationEmail
      });
    });
  });
});



// app.get('/views/finalOrder', function (req, res) {
//   const confirmationEmail = req.body.confirmationEmail;
//   connection.query('SELECT email FROM loginuser', (error1, results1, fields1) => {
//     if (error1) throw error;

//     const EMAIL = results1.map((item) => item.email);

//     connection.query('SELECT * FROM cart', (error1, results1, fields1) => {
//       if (error1) throw error;

//       const itemNames = results1.map((item) => item.name);
//       const itemQuantities = results1.map((item) => item.quantity);
//       const itemCosts = results1.map((item) => item.cost);

//       const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: 'karanbdave007@gmail.com',
//           pass: 'pass'
//         }
//       });

//       const mailOptions = {
//         from: 'karanbdave007@gmail.com',
//         to: confirmationEmail,
//         subject: 'Your order is confirmed',
//         html: `Dear customer,<br><br>Thank you for placing your order with us. Your order is confirmed.<br><br>Order details:<br>${itemNames}<br>${itemCosts}<br>${itemQuantities}<br><br>Thank you for shopping with us.`
//       };

//       transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//           console.log(error);
//         } else {
//           console.log('Email sent: ' + info.response);
//         }
//       });


//       res.render('finalOrder', {
//         itemName: itemNames,
//         itemPrice: itemCosts,
//         quantity: itemQuantities,
//         EMAIL,
//         confirmationEmail
//       });
//     });
//   });
// });


// GET route to about us page
app.get('/aboutus', function (req, res) {
  res.sendFile(__dirname + '/aboutus.html')
});



// GET route to serve the login page
app.get('/views/loginpage', function (req, res) {
  res.sendFile(__dirname + '/views/loginpage.html')
});

// POST route to process user login data
app.post("/login", function (req, res) {
  var userName = req.body.username;
  var Password = req.body.password;
  console.log(userName, Password);

  var query = `
    INSERT INTO logindata (email,password)
    VALUES ("${userName}", "${Password}")
  `;

  connection.query(query, function (error, data) {
    if (error) throw error;

    // If data is inserted successfully, redirect user to index.html
    res.redirect('/index');
  });
});


// for gyming page
app.get('/views/gyming', function (req, res) {
  connection.query('select name from userdata.products_gyming', (error1, results1, fields1) => {
    if (error1)
      throw error;
    results = names2; // Store the retrieved data in the data array
    console.log(names2);

    connection.query('select cost from userdata.products_gyming', (error2, results2, fields2) => {
      if (error2)
        throw error;
      results2 = cost2; // Store the retrieved data in the data array
      console.log(cost2);

      res.render('gyming', {
        names2,
        cost2
      }); // Pass the unsortedCost array to the HTML file
    });
  });
});


app.get('/views/grooming', function (req, res) {
  connection.query('select name from userdata.products_grooming', (error1, results1, fields1) => {
    if (error1)
      throw error;
    results = names; // Store the retrieved data in the data array
    // console.log(names);

    connection.query('select cost from userdata.products_grooming', (error2, results2, fields2) => {
      if (error2)
        throw error;
      results2 = cost; // Store the retrieved data in the data array
      // console.log(cost);
      res.render('grooming', {
        names,
        cost
      }); // Pass the unsortedCost array to the HTML file

    });
  });
});




// SORTING FUNCTIONALITY


app.get('/views/gymingAlpha', function (req, res) {
  res.render('gymingAlpha');
});

app.post('/views/gymingAlpha', function (req, res) {

  connection.query('SELECT name FROM userdata.products_gyming_sort', (error1, results1, fields1) => {
    if (error1)
      throw error;
    const sortedNames2 = results1.map(result => result.name); // Extract the sorted names from the query results
    // console.log(sortedNames);

    connection.query('SELECT cost FROM userdata.products_gyming_sort', (error2, results2, fields2) => {
      if (error2)
        throw error;
      const sortedCost2 = results2.map(result => result.cost); // Extract the sorted costs from the query results
      // console.log(sortedCost);
      res.render('gymingAlpha', {
        names2: sortedNames2, // Pass the sorted names array to the HTML file
        cost2: sortedCost2
      });

    });
  });
});

app.get('/views/gymingNum', function (req, res) {
  res.render('gymingNum');
});

app.post('/views/gymingNum', function (req, res) {

  connection.query('SELECT name FROM userdata.products_gyming_sortCost', (error1, results1, fields1) => {
    if (error1)
      throw error;
    const sortedNames2 = results1.map(result => result.name); // Extract the sorted names from the query results
    // console.log(sortedNames);

    connection.query('SELECT cost FROM userdata.products_gyming_sortCost', (error2, results2, fields2) => {
      if (error2)
        throw error;
      const sortedCost2 = results2.map(result => result.cost); // Extract the sorted costs from the query results
      // console.log(sortedCost);
      res.render('gymingNum', {
        names2: sortedNames2, // Pass the sorted names array to the HTML file
        cost2: sortedCost2
      });

    });
  });
});

app.get('/views/groomingAlpha', function (req, res) {
  res.render('groomingAlpha');
});

app.post('/views/groomingAlpha', function (req, res) {
  connection.query('SELECT name FROM userdata.products_grooming_sort', (error1, results1, fields1) => {
    if (error1)
      throw error;
    const sortedNames = results1.map(result => result.name); // Extract the sorted names from the query results
    // console.log(sortedNames);

    connection.query('SELECT cost FROM userdata.products_grooming_sort', (error2, results2, fields2) => {
      if (error2)
        throw error;
      const sortedCost = results2.map(result => result.cost); // Extract the sorted costs from the query results
      // console.log(sortedCost);
      res.render('groomingAlpha', {
        names: sortedNames, // Pass the sorted names array to the HTML file
        cost: sortedCost
      });

    });
  });
});

app.get('/views/groomingNum', function (req, res) {
  res.render('groomingNum');

});


app.post('/views/groomingNum', function (req, res) {
  connection.query('SELECT name FROM userdata.products_grooming_sortCost', (error1, results1, fields1) => {
    if (error1)
      throw error;
    const sortedNames = results1.map(result => result.name); // Extract the sorted names from the query results
    // console.log(sortedNames);

    connection.query('SELECT cost FROM userdata.products_grooming_sortCost', (error2, results2, fields2) => {
      if (error2)
        throw error;
      const sortedCost = results2.map(result => result.cost); // Extract the sorted costs from the query results
      // console.log(sortedCost);
      res.render('groomingNum', {
        names: sortedNames, // Pass the sorted names array to the HTML file
        cost: sortedCost
      });

    });
  });


});


// app.post('/views/grooming/sortedAlpha', function (req, res) {
//   connection.query('select name from userdata.products_grooming_sort', (error1, results1, fields1) => {
//     if (error1)
//       throw error;
//     results = names; // Store the retrieved data in the data array
//     console.log(names);

//     connection.query('select cost from userdata.products_grooming_sort', (error2, results2, fields2) => {
//       if (error2)
//         throw error;
//       results2 = cost; // Store the retrieved data in the data array
//       console.log(cost);
//       res.render('grooming', {
//         names,
//         cost
//       });

//     });
//   });




// ADD TO CART
app.post('/add-to-cart', (req, res) => {
  const itemName = req.body.itemName;
  const itemPrice = req.body.itemPrice;
  const quantity = req.body.quantity;
  const itemid = req.body.itemId;

  const query = `INSERT INTO cart (name, cost, quantity) VALUES ('${itemName}', ${itemPrice}, ${quantity})`;

  connection.query(query, (error, results, fields) => {
    if (error) throw error;

    connection.query('SELECT * FROM cart', (error1, results1, fields1) => {
      if (error1) throw error;

      const itemNames = results1.map((item) => item.name);
      const itemQuantities = results1.map((item) => item.quantity);
      const itemCosts = results1.map((item) => item.cost);

      res.render('cart', {
        itemName: itemNames,
        itemPrice: itemCosts,
        quantity: itemQuantities,
        message: "Item added to cart"
      });
    });
  });
});

app.post('/remove-from-cart', (req, res) => {
  const itemName = req.body.itemName;
  const itemPrice = req.body.itemPrice;

  const quantity = req.body.quantity;

  console.log(itemName, itemPrice);

  // Remove the item from the cart in the database
  // console.log(`Deleted item with name '${itemName}'`);
  const query = `DELETE FROM cart WHERE cost='${itemPrice}'`;

  connection.query(query, (error, results, fields) => {
    if (error) throw error;

    // Render the cart page with a success message
    connection.query('SELECT * FROM cart', (error1, results1, fields1) => {
      if (error1) throw error;
      else {
        const rows = results1; // store the rows in a variable
        // console.log(rows);
      }

      const itemNames = results1.map((item) => item.name);
      const itemQuantities = results1.map((item) => item.quantity);
      const itemCosts = results1.map((item) => item.cost);

      res.render('cart', {
        itemName: itemNames,
        itemPrice: itemCosts,
        quantity: itemQuantities,
        message: "Item removed from cart"
      });
      // res.redirect("/index")
    });
  });
});





app.post('/add-review', function (req, res) {
  const name = req.body.NAME;
  const email = req.body.EMAIL;
  const content = req.body.CONTENT;

  console.log(name, email, content);
  const reviewQuery = `INSERT INTO review (name, email, content) VALUES ('${name}', '${email}', '${content}')`;
  connection.query(reviewQuery, (error, results, fields) => {
    if (error) throw error;
    connection.query('SELECT * FROM review', (error1, results1, fields1) => {
      if (error1) throw error;
      res.render('review', {
        reviewName,
        reviewEmail,
        reviewContent
      });
    });

  });
});


app.get('/views/review', function (req, res) {
  //  connection.query('SELECT name, email, content FROM userdata.review', (error, results, fields) => {
  //     if (error) throw error;
  //     const reviewData = results;
  //     res.render('review', { reviewData });
  //   });


  // connection.query('select name from userdata.review', (error1, results1, fields1) => {
  //   if (error1)
  //     throw error;
  //   results = reviewName;
  //   // console.log(reviewName);

  //   connection.query('select email from userdata.review', (error2, results2, fields2) => {
  //     if (error2)
  //       throw error;
  //     results2 = reviewEmail;
  //     // console.log(reviewEmail);

  //     connection.query('select content from userdata.review', (error2, results2, fields2) => {
  //       if (error2)
  //         throw error;
  //       results2 = reviewContent;
  //       // console.log(reviewContent);
  connection.query('SELECT * FROM review', (error, results, fields) => {
    if (error) throw error;

    // Extract the review data into separate arrays for rendering in the view template
    const reviewNames = results.map(result => result.name);
    const reviewEmails = results.map(result => result.email);
    const reviewContents = results.map(result => result.content);
    res.render('review', {
      reviewName,
      reviewEmail,
      reviewContent
    });
  });

});


// app.post('/add-to-cart', (req, res) => {
//   const itemName = req.body.itemName;
//   const itemPrice = req.body.itemPrice;
//   const quantity = req.body.quantity;

//   const query = `INSERT INTO cart (name, cost, quantity) VALUES ('${itemName}', ${itemPrice}, ${quantity})`;

//   connection.query(query, (error, results, fields) => {
//     if (error) throw error;


//     connection.query('SELECT name FROM userdata.cart', (error1, results1, fields1) => {
//       if (error1) throw error;
//       else {
//         results1.forEach((results1) => {
//           namesCart.push(res.namesCart);
//         });
//       }
//     });

//     connection.query('SELECT quantity FROM userdata.cart', (error2, results2, fields2) => {
//       if (error2) throw error;
//       else {
//         results2.forEach((results2) => {
//           quantityCart.push(res.quantityCart);
//         });
//       }
//     });

//     connection.query('SELECT cost FROM userdata.cart', (error3, results3, fields3) => {
//       if (error3) throw error;
//       else {
//         results3.forEach((results3) => {
//           costCart.push(res.costCart);
//         });
//       }
//     });



//     res.render('cart', {
//       itemName: results1,
//       itemPrice: results2,
//       quantity: results3,
//       message: "Item added to cart"
//     });

//   });
// });


// app.get('/cart', (req, res) => {
//   connection.query('SELECT * FROM cart', (error1, results1, fields1) => {
//     if (error1)
//       throw error;
//     console.log("IN CART");



//     res.render('cart', {
//       cartItems: results
//     });

//     // let cartItems = '';
//     // results1.forEach(item => {
//     //   cartItems += `<li>${item.product} - ${item.quantity}</li>`;
//     // });
//     // res.send(`
//     //   <h2>Cart</h2>
//     //   <ul>${cartItems}</ul>
//     // `);
//   });
// });

// starting on port 3000

app.listen(3000, function () {
  console.log("Server running at port 3000 ");
});
