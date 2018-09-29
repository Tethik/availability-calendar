const AWS = require('aws-sdk');
const { promisify } = require('util');
const uuidv4 = require('uuid/v4');

AWS.config.update({
  region: 'eu-central-1',
});

const docClient = new AWS.DynamoDB.DocumentClient();
const DYNAMO_DB_TABLE_NAME = 'availability-calendar';

async function writeAvailabilityCalendar(calendar) {
  if (!calendar.id) {
    calendar.id = uuidv4();
  }
  const params = {
    TableName: DYNAMO_DB_TABLE_NAME,
    Item: calendar,
  };

  await docClient.put(params).promise();
  return calendar;
}

async function getAvailabilityCalendar(calendarId) {
  return (await docClient
    .get({ TableName: DYNAMO_DB_TABLE_NAME, Key: { id: calendarId } })
    .promise()).Item;
}

module.exports = {
  writeAvailabilityCalendar,
  getAvailabilityCalendar,
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
