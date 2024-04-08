require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio'); // npm package to interact to html 
const PORT = process.env.PORT || 3000;


// middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // to help get the post request from the index.ejs
app.use(express.json());
app.use(bodyParser.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', __dirname + '/views');




// Set the headers to specify content type as application/x-www-form-urlencoded
const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};



app.get('/', (req, res) => {
    res.render('index.ejs', { title: 'Home' }); // Pass any data you want to inject into the EJS template
});



// get the department based on the selected faculty
app.post('/get-dept', async (req, res) => {
    try {

        const body = req.body
        // Make a request to lasu endpoint URL using Axios
        const response = await axios.post('http://studentservices.lasu.edu.ng/exam_courses_count/course_allocation/fac.php', body, config);

        // recieve data in html format and send it to the client
        res.send(response.data);

    } catch (error) {
        // If there's an error, send an error response back to the client
        console.error('Error sending request:', error.message);
        res.status(500).send('<h1>Internal Server Error</h1>');

    }
});

// 
app.post('/dept-courses', async (req, res) => {

    const { level } = req.body

    try {

        const body = req.body
        // Make a request to external URL using Axios
        const response = await axios.post('http://studentservices.lasu.edu.ng/exam_courses_count/course_allocation/preview.php', body, config);

        // Assuming 'html' contains your HTML content
        const $ = cheerio.load(response.data);

        // Get all rows in the table body
        const rows = $('#example1 tbody tr');


        // Hide all rows initially
        rows.css('display', 'none');

        // Show only rows with the selected level
        rows.each(function () {
            const levelCell = $(this).find('td:nth-child(4)');
            if (levelCell && levelCell.text() === level) {
                $(this).css('display', 'flex');

            } else if (level === "all") {
                rows.css('display', 'block');


            }
        });

        // Now you can use $.html() to get the modified HTML content
        const modifiedHtml = $.html();

        res.send(modifiedHtml);

    } catch (error) {
        // If there's an error, send an error response back to the client
        console.error('Error sending request:', error.message);
        res.status(500).send('<h1>Internal Server Error</h1>');
    }
});



app.all('*', (req, res) => {
    res.status(404).json({ error: 'Page not found' });
});


app.listen(PORT, () => { console.log(`Server running on ${PORT}`) });