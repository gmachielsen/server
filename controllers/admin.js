const user = require("../models/user");
const User = require("../models/user");
const Cover = require("../models/cover");
const Category = require("../models/category");
const SubCategory = require("../models/subCategory");
const Course = require("../models/course");

const slugify = require("slugify");

const { nanoid } = require("nanoid");
const AWS = require("aws-sdk");

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const S3 = new AWS.S3(awsConfig);

exports.administrator = async (req, res) => {
    try {
        let user = await User.findById(req.user._id).select("-password").exec();
        if (!user.role.includes("Admin")) {
            return res.sendStatus(403);
        } else {
            res.json({ ok: true });
        }
      } catch (err) {
          console.log(err);
    }
}


exports.listOfUsers = async (req, res) => {
    try {
        let users = await User.find().exec();
        // let users = await User.find({ "email": { $ne: req.user.email }}).exec();
        // { "Country": { $ne: "Netherlands" } }
        res.json(users)
    } catch (err) {
        console.log(err);
    }
}

exports.postCoverPhotoContent = async (req, res) => {
    try {

    } catch (err) {
        console.log(err);
    }
}

exports.getCoverPhotoContent = async (req, res) => {
    try {
        
    } catch (err) {
        console.log(err);
    }
}

exports.uploadImage = async (req, res) => {
    // console.log(req.body);
    try {
      const { image } = req.body;
      if (!image) return res.status(400).send("No image");
  
      // prepare the image
      const base64Data = new Buffer.from(
        image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
  
      const type = image.split(";")[0].split("/")[1];
  
      // image params
      const params = {
        Bucket: "artacademy",
        Key: `${nanoid()}.${type}`,
        Body: base64Data,
        ACL: "public-read",
        ContentEncoding: "base64",
        ContentType: `image/${type}`,
      };
  
      // upload to s3
      S3.upload(params, (err, data) => {
        if (err) {
          console.log(err);
          return res.sendStatus(400);
        }
        console.log(data);
        res.send(data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  

  exports.removeImage = async (req, res) => {
    try {
      const { image } = req.body;
      // image params
      const params = {
        Bucket: image.Bucket,
        Key: image.Key,
      };
  
      // send remove request to s3
      S3.deleteObject(params, (err, data) => {
        if (err) {
          console.log(err);
          res.sendStatus(400);
        }
        res.send({ ok: true });
      });
    } catch (err) {
      console.log(err);
    }
  };


exports.uploadVideo = async (req, res) => {
  try {
    // console.log("req.user._id", req.user._id);
    // console.log("req.params.instructorId", req.params.instructorId);

    if (req.user._id != req.params.instructorId) {
      return res.status(400).send("Unauthorized");
    }

    const { video } = req.files;
    console.log(video);
    if (!video) return res.status(400).send("No video");

    // video params
    const params = {
      Bucket: "artacademy",
      Key: `${nanoid()}.${video.type.split("/")[1]}`, // video/mp4
      Body: readFileSync(video.path),
      ACL: "public-read",
      ContentType: video.type,
    };

    // upload to s3
    S3.upload(params, (err, data) => {
      if(err) {
        console.log(err);
        res.sendStatus(400);
      }
      console.log(data);
      res.send(data);
    });
  } catch (err) {
    console.log(err);
  }
};
  
  
exports.removeVideo = async (req, res) => {
  try {

    if (req.user._id != req.params.instructorId) {
      return res.status(400).send("Unauthorized");
    }

    const { Bucket, Key } = req.body;
    // console.log(video);
    // return;
    // if (!video) return res.status(400).send("No video");

    // video params
    const params = {
      Bucket,
      Key,
    };

    // upload to s3
    S3.deleteObject(params, (err, data) => {
      if(err) {
        console.log(err);
        res.sendStatus(400);
      }
      console.log(data);
      res.send({ ok: true });
    });
  } catch (err) {
    console.log(err);
  }
};
  

exports.update = async (req, res) => {
  try {
    const id = req.body.id
    const coverPhoto = await Course.findOne({ id }).exec();
    console.log("COURSE FOUND => ", coverPhoto);
  
    if (req.user._id != user.role === "Admin") {
      return res.status(400).send("Unauthorized");
    }
  
    const updated = await Course.findOneAndUpdate({slug}, req.body, {
      new: true,
    }).exec();
  
    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};
  

exports.createCoverContent = async (req, res) => {
  try {
    const {title, text, image} = req.body;
    console.log(title, text, image, "njdsbgiufiunou");

      const cover = await new Cover({
          title: req.body.title,
          text: req.body.text,
          image: req.body.image,
  
      }).save();

      res.json(cover);
  } catch (err) {
      console.log(err);
      return res.status(400).send("Cover create failed. Try again");
  }
}

// exports.getCoverContent = async (req, res) => {
//   try {
//       const covers = await Cover.find().exec();
//       res.json(covers);
//   } catch(err) {
//       console.log(err);
//   }
// }

exports.getCoverContent = async (req, res) => {
  const all = await Cover.find({ published: true })
    .exec();
  res.json(all);
  console.log(all, "all")
};

exports.getCover = async (req, res) => {
  try {
    const cover = await Cover.find({ published: true }).lean();
    res.json(cover);
    console.log(cover, "cover cover");
  } catch (err) {
    console.log(err);
  }
}



exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    // const category = await new Category({ name, slug: slugify(name) }).save();
    res.json(await new Category({ name, slug: slugify(name) }).save());


    // const { name } = req.body;
    // const alreadyExist = await Category.findOne({ name: req.body.name })
    // if (alreadyExist) return res.status(400).send("Name is taken");

    // const category = await new Category({ name, slug: slugify(name) }).save();


    // res.json(category)

  } catch (err) {
    console.log(err);
    return res.status(400).send("Category created failed. Try again");
  }
}


exports.getCategory = async (req, res) => {
  try {
    let category = await Category.findOne({ slug: req.params.slug }).exec();
    res.json(category);
    console.log(category, "category form getCategory")
  } catch (err) {

  }
}

exports.putCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate({ slug: req.params.slug }, { name: req.body.name, slug: req.body.name }, { new: true }).exec();    
    res.json(category);
  } catch (err) {
    console.log(err);
  }
}

exports.removeCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ slug: req.params.slug }).exec();
    res.json(category);
  } catch (err) { 
    console.log(err);
  }
}

