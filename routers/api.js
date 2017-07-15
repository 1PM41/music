/**
 * Created by Administrator on 2017/6/16.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Content = require('../models/content');
var Contact = require('../models/contact');


//统一返回格式
var responseData;
router.use(function (res,rep,next) {
    responseData= {
        code : 0 ,
        message : ''
    };
    next();
});

router.post('/user/contact',function (req,res,next) {
    //显示前端提交数组
    //console.log(req.body);

    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    var userContact = req.body.userContact;
    var emailReg=/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    var nameReg = /^[\u4e00-\u9fa5\w]{4,}$/;
    var contactReg = /^[\u4e00-\u9fa5\w\s\S]{5,}$/;
    //console.log(nameReg.test(name));
    //用户名是否为空
    if (name == ''  || nameReg.test(name) == false) {
        responseData.code = 1;
        responseData.message = 'Error,please reenter your name more than 4 words!';
        res.json(responseData);
        return;
    }

    if(phone == ''){
        responseData.code = 2;
        responseData.message = 'Error,please reenter the correct phone number!';
        res.json(responseData);
        return;
    }

    if(email == '' || emailReg.test(email) == false){
        responseData.code = 3;
        responseData.message = 'Error,please reenter the correct E-mail!';
        res.json(responseData);
        return;
    }

    if(userContact == '' || contactReg.test(userContact) == false){
        responseData.code = 4;
        responseData.message = 'Error,please reenter the message more than 30 words!';
        res.json(responseData);
        return;
    }

    Contact.findOne({
        name: name,
        phone: phone,
        email: email,
        userContact: userContact
    }).then(function ( msg ) {

        if (msg) {
            //标识数据库有记录
            responseData.code = 5;
            responseData.message = 'Can not send the same msg';
            res.json(responseData);
            return;
        }
        var contact = new Contact({
            name: name,
            phone: phone,
            email: email,
            userContact: userContact
        });
        return contact.save();
    }).then(function (newmsg) {
        responseData.message ='Success';
        res.json(responseData);

    });

});

/*responseData.message ='留言成功,3秒后自动刷新页面';
 res.json(responseData);
 var contact = new Contact({
 name: name,
 phone: phone,
 email: email,
 userContact: userContact
 });
 return contact.save();

 });
 */


router.post('/user/register',function (req,res,next) {
    //显示前端提交数组
    //console.log(req.body);

    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    var nameReg = /^[\u4e00-\u9fa5\w]{4,}$/;
    //用户名是否为空
    if (username == '' || nameReg.test(username) == false ) {
        responseData.code = 1;
        responseData.message = 'Pls enter more than 4 words username';
        res.json(responseData);
        return;
    }
    //密码不能为空
    if(password == '' || nameReg.test(password) == false ){
        responseData.code = 2;
        responseData.message = 'Pls enter more than 4 words password';
        res.json(responseData);
        return;
    }
    //2次密码不一致
    if(password != repassword){
        responseData.code = 3;
        responseData.message = 'The different input';
        res.json(responseData);
        return;
    }
    //用户是否被注册
    User.findOne({
        username: username
    }).then(function ( userInfo ) {
        //显示数据 console.log(userInfo);
        if (userInfo) {
            //标识数据库有记录
            responseData.code = 4;
            responseData.message = 'Invalid username';
            res.json(responseData);
            return;
        }
        //保存用户注册的信息到数据库
        var user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then(function (newUserInfo) {
        //console.log(newUserInfo);
        responseData.message ='Success';
        res.json(responseData);

    });


});


router.post('/user/login',function (req,res,next) {
    //显示前端提交数组
    //console.log(req.body);

    var username = req.body.username;
    var password = req.body.password;


    if(password == '' && username == ''){
        responseData.code = 3;
        responseData.message = 'Enter both';
        res.json(responseData);
        return;
    }
    //用户名是否为空
    if (username == '' ) {
        responseData.code = 1;
        responseData.message = 'Enter username';
        res.json(responseData);
        return;
    }
    //密码不能为空
    if(password == ''){
        responseData.code = 2;
        responseData.message = 'Enter password';
        res.json(responseData);
        return;
    }

    //用户账号密码是否正确
    User.findOne({
        username: username,
        password: password
    }).then(function ( userInfo ) {
        //显示数据 console.log(userInfo);
        if (!userInfo) {
            //标识数据库有记录
            responseData.code = 4;
            responseData.message = 'Error,Pls check';
            res.json(responseData);
            return;
        }
        responseData.message ='Success';
        responseData.userInfo={
            _id : userInfo._id,
            username : userInfo.username
        }
        req.cookies.set('userInfo',JSON.stringify({
            _id : userInfo._id,
            username : userInfo.username
        }));
        res.json(responseData);
        return;

    });
});

//评论展示
router.get('/comment',function (req,res) {
    var contentId = req.query.contentid || '';
    Content.findOne({
        _id: contentId
    }).then(function (content) {
        responseData.data = content.comments;
        res.json(responseData);
        //console.log(responseData);
    })
});


//评论提交
router.post('/comment/post',function (req,res) {
    //内容id
    var contentId = req.body.contentid || '';
    var postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content,
        userpic: req.userInfo.userpic
    };

    //查询当前这篇内容的信息
    Content.findOne({
        _id: contentId
    }).then(function (content) {
        content.comments.push(postData);
        return content.save();
    }).then(function (newContent) {
        responseData.message = 'Success';
        responseData.data = newContent;
        res.json(responseData);
    });
});

/*
 退出
 */
router.get('/user/logout',function (req,res) {
    req.cookies.set('userInfo',null);
    responseData.message = '退出';
    res.json(responseData)
});


module.exports = router;
