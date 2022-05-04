require("dotenv").config()
const axios =  require('axios')

// PROJECT_ID and API_TOKEN are environment variable added in the .env file
// Azure Functions uses the Application settings. You can access that from your

const projectID = process.env.PROJECT_ID
const token = process.env.API_TOKEN
const spaceURL = process.env.SPACE_URL


// Initialize the auth object for authentication when making 
// a call to signalwire api
const auth = {
    username: projectID,
    password: token
}


// API url name to make our POST call too
const apiUrl = `https://${spaceURL}/api/laml/2010-04-01/Accounts/${projectID}/Messages`

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Get the receiver, sender and message params from the body
    // It makes use of the destructuring in NodeJs
    const {receiver, sender, message} = req.body

    // An empty object to save the response from axios
    let responseMessage = null

    // Axios call to the signalwire api
    await axios.post(apiUrl, {
        To: receiver,
        From: sender,
        Body: message
    }, {auth}).then(response=> {

        // appending response from the axios call to the {responseMessage} object
        responseMessage = response.data

    }, error => {
        console.log(error.message)
    })

    // return the response of the axios call in a json format
    context.res =  {
        body: responseMessage
    }
    
}