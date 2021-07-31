const express = require('express');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const _ = require('lodash');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

//Connecting to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

//Creating Schema
const articleSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    content: {
        required: true,
        type: String
    }
})

//Creating a model
const Article = mongoose.model("article", articleSchema);

//Routes
//------------Request Targeting all articles
app.route('/articles')

    .get((req, res) => {
        //Querying DB to return all articles
        Article.find({}, (err, results) => {
            if (!err) {
                res.send(results);
            }
            else {
                res.send(err);
            }

        })
    })

    .post((req, res) => {

        const postArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        postArticle.save(err => {
            if (!err) {
                res.send("Successfully added a new article");
            }
            else {
                res.send(err);
            }
        });
    })

    .delete((req, res) => {
        Article.deleteMany(err => {
            if (!err) {
                res.send("Successfully deleted all articles");
            }
            else {
                res.send(err);
            }
        })
    });


//------------Request Targeting a specific article
app.route('/articles/:title')

    .get((req, res) => {
        const title = req.params.title;

        Article.findOne({ title: title }, (err, result) => {
            if (!err) {
                if (result) {
                    res.send(result);
                }
                else {
                    res.send("No article matching that title was found")
                }

            }
            else {
                res.send(err);
            }
        })

    })

    .put((req, res) => {

        Article.updateOne({ title: req.params.title }, { title: req.body.title, content: req.body.content },
            (err) => {
                if (!err) {
                    res.send("Succesfully updated the article");
                }
                else {
                    res.send(err);
                }
            }
        )
    })

    .patch((req, res) => {
        Article.updateOne({ title: req.params.title },
            { $set: req.body },
            (err) => {
                if (!err) {
                    res.send("Successfully updated an article");
                }
                else {
                    res.send(err);
                }
            }
        )
    })

    .delete((req, res) => {
        Article.deleteOne({ title: req.params.title }, (err) => {
            if (!err) {
                res.send("Deleted an article");
            }
            else {
                res.send(err);
            }
        })
    });



//Setting up server 
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started on Port");
})