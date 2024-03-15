const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const salt = 10;

const db = require('../config/db_connection');

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID} = process.env;

const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,{
    lazyLoading: true
})

var register = (req,res) => {

  const password = req.body.password;
  bcrypt.hash(password.toString(),salt,(err,hash) => {
    if(err){
      return console.log("Error");
    }
    const value = [
      req.body.username,
      req.body.phone,
      hash,
      req.body.businessname,
     ];

     db.query(
      `SELECT * FROM admin WHERE phone = ${req.body.phone}`,
      (err,result) => {
          if(err){
              return res.status(400).send({
                  msg:err
              });
          }

          if(result.length){
              return res.status(200).send({
                  status:"success",
                  msg:"User Already Registerd"
              });
          } else {
            db.query(
              `INSERT INTO admin (username,phone,password,businessname) VALUES (?)`,[value],(err, result) => {
                  if(err){
                   return res.status(400).send({
                       msg:err
                   });
                  }
                  return res.status(200).send({
                   status:"success",
                   msg:"User are registered successfully."
               });
              }
           );
          }

        
      }
  );
     

     

  })
     

    
}

var login = (req,res) => {

    // const errors = validationResult(req);

    // if(!errors.isEmpty()){
    //     return res.status(400).json({ errors:errors.array()});
    // }

    db.query(
      `SELECT * FROM admin WHERE phone = ${req.body.phone}`,
      (err,result) => {
          if(err){
              return res.status(400).send({
                  msg:err
              });
          }

          console.log(result.length);

          if(!result.length){
              return res.status(401).send({
                  msg:"Phone or Password is incorrect"
              });
          }

          bcrypt.compare(req.body.password,result[0].password,(err,data)=>{
               if(err){
                return res.status(400).send({
                  msg:err
              });
               }

               if(data){
                const token =  jwt.sign({ id : result[0]['id']} , JWT_SECRET);
                db.query(
                  `UPDATE admin SET token = '${token}', fcm_token = '${req.body.fcm_token}' WHERE id = '${result[0]['id']}'`
               );
        
                 return res.status(200).send({
                     msg:'Logged In',
                     token,
                     user:result[0]
                 });
               }
          });

        
      }
  );
}

var addcustomer = (req,res) => {
  
  const password = req.body.password;
  bcrypt.hash(password.toString(),salt,(err,hash)=>{
        if(err){
          return console.log("Error");
        }

       const value = [
        req.body.adminid,
        req.body.username,
        req.body.phone,
        hash,
        req.body.address
       ];

        db.query(
          `INSERT INTO users (admin_id,username,phone,password,address) VALUES (?)`,[value],(err, result) => {
              if(err){
               return res.status(400).send({
                   msg:err
               });
              }
              return res.status(200).send({
               status:"success",
               msg:"Customer Created Successfully."
              
           });
          }
       );
  })
    
}

const getcustomer = (req,res) => {

    // const authtoken = req.headers.authorization.split(' ')[1];
    // const decode = jwt.verify(authtoken, JWT_SECRET);

    db.query('SELECT * FROM users WHERE admin_id=?', [req.params.id],(error, result) => {
        if(error) {
          return res.status(400).send({
              msg:err
          });
        }

        return res.status(200).send({
          success: true,
          message:"Data Successfully",
          data: result
        });
  });

}

const adminchat = (req,res) => {
   
    db.query(
        `INSERT INTO chat (admin_id,c_id,username,phone,price,date,is_admin) VALUES ('${req.body.adminid}','${req.body.cid}','${req.body.username}','${req.body.phone}','${req.body.price}','${req.body.date}','${req.body.isadmin}')`,(err, result) => {
            if(err){
             return res.status(400).send({
                 msg:err
             });
            }
            return res.status(200).send({
             status:"success",
             msg:"Added Successfully."
         });
        }
     );
}

const chats = (req,res) => {

    // const authtoken = req.headers.authorization.split(' ')[1];
    // const decode = jwt.verify(authtoken, JWT_SECRET);

    db.query('SELECT * FROM chat WHERE c_id=?',[req.params.id], (error, result) => {
        if(error) {
          return res.status(400).send({
              msg:err
          });
        }

        return res.status(200).send({
          success: true,
          message:"Data Successfully",
          data: result
        });
  });

}


