require('dotenv').config()
const {RestClient} = require('@signalwire/compatibility-api')

const username = process.env.PROJECT_ID
const token = process.env.API_TOKEN
const spaceURL = process.env.SPACE_URL

const client = RestClient(username, token, {signalwireSpaceUrl: spaceURL})

module.exports = async function (context, req) {
    
    context.log('JavaScript HTTP trigger function processed a request.');

    const {receiver, sender, callUrl} = req.body

    let responseBody = {}

    await client.calls.create({to: receiver, from: sender, url: callUrl}).then(response => {
        responseBody = response
    }, error => {
        responseBody = error.message
    })

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseBody
    };
}