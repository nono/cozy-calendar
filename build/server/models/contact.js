// Generated by CoffeeScript 1.10.0
var Contact, cozydb;

cozydb = require('cozydb');

module.exports = Contact = cozydb.getModel('Contact', {
  fn: String,
  n: String,
  datapoints: [Object],
  revision: String,
  note: String,
  tags: [String],
  revision: String,
  accounts: String,
  title: String,
  org: String,
  bday: String,
  url: String,
  initials: String,
  sortedName: String,
  ref: String
});

Contact.prototype.asNameAndEmails = function() {
  var emails, name, ref, ref1, ref2, simple;
  name = this.fn || ((ref = this.n) != null ? ref.split(';').slice(0, 2).join(' ') : void 0);
  emails = (ref1 = this.datapoints) != null ? ref1.filter(function(dp) {
    return dp.name === 'email';
  }) : void 0;
  return simple = {
    id: this.id,
    name: name || '?',
    emails: emails || [],
    hasPicture: ((ref2 = this._attachments) != null ? ref2.picture : void 0) != null
  };
};
