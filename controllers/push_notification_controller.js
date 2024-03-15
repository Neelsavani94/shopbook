var admin = require("firebase-admin");
var FCM = require("fcm-node");
var serviceAccount = require("../config/push-notification.json");
var fcm = new FCM(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

exports.sendPushNotification = function (req, res, next) {
    try {
        let message = {
            notification: {
                title: req.body.username,
                body: req.body.price
            },
            data: {
               username: req.body.username, // Assuming username and price are correct keys
               price: req.body.price
            },
            token: req.body.fcm_token,
        };
        const response = admin.messaging().send(message);
        fcm.send(message, function(err, response){
            
                console.log("Successfully sent message:", response);
                return res.status(200).json({ message: "Notification Sent" });
        
        });
    } catch (error) {
        console.error("Caught an error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
