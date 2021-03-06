const db = require("../models");

module.exports = function (app) {
    app.post("/api/users", (req, res) => {
        const newUser = new db.User({
            username: req.body.username
        })

        newUser.save((err, user) => {
            if (err) console.error(err)

            return res.json({
                username: user.username,
                _id: user._id
            })
        })
    });

    app.get("/api/users", (req, res) => {
        db.User.find({})
            .then((users) => {
                const result = users.map(user => ({
                    username: user.username,
                    _id: user._id
                }));

                res.json(result)
            })
            .catch((err) => console.error(err))
    });

    app.post("/api/users/:_id/exercises", (req, res) => {
        const date = req.body.date > 0 ? new Date(req.body.date) : new Date();

        const exData = {
            description: req.body.description,
            duration: parseInt(req.body.duration),
            date: date.toDateString()
        };

        const newExercise = new db.Exercise(exData);

        newExercise.save()
            .then((exercise) => {
                db.User.findOneAndUpdate({ _id: req.params._id },
                    { $push: { log: exercise }, $inc: { count: 1 } }, (err, user) => {
                        if (err) console.error(err)

                        const result = {
                            username: user.username,
                            description: exercise.description,
                            duration: exercise.duration,
                            _id: user._id,
                            date: exercise.date.toDateString(),
                        }
                        res.json(result)
                    })
            })

    });

    app.get("/api/users/:_id/logs", (req, res) => {
        const from = req.query.from ? new Date(req.query.from) : null;
        const to = req.query.to ? new Date(req.query.to) : null;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        let dateObj;

        if (from && to) {
            dateObj = {
                $gte: from,
                $lte: to
            }
        } else if (from) {
            dateObj = {
                $gte: from
            }
        } else if (to) {
            dateObj = {
                $lte: to
            }
        }

        var populate = {
            path: "log",
            match: dateObj ? {
                date: dateObj
            } : {},
            options: limit ? {
                limit: limit
            } : {}
        };


        db.User.findById(req.params._id)
            .populate(populate)
            .catch((err) => console.error(err))

            .then((user) => {
                let result = {
                    _id: user._id,
                    username: user.username,
                    count: user.count ? user.count : 0,
                    log: []
                };

                if (from) result.from = from.toDateString();
                if (to) result.to = to.toDateString();

                if (user.log) {
                    user.log.forEach(log => {

                        let currentLog = {
                            description: log.description,
                            duration: log.duration,
                            date: log.date.toDateString()
                        }
                        result.log.push(currentLog);
                    })
                }


                res.json(result)
            })
    });

}