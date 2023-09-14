import { exit } from "process"
import { Telegraf } from "telegraf"
import checkIfLive from "./checkIfLive"

const twilio = require('twilio')(Bun.env.TWILIO_SID, Bun.env.TWILIO_TOKEN)

// Ensure env vars are set
if (!Bun.env.BOT_TOKEN || !Bun.env.CHAT_ID) {
  let errorMessage = "";

  if (!Bun.env.BOT_TOKEN) {
    errorMessage += "BOT_TOKEN is missing. ";
  }

  if (!Bun.env.CHAT_ID) {
    errorMessage += "CHAT_ID is missing. ";
  }

  console.log(errorMessage.trim()); // Trim any leading/trailing spaces
  exit(1);
}


const CHAT_ID = Bun.env.CHAT_ID

let markedLive = false

const bot = new Telegraf(Bun.env.BOT_TOKEN)

async function check() {
  const currentlyLive = await checkIfLive("xqc")
  if (currentlyLive && !markedLive) {
    markedLive = true
    bot.telegram.sendMessage(CHAT_ID, "xqc is live!")
    // send text message
    twilio.messages.create({
      body: "xqc is live",
      from: Bun.env.TWILIO_PHONE,
      to: Bun.env.CONTACT_PHONE
    }).then(() => {
      console.log(`Text message sent`)
    })
  }

  if (markedLive && !currentlyLive) {
    markedLive = false
    bot.telegram.sendMessage(CHAT_ID, "xqc has gone offline")
  }
  console.log(`markedLive: ${markedLive}\ncurrentlyLive: ${currentlyLive}`)
}

check()

setInterval(async () => {
  check()
}, 5 * 60 * 1000) // 5mins


// send initial message letting me know 
bot.telegram.sendMessage(CHAT_ID, "Checking for xqc live status")

process.on('SIGINT', () => {
  console.log('Received SIGINT. Gracefully shutting down...');
  try {
    bot.stop("SIGINT")
  } catch {
    
  }
  process.exit(0);
});
