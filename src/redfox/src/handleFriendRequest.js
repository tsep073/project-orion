/*jshint esversion: 9 */
/*jshint -W018 */
/*jshint -W069 */
/*jshint -W083 */
/*jshint -W088 */
/*jshint -W038 */;

var utils = require("../utils");

module.exports = function (defaultFuncs, api, ctx) {
    return function handleFriendRequest(userID, accept, callback) {
        if (utils.getType(accept) !== "Boolean") {
            throw {
                error: "Please pass a boolean as a second argument.",
            };
        }

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
            viewer_id: ctx.userID,
            "frefs[0]": "jwl",
            floc: "friend_center_requests",
            ref: "/reqs.php",
            action: accept ? "confirm" : "reject",
        };

        defaultFuncs
            .post("https://www.facebook.com/requests/friends/ajax/", ctx.jar, form)
            .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
            .then(function (resData) {
                if (resData.payload.err) {
                    throw {
                        err: resData.payload.err,
                    };
                }

                return callback();
            })
            .catch(function (err) {
                return callback(err);
            });

        return returnPromise;
    };
};
