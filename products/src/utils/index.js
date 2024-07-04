const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const amqplib = require("amqplib");

const {
  APP_SECRET,
  BASE_URL,
  EXCHANGE_NAME,
  MSG_QUEUE_URL,
} = require("../config");

const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

const GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

const ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {

  console.log({ enteredPassword, savedPassword, salt })
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

const GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

const ValidateSignature = async (req) => {

  try {
    const signature = req.get("authorization");

    console.log({ signature })

    const payload = jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};


module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};



//Message Broker

const CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MSG_QUEUE_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(EXCHANGE_NAME, "direct", { durable: true });
    return channel;
  } catch (err) {
    throw err;
  }
};

// const PublishMessage = async (channel, service, msg) => {

//   console.log({ channel, service, msg })
//   await channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
//   console.log("Sent: ", msg);
// };


// const PublishMessage = async (channelPromise, queueName, message) => {
//   try {
//     const channel = await channelPromise;
//     await channel.assertQueue(queueName, { durable: true });
//     channel.sendToQueue(queueName, Buffer.from(message));
//     console.log(`Message sent to queue ${queueName}: ${message}`);
//   } catch (error) {
//     console.error('Failed to send message', error);
//   }
// };


const PublishMessage = async (channel, service, msg) => {
  try {
    const channelProm = await channel;
    channelProm.publish(EXCHANGE_NAME, service, Buffer.from(msg));
    console.log("Sent: ", msg);
  } catch (error) {
    console.log("error: ", error);

  }
}










module.exports = {
  CreateChannel, PublishMessage, ValidateSignature,
  GenerateSignature, ValidatePassword, GenerateSalt


}
