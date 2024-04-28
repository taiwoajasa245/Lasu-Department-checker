# LASU Course API

This is a Node.js application built with Express that demonstrates web scraping using Axios and Cheerio, as well as integration with an external API. It provides endpoints for retrieving department information based on selected faculty and filtering courses by level.

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install the dependencies.

## Usage

1. Start the server by running `npm start`.
2. Open your web browser and go to `http://localhost:3000` to access the application.
3. Use the provided UI to select a faculty and view its associated departments.
4. Select a department to view its courses.
5. Optionally, filter courses by level.

## Endpoints

- `GET /`: Renders the homepage.
- `POST /get-dept`: Retrieves department information based on selected faculty.
- `POST /dept-courses`: Retrieves and filters courses based on department and level.

## Technologies Used

- Node.js
- Express.js
- Axios
- Cheerio
- CORS


## Project Structure:

```
LASU DEPARTMENT CHECKER/
|
├── public/
│   ├── scripts.js
│   └── style.css
│   └── other files
│
├── views/
│   ├── index.ejs
|
├── util/
│   ├── spec.js
│
├── .env
├── .gitignore
├── package.json
├── server.js
└── README.md

```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
