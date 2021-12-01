import express from "express";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { blogsValidation } from "./validation.js";
import { validationResult } from "express-validator";

const blogPostRouter = express.Router();

const blogsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "posts.json"
);
console.log(blogsJSONPath);
const getBlogs = () => JSON.parse(fs.readFileSync(blogsJSONPath));
const writeBlogs = (content) =>
  fs.writeFileSync(blogsJSONPath, JSON.stringify(content));

// 1. Post blogPost
blogPostRouter.post("/", blogsValidation,  (req, res, next) => {
  try {
    const errorList = validationResult(req);

    if (!errorList.isEmpty()) {
      next(createHttpError(400, { errorList }));
    } else {
      const newPost = { ...req.body, createdAt: new Date(), id: uniqid() };
      const blogPost = getBlogs();
      blogPost.push(newPost);

      writeBlogs(blogPost);

      res.status(201).send({ id: newPost.id });
    }
  } catch (error) {
    next(error);
  }
});

// 2. Get all blogPosts
blogPostRouter.get("/", (req, res, next) => {
  try {
    console.log(req.body);
    const blogs = getBlogs();
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});

// 3. Get single blogPost
blogPostRouter.get("/:blogId", (req, res, next) => {
  try {
    console.log(req.body);

    const blogs = getBlogs();
    const blog = blogs.find((b) => b.id === req.params.blogId);
    
    if (blog) {
        res.send(blog);
    } else {
      next(createHttpError(404, `Blog with id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

// 4. Put/ Edit blogPost
blogPostRouter.put("/:blogId", (req, res, next) => {
  try {
    const errorList = validationResult(req);

    if (!errorList.isEmpty()) {
      next(createHttpError(400, { errorList }));
    } else {
      const blogs = getBlogs();
      const index = blogs.findIndex(blog => blog.id === req.params.blogId)
      const editedPost = { ...blogs[index], ...req.body }
      blogs[index] = editedPost
      writeBlogs(blogs)
      res.send(editedPost)
    }
  } catch (error) {
    next(error);
  }
});

// 5. Delete blogPost
blogPostRouter.delete("/:blogId", (req, res, next) => {
  try {

    const blogs = getBlogs();
    const blogsLeft = blogs.filter(blog => blog.id !== req.params.blogId)
    writeBlogs(blogsLeft)
    res.status(203).send()
  } catch (error) {
    next(error);
  }
});

export default blogPostRouter;