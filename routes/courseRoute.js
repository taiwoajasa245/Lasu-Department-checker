
const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio'); // npm package to interact to html 
const { json } = require('body-parser');
require('dotenv').config();
const SCHOOL_URI = process.env.SCHOOL_URI;



router.use(express.static('public'));


// Set the headers to specify content type as application/x-www-form-urlencoded
const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};


router.get('/', (req, res) => {
    res.render('index.ejs', { title: 'Home' });
    // res.status(302).redirect('/api-docs'); 
});


// get the department based on the selected faculty for testing
router.post('/get-dept', async (req, res) => {
    try {

        const body = req.body
        // Make a request to lasu endpoint URL using Axios
        const response = await axios.post(process.env.DEPT_URI, body, config);

        // recieve data in html format and send it to the client
        res.send(response.data);

    } catch (error) {
        // If there's an error, send an error response back to the client
        console.error('Error sending request:', error.message);
        res.status(500).send('<h1>Internal Server Error</h1>');

    }
});

// POST request for testing
router.post('/dept-courses', async (req, res) => {

    const { level } = req.body

    try {

        const body = req.body
        // Make a request to external URL using Axios
        const response = await axios.post(SCHOOL_URI, body, config);

        // Assuming 'html' contains your HTML content
        const $ = cheerio.load(response.data);

        // Get the table element

        const table = $('#example1');

        // Remove inline style from the table
        table.removeAttr('style');

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
        const me = JSON.stringify(modifiedHtml);
        const cleanHtml = modifiedHtml.replace(/\n|\t/g, "");

        res.send(cleanHtml);

    } catch (error) {
        // If there's an error, send an error response back to the client
        console.error('Error sending request:', error.message);
        res.status(500).json({ status: 500, message: 'Internal Server Error, Try again later' });

    }
});


/**
 * @swagger
 * tags:
 *   name: Department
 *   description: Operations related to department options
 *
 * /get-department:
 *   post:
 *     summary: Get department options based on the selected faculty
 *     description: Get department options based on the selected faculty from LASU
 *     tags: [Department]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               fac:
 *                 type: string
 *                 description: Faculty code (01 to 18)
 *                 example: '01'
 *                 enum:
 *                   - '01'
 *                   - '02'
 *                   - '03'
 *                   - '04'
 *                   - '05'
 *                   - '06'
 *                   - '07'
 *                   - '08'
 *                   - '09'
 *                   - '10'
 *                   - '11'
 *                   - '12'
 *                   - '13'
 *                   - '14'
 *                   - '15'
 *                   - '16'
 *                   - '17'
 *                   - '18'
 *     responses:
 *       200:
 *         description: Department options retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                   description: Status code indicating success
 *                 message:
 *                   type: string
 *                   example: success
 *                   description: Message indicating success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         description: Value of the department option
 *                       text:
 *                         type: string
 *                         description: Text of the department option
 */


// get the department based on the selected faculty API 
router.post('/get-department', async (req, res) => {
    try {

        const body = req.body
        // Make a request to lasu endpoint URL using Axios
        const response = await axios.post(process.env.DEPT_URI, body, config);

        const $ = cheerio.load(response.data);
        const options = [];

        $('option').each((index, element) => {
            const value = $(element).attr('value');
            const text = $(element).text();
            options.push({ value, text });
        });


        const jsonData = {
            status: 200,
            message: 'success',
            data: options
        };

        res.status(200).json(jsonData);

    } catch (error) {
        // If there's an error, send an error response back to the client
        console.error('Error sending request:', error.message);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });


    }
});



/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Operations related to courses
 *
 * /get-courses:
 *   post:
 *     summary: Get courses based on the selected parameters
 *     description: Get courses based on the selected parameters from the school
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               fac:
 *                 type: string
 *                 description: Faculty code (01 to 18)
 *                 example: '01'
 *                 enum:
 *                   - '01'
 *                   - '02'
 *                   - '03'
 *                   - '04'
 *                   - '05'
 *                   - '06'
 *                   - '07'
 *                   - '08'
 *                   - '09'
 *                   - '10'
 *                   - '11'
 *                   - '12'
 *                   - '13'
 *                   - '14'
 *                   - '15'
 *                   - '16'
 *                   - '17'
 *                   - '18'
 *               dept:
 *                 type: string
 *                 description: Department code obtained from the get-department endpoint
 *                 example: '0115'
 *               level:
 *                 type: string
 *                 description: Course level (100 to 400) or 'ALL' to retrieve all levels
 *                 example: '200'
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                   description: Message indicating success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       COURSE_TITLE:
 *                         type: string
 *                         description: Title of the course
 *                       COURSE_CODE:
 *                         type: string
 *                         description: Code of the course
 *                       UNIT:
 *                         type: integer
 *                         description: Number of units for the course
 *                       LEVEL:
 *                         type: integer
 *                         description: Level of the course
 *                       COURSE_STATUS:
 *                         type: string
 *                         description: Status of the course
 */


// get the list of all courses and other thingss
router.post('/get-courses', async (req, res) => {
    let { level } = req.body;
    try {

        const body = req.body;
        const response = await axios.post(SCHOOL_URI, body, config);
        const $ = cheerio.load(response.data);
        const tableData = $('table').toString();

        const parseAndFilterData = (htmlData, targetLevel) => {
            const $ = cheerio.load(htmlData);
            const filteredRows = [];

            $('tbody tr').each((index, element) => {
                const columns = $(element).find('td');
                const rowLevel = parseInt($(columns[3]).text());

                if (targetLevel.toUpperCase() === 'ALL' || rowLevel === Number(targetLevel)) {
                    const rowData = {
                        'COURSE TITLE': $(columns[0]).text(),
                        'COURSE CODE': $(columns[1]).text(),
                        'UNIT': parseInt($(columns[2]).text()),
                        'LEVEL': rowLevel,
                        'COURSE STATUS': $(columns[4]).text()
                    };
                    filteredRows.push(rowData);
                }
            });

            return filteredRows;
        };

        const filteredData = parseAndFilterData(tableData, level);
        let jsonData = {};

        if (filteredData.length > 0) {
            jsonData = {
                message: 'success',
                data: filteredData
            };
        } else {

            jsonData = {
                message: 'Level Not Found',
                data: null
            };
        }

        res.status(200).json(jsonData)

    } catch (error) {
        console.error('Error sending request:', error.message);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }

});



module.exports = router; 