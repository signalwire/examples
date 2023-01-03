# Interactive Live Streaming Demo

📖 [Read the full guide](https://developer.signalwire.com/guides/video/interactive-live-streaming)

## Get started

Create a file at `server/.env`, with the following information:

```
# server/.env

PROJECT_ID=<signalwire-project-id>
API_TOKEN=<signalwire-api-key>
SPACE_URL=<signalwire-space-url>.signalwire.com
```

Make sure that your API token has the Video and PubSub scopes enabled.

Then install the dependencies with `npm install` and run the server and the client with `npm run start`.
