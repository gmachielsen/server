const express = require("express");
const router = express.Router();
const formidable = require("express-formidable");

// middleware
const { requireSignin } = require("../middlewares");


const {
    administrator,
    listOfUsers,
    createCoverContent,
    getCoverContent,
    uploadImage,
    removeImage,
    uploadVideo,
    removeVideo,
    update,
    getCover,
    createCategory,
    getCategory,
    putCategory,
    removeCategory,
    listCategories,
    createSubcategory,
    getSubCategory,
    putSubCategory,
    removeSubCategory,
    listSubCategories,
    getSubs,
} = require("../controllers/admin");
router.get("/get-covercontent", getCoverContent)

router.get("/admin", requireSignin, administrator);
router.get("/listOfUsers", requireSignin, listOfUsers);

router.post("/post-covercontent", requireSignin, createCoverContent)
router.put("/put-covercontent", requireSignin, update);
router.post("/post-coverphoto", requireSignin, uploadImage)
router.delete("/remove-coverphoto", requireSignin, removeImage)
router.post("/post-covervideo", requireSignin, formidable(), uploadVideo);
router.delete("/remove-covervideo", requireSignin, removeVideo);

// categories
router.post("/admin/create-category", requireSignin, createCategory);
router.get("/admin/get-category/:slug", requireSignin, getCategory);
router.put("/admin/update-category/:slug", requireSignin, putCategory);
router.delete("/admin/remove-category/:slug", requireSignin, removeCategory);
router.get("/admin/categories", requireSignin, listCategories)

// subcategories
router.get("/category/subcategories/:_id", getSubs);
router.post("/admin/createsubcategory", requireSignin, createSubcategory);
router.get("/admin/get-subcategory/:slug", requireSignin, getSubCategory);
router.put("/admin/update-subcategory/:slug", requireSignin, putSubCategory);
router.delete("/admin/remove-subcategory/:slug", requireSignin, removeSubCategory);
router.get("/admin/subcategories", requireSignin, listSubCategories);



// router.get("/getcover", getCover)


module.exports = router;

