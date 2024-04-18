import storage from "node-persist";

/**
 * Given a call object, connects the caller to the specified destination number.
 * During the call, listens for DTMF '**' and, if one is provided by the callee,
 * marks the caller as a scammer and hangs up the destination number. The
 * original call remains active.
 *
 * @param {*} call
 * @param {*} destinationNumber
 * @returns false if the number gets marked as scammer, true if the call ends
 * without getting marked as scammer.
 */
export async function transfer(call, destinationNumber) {
  // Connect the call to our real phone number
  let dial;
  try {
    dial = await call.connectPhone({
      to: destinationNumber,
      from: call.from,
      timeout: 30,
    });
  } catch (e) {
    await call.playTTS({
      text: "Sorry, there was an error completing your call, Goodbye!",
    });
    await call.hangup();
    return;
  }

  // Detect if the user presses '**'. If so, mark caller as spammer.
  let dialed = "";
  dial.listen({
    onDetectUpdated: async (detect) => {
      if (detect.type === "digit") {
        const digit = detect.result;
        console.log("Dialed", digit);
        dialed += digit;

        if (dialed.endsWith("**")) {
          console.log("Marking as scammer");
          await storage.set(call.from, { isHuman: true, isScammer: true });
          dial.hangup(); // Hangup the nested call
        }
      }
    },
  });

  await dial
    .detectDigit({
      timeout: 0,
    })
    .onStarted();

  // Wait until the nested call ends
  await dial.disconnected();

  const { isScammer } = await storage.get(call.from);
  console.log("isScammer:", isScammer);

  return isScammer;
}
