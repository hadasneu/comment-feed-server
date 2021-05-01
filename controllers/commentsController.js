const md5 = require("md5");
const Comment = require("../models/Comment");
const User = require("../models/User");

function getComments(req, res) {
    const { skip, limit, searchField } = req.query;
    const emailFilter = searchField
        ? { email: { $regex: new RegExp(searchField, "i") } } : {};
    const select = { _id: 1 };

    User.find(emailFilter, select)
        .then(users => {
            if (users.length > 0) {
                const usersIds = users.map(user => user._id);
                const userFilter = { user: {$in: usersIds } };

                Comment.find(userFilter).populate("user")
                    .limit(parseInt(limit)).skip(parseInt(skip))
                    .then(comments => {
                        Comment.find(userFilter).countDocuments()
                            .then(count => {
                                return res.status(200).json({ comments: comments, count: count });
                            })
                            .catch(err => {
                                console.error(err);
                                return res.status(500).json({ error: "Failed to get comments" });
                            });
                    })
                    .catch(err => {
                        console.error(err);
                        return res.status(500).json({ error: "Failed to get comments" });
                    });
            } else {
                return res.status(200).json({ comments: [], count: 0 });
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: "Failed to get comments" });
        });

};

function saveComment (req, res) {

    let { email, message } = req.body
    email = email.trim().toLowerCase();

    User.findOne({ email: email })
        .then(async user => {
            if (!user) {
                user = new User({
                    email: email,
                    imageURL: `https://www.gravatar.com/avatar/${md5(email)}`,
                    lastActiveAt: Date.now()
                });
            } else {
                user.set({ lastActiveAt: Date.now() })
            }
            user = await user.save()
                .then(result => result)
                .catch(err => {
                    console.error(err);
                    return res.status(500).json({ error: "Failed to save comment." });
                });
            return user;
        })
        .then(user => {
            const comment = new Comment({
                user: user._id,
                content: message
            });
            comment.save()
                .then(comment => {
                    comment.user = user;
                    return res.status(200).json({ comment: comment });
                })
                .catch(err => {
                    console.error(err);
                    return res.status(500).json({ error: "Failed to save comment." });
                });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: "Failed to save comment." });
        });
}

module.exports = {
    getComments: getComments,
    saveComment: saveComment
};