const chatall = (req,res) => {

    // const authtoken = req.headers.authorization.split(' ')[1];
    // const decode = jwt.verify(authtoken, JWT_SECRET);

    db.query('SELECT * FROM chat WHERE admin_id=?',[req.params.id], (error, result) => {
        if(error) {
          return res.status(400).send({
              msg:err
          });
        }

        return res.status(200).send({
          success: true,
          message:"Data Successfully",
          data: result
        });
  });

}

const transaction = (req,res) => {

    // const authtoken = req.headers.authorization.split(' ')[1];
    // const decode = jwt.verify(authtoken, JWT_SECRET);

    db.query('SELECT * FROM chat WHERE admin_id=?', [req.params.id], (error, result) => {
        if(error) {
          return res.status(400).send({
              msg:err
          });
        }

        return res.status(200).send({
          success: true,
          message:"Data Successfully",
          data: result
        });
  });

}

const deletechat = (req,res) => {

    // const authtoken = req.headers.authorization.split(' ')[1];
    // const decode = jwt.verify(authtoken, JWT_SECRET);

    db.query('DELETE FROM chat WHERE id=?',[req.params.id], (error, result) => {
        if(error) {
          return res.status(400).send({
              msg:err
          });
        }

        return res.status(200).send({
          success: true,
          message:"Chat Deleted Successfully",
        });
  });

}


const editchat = (req,res) => {

    // const authtoken = req.headers.authorization.split(' ')[1];
    // const decode = jwt.verify(authtoken, JWT_SECRET);
    const data = [req.body.price,req.params.id];

    db.query('UPDATE chat SET price=? WHERE id=?',data, (error, result) => {
        if(error) {
          return res.status(400).send({
              msg:err
          });
        }

        return res.status(200).send({
          success: true,
          message:"Chat Edited Successfully",
        });
  });

}

const profile = (req,res) => {

    // const authtoken = req.headers.authorization.split(' ')[1];
    // const decode = jwt.verify(authtoken, JWT_SECRET);

    db.query('SELECT * FROM admin WHERE id=?', [req.params.id],(error, result) => {
        if(error) {
          return res.status(400).send({
              msg:err
          });
        }

        return res.status(200).send({
          success: true,
          message:"Data Successfully",
          data: result
        });
  });

}

const editprofile = (req,res) => {

    // const authtoken = req.headers.authorization.split(' ')[1];
    // const decode = jwt.verify(authtoken, JWT_SECRET);
    const data = [req.body.username,req.body.phone,req.body.address,req.body.businessname,req.params.id];

    db.query('UPDATE admin SET username=?,phone=?,address=?,businessname=? WHERE id=?',data, (error, result) => {
        if(error) {
          return res.status(400).send({
              msg:error
          });
        }

        return res.status(200).send({
          success: true,
          message:"Profile Edited Successfully",
        });x
  });

}


// customer api


var 
customerlogin = (req,res) => {

  // const errors = validationResult(req);

  // if(!errors.isEmpty()){
  //     return res.status(400).json({ errors:errors.array()});
  // }

 

  db.query(
  
      `SELECT * FROM users WHERE phone = ${req.body.phone}`,
      (err,result) => {
          if(err){
              return res.status(400).send({
                  msg:err
              });
          }

          if(!result.length){
              return res.status(401).send({
                  msg:"Phone or Password is incorrect"
              });
          }

          bcrypt.compare(req.body.password,result[0].password,(err,data)=>{
               if(err){
                return res.status(400).send({
                  msg:err
              });
               }

               if(data){
                const token =  jwt.sign({ id : result[0]['id']} , JWT_SECRET);
                db.query(
                  `UPDATE users SET token = '${token}', fcm_token = '${req.body.fcm_token}' WHERE id = '${result[0]['id']}'`
               );
        
                 return res.status(200).send({
                     msg:'Logged In',
                     token,
                     user:result[0]
                 });
               }
          });

        
      }
  );

}

