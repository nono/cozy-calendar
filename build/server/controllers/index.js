// Generated by CoffeeScript 1.10.0
var Contact, Event, Tag, User, WebDavAccount, async, cozydb, log, moment;

async = require('async');

moment = require('moment');

cozydb = require('cozydb');

log = require('printit')({
  date: true,
  prefix: 'calendar:client'
});

Tag = require('../models/tag');

Event = require('../models/event');

Contact = require('../models/contact');

User = require('../models/user');

WebDavAccount = require('../models/webdavaccount');

module.exports.index = function(req, res, next) {
  return async.parallel([
    function(done) {
      return Contact.all(function(err, contacts) {
        var contact, i, index, len;
        if (err) {
          return done(err);
        }
        for (index = i = 0, len = contacts.length; i < len; index = ++i) {
          contact = contacts[index];
          contacts[index] = contact.asNameAndEmails();
        }
        return done(null, contacts);
      });
    }, function(cb) {
      return Tag.byName({}, cb);
    }, function(cb) {
      return Event.calendars(cb);
    }, function(cb) {
      var end, start;
      start = moment().startOf('month').subtract(3, 'months');
      end = moment().startOf('month').add(3, 'months');
      return Event.load(start, end, function(err, events) {
        return Event.request('reccuring', function(err, reccuringEvents) {
          return cb(null, events.concat(reccuringEvents));
        });
      });
    }, function(cb) {
      return cozydb.api.getCozyInstance(cb);
    }, function(cb) {
      return WebDavAccount.first(cb);
    }, function(cb) {
      if (User.timezone != null) {
        return cb(null, User.timezone);
      } else {
        return User.updateUser(function() {
          return cb(null, User.timezone);
        });
      }
    }
  ], function(err, results) {
    var calendars, contacts, events, instance, locale, sanitize, tags, timezone, webDavAccount;
    if (err) {
      return next(err);
    }
    contacts = results[0], tags = results[1], calendars = results[2], events = results[3], instance = results[4], webDavAccount = results[5], timezone = results[6];
    locale = (instance != null ? instance.locale : void 0) || 'en';
    if (webDavAccount != null) {
      webDavAccount.domain = (instance != null ? instance.domain : void 0) || '';
    }
    timezone = timezone || 'UTC';
    sanitize = function(obj) {
      return "JSON.parse(decodeURI(\"" + (encodeURI(JSON.stringify(obj))) + "\"));";
    };
    return res.render('index', {
      imports: "window.locale = \"" + locale + "\";\nwindow.inittags = " + (sanitize(tags)) + ";\nwindow.initcalendars = " + (sanitize(calendars)) + ";\nwindow.initevents = " + (sanitize(events)) + "\nwindow.initcontacts = " + (sanitize(contacts)) + ";\nwindow.webDavAccount = " + (sanitize(webDavAccount)) + ";\nwindow.timezone = " + (sanitize(timezone)) + ";"
    });
  });
};

module.exports.logClient = function(req, res) {
  var ref;
  log.error(req.body.data);
  log.error((ref = req.body.data.error) != null ? ref.stack : void 0);
  return res.send('ok');
};
