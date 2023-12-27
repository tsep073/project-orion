/*jshint esversion: 9 */
/*jshint -W018 */
/*jshint -W069 */
/*jshint -W083 */
/*jshint -W088 */
/*jshint -W038 */

var utils = require("../utils");

module.exports = function (defaultFuncs, api, ctx) {
    return function unsendMessage(messageID, callback) {
        var resolveFunc = function () {};
        var rejectFunc = function () {};
        var returnPromise = new Promise(function (resolve, reject) {
            resolveFunc = resolve;
            rejectFunc = reject;
        });

        if (!callback) {
            callback = function (err, friendList) {
                if (err) {
                    return rejectFunc(err);
                }
                resolveFunc(friendList);
            };
        }

        var form = {
            message_id: messageID,
        };

        defaultFuncs
            .post("https://www.facebook.com/messaging/unsend_message/", ctx.jar, form)
            .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
            .then(function (resData) {
                if (resData.error) {
                    throw resData;
                }

                return callback();
            })
            .catch(function (err) {
                return callback(err);
            });

        return returnPromise;
    };
};
