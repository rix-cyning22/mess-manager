const Message = require("../models/announcement");
const Feedback = require("../models/feedback");

exports.announcementPage = (req, res) => {
    Message
        .find()
        .then(data => {
            res.render("common/announcements.pug", {
                userType: req.session.user.userType,
                announcements: data,
                userId: req.session.user.userId,
                pageTitle: "Announcements",
                username: req.session.user.alias
            });
        })
        .catch(err => console.log(err));
}

exports.postAnnouncement = (req, res) => {
    const currTime = new Date().toISOString();
    const description = req.body.announcement;
    const message = new Message({
        timestamp: currTime, 
        description: description,
        posterName: req.session.user.alias,
        posterId: req.session.user.userId
    })
    message
        .save()
        .then(saved => {
            res.status(200).json({
                timestamp: saved.timestamp,
                description: saved.description,
                posterName: saved.posterName
            })
        })
        .catch(err => { 
            console.log("error: ", err);
            res.status(500).json({ error: "Internal Server Error" });
        })
}

exports.writeFeedback = (req, res) => {
    if (req.session.user.userType == "student")
        res.render("student/write-feedback.pug", {
            date: req.query.day,
            userType: "student",
            pageTitle: "Write Feedback",
            username: req.session.user.alias
        })
}

exports.postFeedback = (req, res) => {
    const breakfast = req.body.breakfast.trim();
    const lunch = req.body.lunch.trim();
    const dinner = req.body.dinner.trim();

    if (breakfast == "" || lunch == "" || dinner == "")
        return res.redirect("/write-feedback?day="+data.date);
    
    const timestamp = new Date();
    const data = {
        date: req.body.date,
        timestamp: timestamp.toISOString(),
        alias: req.session.user.alias,
        breakfast: breakfast,
        lunch: lunch,
        dinner: dinner
    };
    const feedback = new Feedback(data); 
    feedback
        .save()
        .then(saved => {
            res.redirect("/view-feedback?day="+saved.date);
        })
        .catch(err => console.log(err));
}

exports.viewFeedback = (req, res, next) => {
    const day = req.query.day;
    Feedback
        .find({date: day})
        .then(feedback => {
            res.render("common/view-feedback.pug", {
                userType: req.session.user.userType,
                feedbacks: feedback,
                date: day,
                pageTitle: "Feedbacks",
                username: req.session.user.alias
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                errCode: "500",
                err: err 
            })
        })
}

exports.editAnnoucement = (req, res) => {
    Message
        .findOne({
            posterId: req.session.user.userId,
            timestamp: req.body.timestamp
        })
        .then(post => {
            if (!post || post.description == req.body.editText)
                return res.status(400).json({});
            post.description = req.body.editText;
            const todayDate = new Date();
            post.edittedAt = todayDate.toISOString();
            post.save()
                .then(savedPost => {
                    const resSent = {
                        postText: savedPost.description,
                        editTime: savedPost.edittedAt
                    };
                    console.log(resSent);
                    return res.status(200).json(resSent);
                })
        })
}