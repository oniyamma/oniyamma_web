var mongoose = require('mongoose');

// User's schema
exports.User = mongoose.model('User', new mongoose.Schema({
     name: { type: String },
     image_file_name: { type: String }
}));

// Log's schema
exports.Log = mongoose.model('Log', new mongoose.Schema({
     type: { type: String },
     image_file_name: { type: String },
     created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
     created_at: { type: Date }
}));