const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const validateProfileInput = require("../../validations/profile");
const validateExperienceInput = require("../../validations/experience");
const validateEducationInput = require("../../validations/education");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "there is no profile for this user.";
          return res.status(400).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

//get all profile

router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(400).json(errors);
      }
      res.json(profiles);
    })
    .catch((err) => {
      res.status(404).json({ profiles: "There are no profiles" });
    });
});

//to get array of all the handles..

router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user.";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

//get profile by id
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user.";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) => {
      res.status(404).json({ profile: "There is no profile for this user" });
    });
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
    }

    const profileFeilds = {};
    profileFeilds.user = req.user.id;
    if (req.body.handle) profileFeilds.handle = req.body.handle;
    if (req.body.company) profileFeilds.company = req.body.company;
    if (req.body.website) profileFeilds.website = req.body.website;
    if (req.body.bio) profileFeilds.bio = req.body.bio;
    if (req.body.status) profileFeilds.status = req.body.status;
    if (req.body.githubusername)
      profileFeilds.githubusername = req.body.githubusername;

    if (typeof req.body.skills !== undefined) {
      profileFeilds.skills = req.body.skills.split(",");
    }

    profileFeilds.social = {};

    if (req.body.youtube) profileFeilds.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFeilds.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFeilds.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFeilds.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFeilds.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFeilds },
          { new: true }
        ).then((profile) => res.json(profile));
      } else {
        Profile.findOne({ handle: profileFeilds.handle }).then((profile) => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }

          new Profile(profileFeilds)
            .save()
            .then((profile) => res.json(profile));
        });
      }
    });
  }
);

// add experience

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };
      profile.experience.unshift(newExp);
      profile.save().then((profile) => res.json(profile));
    });
  }
);

//add education

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        const newEdu = {
          school: req.body.school,
          degree: req.body.degree,
          location: req.body.location,
          feildofstudy: req.body.feildofstudy,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description,
        };
        profile.education.unshift(newEdu);
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(errors));
  }
);

//delete experience

router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        //get remove index
        const removeIndex = profile.experience
          .map((item) => item.id)
          .indexOf(req.params.exp_id);
        //remove that index by splicing out of array
        profile.experience.splice(removeIndex, 1);

        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);

router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        //get remove index
        const removeIndex = profile.education
          .map((item) => item.id)
          .indexOf(req.params.edu_id);
        //remove that index by splicing out of array
        profile.education.splice(removeIndex, 1);

        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);

//delete user and profile

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
