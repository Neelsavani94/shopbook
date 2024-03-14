// var admin  = require("firebase-admin");
// var FCM = require("fcm-node");

// var serviceAccount = require("../config/push-notification.json");

// const certpath = admin.credential.cert(serviceAccount);

// var fcm = new FCM(serviceAccount);

// exports.sendPushNotification = (req, res, next) => {
//     try {
//         let message = {
//             notification: {
//                 title: "Shop Book",
//                 body: "Neel Radhe  250"
//             },
//             data: {
//                username: "Neel Radhe",
//                price: "250"
//             },
//             token: req.body.fcm_token,
//         };

//         FCM.send(message, function(err, resp){
//             console.log(err);
//             if(err){
//                 return res.status(500).send({
//                     message:err
//                 })
//             } else {
//                 return res.status(200).send({
//                     message:"Notification Sent"
//                 })
//             }
//         })
        
//     } catch (error) {
        
//     }
// }
