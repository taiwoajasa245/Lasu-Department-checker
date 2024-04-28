require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const courseRoute = require('./routes/courseRoute');

// swagger documentation testing
const swaggerUi = require('swagger-ui-express');
// const swaggerSpec = require('./swaggerSpec.js');





const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LASU Course API ',
      version: '1.0.0',
      description: 'get the list of all courses with the Course Title , Course Code , The UNIT of the course , LEVEL, Course Status',
    },    
    servers: [
        {
          url: "/",
          description: "Test Api",
        },
        {
          url: "/api-docs",
          description: "api documentation and testing",
        },
      ],
  },
  apis:  ["routes/*.js"], // Path to your API route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);





















// Serve Swagger UI

// custom css
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.6.2/swagger-ui.min.css";


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec,  { customCssUrl: CSS_URL }));


app.use(express.static('public'));


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



// routes
app.use("/", courseRoute); 


// send an error message to unknow endpoint
app.all('*', (req, res) => {
    res.status(404).json({ status: 404,  message: " Page Not Found " });
});


app.listen(PORT, () => { console.log(`Server running on ${PORT}`) });