const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

AWS.config.update({
  region: 'eu-central-1',
});

class Table {
  constructor(tableName) {
    this.tableName = tableName;
    this.docClient = new AWS.DynamoDB.DocumentClient();
  }

  async create(item) {
    item.id = uuidv4();

    const params = {
      TableName: this.tableName,
      Item: item,
    };

    await this.docClient.put(params).promise();
    return item;
  }

  async update(item) {
    const params = {
      TableName: this.tableName,
      Item: item,
    };

    await this.docClient.put(params).promise();
    return item;
  }

  async get(key) {
    console.log(key);
    console.log(this.tableName);
    return (await this.docClient
      .get({ TableName: this.tableName, Key: key })
      .promise()).Item;
  }

  async scan(key) {
    return (await this.docClient
      .scan({ TableName: this.tableName, Key: key })
      .promise()).Items;
  }

  async delete(key) {
    return (await this.docClient
      .delete({
        TableName: this.tableName,
        Key: key,
      })
      .promise()).Attributes;
  }
}

module.exports = Table;
