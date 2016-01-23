var https = require('https');
var request = require('request');

var hue_api_base = 'http://10.0.1.2/api/f2283243130578f2d90474cc9ba917/';
var hues_map = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "5",
  "5": "6",
  "6": "7",
  "7": "8",
  "8": "9",
  "9": "10",
  "10": "11",
  "11": "12",
  "12": "13",
  "13": "14",
  "14": "15",
  "15": "16",
  "16": "17",
  "17": "18",
  "18": "19",
  "19": "20",
  "20": "21",
  "21": "22",
  "22": "23",
  "23": "24",
  "24": "25",
  "25": "26",
  "26": "27",
  "27": "28",
  "28": "29",
  "29": "30",
  "30": "31",
  "31": "32",
  "32": "33",
  "33": "34",
  "34": "35",
  "35": "37",
  "36": "36"
};

var Red = 1;
var Green = 40001;
var White = 14910;

exports.Hue = {
  apply_emotion: function(emotion_param) {
    console.log(emotion_param);
    var smile = emotion_param.smile || 0;
    this.call_hue(['18', '16', '15'], smile);
  },
  call_hue: function(hueNumbers, smile) {
    hueNumbers.forEach(function(hueNumber) {
      var options = {
        url: hue_api_base + 'lights/' + hues_map[hueNumber] + '/state/',
        method: 'PUT',
        headers: {  'Content-Type': 'application/json' },
        json: true,
        form: JSON.stringify({
          'on': true,
          'sat': 144,
          'bri': 254,
          'hue': 50 < smile ? Red : White
        })
      };
      console.log(options.url);
      request(options, function(error, response, body){
          // console.log(body);
      });
    });
  }
}