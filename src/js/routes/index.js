import express from "express";
import path from "path";
import {fileURLToPath} from "url";

const router = express.Router();


router.use(express.static('src/views', {
    extensions: ['views', 'ejs']
}));

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/contact_us", (req, res) => {
    res.render("src/views/contact_us");
})


router.get("/about", (req, res) => {
    res.render("src/views/about");
})


export default router;