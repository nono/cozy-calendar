americano = require 'americano-cozy'
User = require './user'

module.exports = Alarm = americano.getModel 'Alarm',
    action       : type : String, default: 'DISPLAY'
    trigg        : type : String
    description  : type : String
    timezone     : type : String
    timezoneHour : type : String
    rrule        : type : String
    tags         : type : (x) -> x # DAMN IT JUGGLING
    related      : type : String, default: null


Alarm.all = (params, callback) ->
    Alarm.request "all", params, callback

Alarm.tags = (callback) ->
    Alarm.rawRequest "tags", group: true, (err, results) ->
        return callback err if err
        out = calendar: [], tag: []
        for result in results
            [type, tag] = result.key
            out[type].push tag
        callback null, out

# before sending to the client
# set the trigg in TZ time
Alarm::timezoned = (timezone) ->
    throw new Error "buggy alarm" + @id if not @trigg
    timezone ?= User.timezone
    timezonedDate = new Date @trigg
    @timezone ?= timezone
    @trigg = timezonedDate.toString().slice(0, 24)
    return @

# before saving
# take an attributes object
# set the trigg to UTC
# store the TZed trigg in timezoneHour
# @TODO : handling TZ clientside would be better
Alarm.toUTC = (attrs, timezone) ->
    return attrs
