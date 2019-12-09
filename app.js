var express = require("express"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose = require("mongoose"),
bodyParser = require("body-parser"),
app = express();


//app config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost:27017/blog_app",{useNewUrlParser: true, useUnifiedTopology: true});


//schema config
var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body : String,
    created : {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);


//Routes
//INDEX route
app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs",function(req, res){
    Blog.find({},function(err,blogs){
       if(err){
           console.log(err);
       } else{
            res.render("index", {blogs:blogs});
       }
    });
});

//NEW route
app.get("/blogs/new", function(req, res){
   res.render("new"); 
});

//CREATE route
app.post("/blogs",function(req, res){
   //create the post
   Blog.create(req.body.blog,function(err,newBlog){
       if(err){
           console.log(err);
       } else{
           res.redirect("/blogs");
       }
   });
});

//SHOW route
app.get("/blogs/:id",function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       }else{
           res.render("show", {blog: foundBlog});
       }
   });
});

//EDIT route
app.get("/blogs/:id/edit",function(req, res){
   Blog.findById(req.params.id,function(err, editBlog){
       if(err){
           res.redirect("/blogs");
       }else{
           res.render("edit",{blog: editBlog})
       }
   }) 
});

//UPDATE route
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
});

//DELETE route
app.delete("/blogs/:id",function(req, res){
   Blog.findByIdAndDelete(req.params.id,function(err,deletedBlog){
       if(err){
           console.log(err);
       }else{
           console.log(deletedBlog);
           res.redirect("/blogs");
       }
   }) 
});

//listen on port
app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Blog app server is running!"); 
});