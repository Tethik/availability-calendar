const AWS = require('aws-sdk');
const { promisify } = require('util');
const uuidv4 = require('uuid/v4');

AWS.config.update({
  region: 'eu-central-1',
});

const docClient = new AWS.DynamoDB.DocumentClient();
const DYNAMO_DB_TABLE_NAME = 'availability-calendar';

async function writeAvailabilityCalendar(calendar) {
  delete calendar.timezone;
  if (!calendar.id) {
    calendar.id = uuidv4();
    calendar.anonymousAccessToken = uuidv4();
  }
  const params = {
    TableName: DYNAMO_DB_TABLE_NAME,
    Item: calendar,
  };

  console.log(calendar);

  await docClient.put(params).promise();
  return calendar;
}

async function getAvailabilityCalendar(calendarId) {
  return (await docClient
    .get({ TableName: DYNAMO_DB_TABLE_NAME, Key: { id: calendarId } })
    .promise()).Item;
}

async function listAvailabilityCalendar(ownerId) {
  return (await docClient
    .scan({ TableName: DYNAMO_DB_TABLE_NAME, Key: { ownerId } })
    .promise()).Items;
}

async function deleteAvailabilityCalendar(calendarId) {
  return (await docClient
    .delete({ TableName: DYNAMO_DB_TABLE_NAME, Key: { id: calendarId } })
    .promise()).Attributes;
}

async function getAvailabilityCalendarByAccessToken(anonymousAccessToken) {
  return (await docClient
    .get({
      TableName: DYNAMO_DB_TABLE_NAME,
      Key: { anonymousAccessToken },
    })
    .promise()).Item;
}

module.exports = {
  writeAvailabilityCalendar,
  getAvailabilityCalendar,
  getAvailabilityCalendarByAccessToken,
  listAvailabilityCalendar,
  deleteAvailabilityCalendar,
};

// async function main() {
//   try {
//     let calendar = { dates: [{ start: 123, end: 435 }] };
//     const { id } = await writeAvailabilityCalendar(calendar);
//     console.log(id);
//     calendar = await getAvailabilityCalendar(id);
//     console.log(calendar);
//     calendar.dates.push({ message: 'hello bianca <3' });
//     await writeAvailabilityCalendar(calendar);
//   } catch (err) {
//     console.error(err);
//   }
// }

// main();
