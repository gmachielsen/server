const User = require("../models/user");


exports.makeApplicant = async (req, res) => {
    try {
        const {phone, website} = req.body;
        const user = await User.findById(req.user._id).exec();
        const applicant = await User.findByIdAndUpdate(
            user._id,
            {
            $addToSet: { role: "Applicant" },
            phone: phone,
            website: website,
            },
            { new: true }
        )
            .select("-password")
            .exec();
        res.json(applicant);
        } catch (err) {
        console.log(err);
    }
}

exports.getApplicants = async (req, res) => {
    try {
        const applicants = await User.find({role: "Applicant"}).exec();
        res.json(applicants);
    } catch (err) {
        console.log(err);
    }
}

exports.approveApplicant = async (req, res) => {
    const { email } = req.body;
    console.log(email, "komtie in de controller");
    try {
        const applicant = await User.findOne({email: email}).exec();
        console.log(applicant, "aiah approvedapplicant");
        let { approvedApplicant } = await User.findByIdAndUpdate(
                applicant._id,
                {
                $addToSet: { role: "ApprovedApplicant" },
                },
                { new: true }
        ).exec();
        let { readyToBecomeInstructor } = await User.findByIdAndUpdate(
            applicant._id,
            {
                $pull: { role: "Applicant" },
            },
            { new: true }
        ).exec();
        res.json(approvedApplicant);
    } catch (err) {
        console.log(err);
    }
}