const customerprofile = (req,res) => {

  // const authtoken = req.headers.authorization.split(' ')[1];
  // const decode = jwt.verify(authtoken, JWT_SECRET);

  db.query('SELECT * FROM users WHERE id=?', [req.params.id],(error, result) => {
      if(error) {
        return res.status(400).send({
            msg:error
        });
      }

      return res.status(200).send({
        success: true,
        message:"Data Successfully",
        data: result
      });
});

}

const totalshow = (req,res) => {

  // const authtoken = req.headers.authorization.split(' ')[1];
  // const decode = jwt.verify(authtoken, JWT_SECRET);
  const data = [req.body.totalshow,req.params.id];

  db.query('UPDATE users SET total_show=? WHERE id=?',data, (error, result) => {
      if(error) {
        return res.status(400).send({
            msg:err
        });
      }

      return res.status(200).send({
        success: true,
        message:"Total Show Successfully",
      });
});

}

const notification = (req,res) => {

  // const authtoken = req.headers.authorization.split(' ')[1];
  // const decode = jwt.verify(authtoken, JWT_SECRET);
  const data = [req.body.notification,req.params.id];

  db.query('UPDATE admin SET notification=? WHERE id=?',data, (error, result) => {
      if(error) {
        return res.status(400).send({
            msg:err
        });
      }

      return res.status(200).send({
        success: true,
        message:"Notification Successfully",
      });
});

}

const changepassword = (req,res) => {

  // const authtoken = req.headers.authorization.split(' ')[1];
  // const decode = jwt.verify(authtoken, JWT_SECRET);
  const password = req.body.password;

  db.query(
    `SELECT * FROM admin WHERE id = ${req.params.id}`,
    (err,result) => {
        if(err){
            return res.status(400).send({
                msg:err
            });
        }

        bcrypt.compare(req.body.cpassword,result[0].password,(err,data)=>{
          if(err){
           return res.status(400).send({
             msg:err
         });
          }

          if(!data){
           return res.status(200).send({
             msg:"Please Enter Valid Current Password"
         });
          }
          if(data){
           bcrypt.hash(password.toString(),salt,(err,hash)=>{
             if(err){
               return console.log("Error");
             }
       const data = [hash,req.params.id];
     
       db.query('UPDATE admin SET password=? WHERE id=?',data, (error, result) => {
           if(error) {
             return res.status(400).send({
                 msg:err
             });
           }
     
           return res.status(200).send({
             success: true,
             message:"Password Change Successfully",
           });
           
     });
     })
          }
     });
      
    }
);
  

}

const chatoption = (req,res) => {

  // const authtoken = req.headers.authorization.split(' ')[1];
  // const decode = jwt.verify(authtoken, JWT_SECRET);
  const data = [req.body.editchat,req.params.id];

  db.query('UPDATE admin SET editchat=? WHERE id=?',data, (error, result) => {
      if(error) {
        return res.status(400).send({
            msg:err
        });
      }

      return res.status(200).send({
        success: true,
        message:"Chat Editing Successfully",
      });
});

}


const sendotp = async (req, res) => {
  try {
    const otpresponse = await client.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verifications.create({
        to: `+91${req.body.phone}`,
        channel: "sms",
      });
      res.status(200).send(`OTP send successfully! : ${JSON.stringify(otpresponse)}`);
  } catch (error) {
    res.status(error?.status || 400).send(error?.message || 'Something went wrong!');
  }

}


const verifyotp = async (req, res) => {
  try {
    const verifyresponse = await client.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `+91${req.body.phone}`,
        code: req.body.otp,
      });
      res.status(200).send(`OTP Verified successfully! : ${JSON.stringify(verifyresponse)}`);
  } catch (error) {
    res.status(error?.status || 400).send(error?.message || 'Something went wrong!');
  }

}


module.exports = {
    register,
    login,
    addcustomer,
    getcustomer,
    adminchat,
    chats,
    transaction,
    deletechat,
    editchat,
    profile,
    editprofile,
    customerlogin,
    customerprofile,
    chatall,
    totalshow,
    changepassword,
    chatoption,
    sendotp,
    verifyotp,
    notification
}