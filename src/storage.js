const AWS = require('aws-sdk');
const { promisify } = require('util');
const uuidv4 = require('uuid/v4');

AWS.config.update({
  region: 'eu-central-1',
});

const docClient = new AWS.DynamoDB.DocumentClient();
const DYNAMO_DB_TABLE_NAME = 'availability-calendar';

async function putCandidate(ownerId, calendar) {
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

async function getCandidate(ownerId, candidateId) {
  return (await docClient
    .get({ TableName: DYNAMO_DB_TABLE_NAME, Key: { ownerId, id: candidateId } })
    .promise()).Item;
}

async function listCandidates(ownerId) {
  return (await docClient
    .scan({ TableName: DYNAMO_DB_TABLE_NAME, Key: { ownerId } })
    .promise()).Items;
}

async function deleteCandidate(ownerId, calendarId) {
  return (await docClient
    .delete({
      TableName: DYNAMO_DB_TABLE_NAME,
      Key: { ownerId, id: calendarId },
    })
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
  putCandidate,
  getCandidate,
  getAvailabilityCalendarByAccessToken,
  deleteCandidate,
  listCandidates,
};
