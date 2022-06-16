# Build your own Weather Phone IVR with Realtime API

📖 [Read the full guide](https://developer.signalwire.com/apis/docs/weather-phone-in-nodejs-with-signalwire-realtime-api)

This code sample is a simple weather phone IVR application that uses the [SignalWire Realtime API](https://developer.signalwire.com/client-sdk/reference/rt-exports) to provide current weather report to the caller in Washington DC either as a phone call or text.

### 📞 Dial [+17712093222](tel:+17712093222) ☎ for a **live demo** of this code.

---

### To run this sample

1. Fill in the Project ID and the API token from your SignalWire dashboard in the `.env.sample` file.
2. Buy a number from the SignalWire Dashboard, configure it to use Relay with context `office`.
3. Add that number to the `.env.sample` file under `PHONE_NUMBER`.
4. Rename the `.env.sample` file to `.env`.
5. Run this with `yarn install` then `yarn start` in the project directory.
   Alternatively, you can use Docker instead:

   a. `docker build . -t weather-ivr` to build the container using the dockerfile already in the repo.

   b. `docker run -d weather-ivr` to run it.

For more information on how to run this sample, or for a more detailed guide, please read the [guide](https://developer.signalwire.com/apis/docs/weather-phone-in-nodejs-with-signalwire-realtime-api).
