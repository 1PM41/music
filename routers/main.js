/**
 * Created by Administrator on 2017/6/16.
 */
var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');
var Article = require('../models/Article');
var data;

//通用数据
router.use(function (req,res,next) {
    data = {
        userInfo: req.userInfo,
        categories: [],
        contents: [],
        rankings: [],
        articles: []
    };
    Category.find().then(function (categories) {
        data.categories = categories;

    });
    Article.find().then(function (articles) {
        data.articles = articles ;
        next();
    });

});

router.get('/',function (req,res,next) {
    res.render('main/welcome',{
        userInfo: req.userInfo
    });
});

router.get('/main',function (req,res,next) {

    data.category = req.query.category || '';
    data.count = 0;
    data.page = Number(req.query.page || 1);
    data.limit = 8;
    data.pages = 0;
    data.sortType = req.query.sort || '';
    var skip =(data.page - 1) * data.limit;
    var where = {};
    if (data.category) {
        where.category = data.category;
    }
    //console.log(req.userInfo);
    //读取所有分类信息
    Article.find().then(function (articles) {
        data.articles = articles ;
    });
    Content.find().sort({ranking:1}).then(function (rankings) {
        data.rankings = rankings;
    });
    Content.where(where).count().then(function (count) {

        data.count = count;
        //计算总页数
        data.pages = Math.ceil(data.count/data.limit);
        //取值不能超过pages
        data.page = Math.min(data.page,data.pages);
        //取值不能小于1
        data.page = Math.max(data.page,1);



        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']);

    }).then(function (sort) {
        //console.log(data.sortType);
        //return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({addTime:-1});
        if (data.sortType == 'likes'){
            //console.log(1);
            return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user','article']).sort({likes:-1});
        }else if (data.sortType == 'views'){
            //console.log(2);
            return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user','article']).sort({views:-1});
        }else {
            //console.log(3);
            return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user','article']).sort({addTime:-1});
        }
    }).then(function (contents) {
        data.contents = contents;
        //console.log(data);
        res.render('main/index', data);
    });
});

router.get('/view',function (req,res) {
    var contentId = req.query.contentid || '';
    Article.find().then(function (articles) {
        data.articles = articles ;
    });
    Content.findOne({
        _id: contentId
    }).then(function (content) {
        data.content = content ;
        //console.log(data);
        content.views++;
        content.save();

        res.render('main/view',data);

    })
});

router.get('/article',function (req,res) {
    var articleId = req.query.articleid || '';
    Article.findOne({
        _id: articleId
    }).then(function (article) {
        data.article = article ;
        //console.log(data);
        res.render('main/article',data);
    })

});

router.get('/about',function (req,res) {
    console.log(data);
    res.render('main/about',data);
});

router.get('/contact',function (req,res) {
    console.log(data);
    res.render('main/contact',data);
});

router.get('/like',function (req,res) {
    var contentId = req.query.contentid || '';
    var likes = req.query.like || '';

    Content.findOne({
        _id: contentId
    }).then(function (content) {
        data.content = content ;
        content.likes++;
        content.save();
        likes = content.likes;
        res.json(likes);
    });

});

module.exports = router;