exports.listCategories = async (req, res) => {
  try {
    categories = await Category.find().exec();
    res.json(categories);
  } catch (err) {
    console.log(err);
  }
}

exports.createSubcategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    res.json(await new SubCategory({ name, parent: category, slug: slugify(name) }).save());

  } catch (err) {
    console.log(err);
    res.status(400).send("Create subcategory failed");

  }
}



exports.putSubCategory = async (req, res) => {
  // const { name, parent } = req.body;
  // console.log(name, parent, "console.logt die??");
  try {
    const updated = await SubCategory.findOneAndUpdate(
      { slug: req.params.slug },
      // { name, parent, slug: slugify(name) },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(400).send("Sucategory update failed");
  }
}

exports.removeSubCategory = async (req, res) => {
  try {
    console.log("slug????", req.params.slug);
    const deleted = await SubCategory.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    console.log(err);
    res.status(400).send("Sub delete failed");
  }
}

exports.listSubCategories = async (req, res) => 
  res.json(await (SubCategory.find({}).sort({ createdAt: -1 }).exec()));


  exports.getSubCategory = async (req, res) => {
    try {
    let subCategory = await SubCategory.findOne({ slug: req.params.slug }).exec();
    console.log(subCategory, "<<<<<----- subcategory")
    res.json(subCategory);
    } catch (err) {
      console.log(err);
    }
  }

exports.getSubs = (req, res) => {
  console.log(req.params._id, "isididjdi")
    SubCategory.find({ parent: req.params._id}).exec((err, subcategories) => {
        if (err) console.log(err);
        res.json(subcategories);
    });
};

//   exports.getSubCategory = async (req, res) => {
//   const subcategory = await SubCategory.findOne({ slug: req.params.slug }).exec();
//   console.log(subcategory, "subsonreion o")
//   const courses = await Course.find({ subcategories: subcategory})
//     .populate("category")
//     .exec();

//     await new Promise(res => setTimeout(res, 500));

//     res.json({
//       subcategory,
//       courses
//     });
// }




