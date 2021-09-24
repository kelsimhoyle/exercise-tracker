var db = require("../models");
import { Request, Response, Application } from "express";
import { Error, } from "mongoose"

import { ExerciseInterface, UserInterface, LogResult } from "../interfaces"

module.exports = function (app: Application) {
    app.post("/api/users", (req: Request, res: Response) => {
        const newUser = new db.User({
            username: req.body.username
        })

        newUser.save((err: Error, user: UserInterface) => {
            if (err) console.error(err)

            return res.json({
                username: user.username,
                _id: user._id
            })
        })
    });

    app.get("/api/users", (req: Request, res: Response) => {
        db.User.find({})
            .then((users: UserInterface[]) => {
                const result = users.map(user => ({
                    username: user.username,
                    _id: user._id
                }));

                res.json(result)
            })
            .catch((err: Error) => console.error(err))
    });

    app.post("/api/users/:_id/exercises", (req: Request, res: Response) => {
        const date = req.body.date.legnth > 0 ? Date.parse(req.body.date) : null;
        const d = date ? new Date(date) : new Date()
        d.toLocaleDateString()

        const exData = {
            description: req.body.description,
            duration: req.body.duration,
            date: d
        };

        const newExercise = new db.Exercise(exData);

        newExercise.save()
            .then((exercise: ExerciseInterface) => {
                db.User.findOneAndUpdate({_id: req.params._id},
                    {$push: {log: exercise}, $inc : {count : 1} }, (err: Error, user: UserInterface) => {
                        if (err) console.error(err)

                        const result = {
                            username: user.username,
                            description: exercise.description,
                            duration: exercise.duration,
                            date: exercise.date.toLocaleDateString("en-US", {weekday: "short", month: "short", day: "2-digit",  year: "numeric"}),
                            _id: user._id
                        }
                        res.json(result)
                    })
            })

    });

    app.get("/api/users/:_id/log", (req: Request, res: Response) => {
        db.User.findById(req.params._id)
            .populate("log")
             .catch((err: Error) => console.error(err))
             
             .then((user: UserInterface) => {
                 let result: LogResult = {
                    username: user.username,
                    _id: user._id,
                    log: []
                 };

                    if (user.log) {
                        user.log.forEach(log => {
                            let currentLog = {
                                description: log.description,
                                duration: log.duration,
                                date: log.date.toLocaleDateString("en-US", {weekday: "short", month: "short", day: "2-digit",  year: "numeric"})
                            }
                            result.log.push(currentLog);
                        })
                    }
                    res.json(result)
        })
    });

}