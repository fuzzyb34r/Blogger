import express from "express"
import bodyParser from "body-parser"

const app = express()
const port = 3000
const posts_and_titles_map = new Map(); // Map of {key,value} pairs that will correspond to user
                                        // blog titles and posts in order to keep track of them

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.render("index.ejs");
});


app.post("/create-and-view", (req, res) => {
    posts_and_titles_map.set(req.body["title"], req.body["body"]);

    res.render("index.ejs",
        {
            posts_and_titles: posts_and_titles_map,
        }
    );
});


app.post("/edit-post", (req, res) => {
    const title_to_edit = req.body.edit;
    const body_to_edit = posts_and_titles_map.get(title_to_edit);
    
    res.render("edit.ejs",
        {
            blog_post_title_to_edit: title_to_edit,
            blog_post_body_to_edit: body_to_edit
        }
    );
});


app.post("/update-post", (req, res) => {
    const old_title = req.body.oldTitle;

    // Remove the old entry
    posts_and_titles_map.delete(old_title);

    // Add the updated entry
    posts_and_titles_map.set(req.body.title, req.body.body);

    // Render the home page immediately with the updated map
    res.render("index.ejs", {
        posts_and_titles: posts_and_titles_map
    });
});


app.post("/delete-post", (req, res) => {
    const title_to_delete = req.body.delete;
    posts_and_titles_map.delete(title_to_delete);
    
    // console.log(`Deleted: ${title_to_delete}`);
    
    // Redirect back to the main page to show the updated list
    if (posts_and_titles_map.size !== 0) {
        res.render("index.ejs",
            {
                posts_and_titles: posts_and_titles_map
            }
        );
    }
    else {
        res.redirect("/");
    }
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
