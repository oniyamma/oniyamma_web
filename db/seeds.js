var mongodb    = require('mongodb');

// Clean adn set seeds
mongodb.MongoClient.connect("mongodb://localhost:27017/oniyanma", function(err, database) {
  var users = database.collection("users");
  var logs  = database.collection("logs");  
  // Clean collections
  users.drop();
  logs.drop();
  // Set seeds values
  users.save({ 'name': 'Taro' });
  users.save({ 'name': 'Jiro' });
  users.save({ 'name': 'Saburo' });
  console.log('Finished.');
  process.exit();
});