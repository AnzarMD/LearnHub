"use strict";
const router   = require("express").Router();
const ctrl     = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middleware/auth");
const upload   = require("../middleware/upload");
const logActivity = require("../middleware/activityLogger");

router.use(authenticate);

// Profile
router.get("/me",         ctrl.getMe);
router.patch("/me/avatar", upload.single("avatar"), ctrl.updateAvatar);

// Admin: full user management
router.get("/",     authorize("ADMIN"), ctrl.getAllUsers);
router.get("/:id",  authorize("ADMIN"), ctrl.getUserById);
router.patch("/:id", authorize("ADMIN"), logActivity("USER_UPDATE","User","User updated"), ctrl.updateUser);
router.delete("/:id", authorize("ADMIN"), logActivity("USER_DELETE","User","User soft-deleted"), ctrl.deleteUser);

// Class assignment
router.post("/assign-class", authorize("ADMIN"), ctrl.assignStudentToClass);
router.post("/link-parent",  authorize("ADMIN"), ctrl.linkParentToStudent);

module.exports = router;
