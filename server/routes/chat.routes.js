import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
  getChatDetails,
  sendAttachments,
  renameGroup,
  deleteChat,
  getMessages,
} from "../controllers/chat.controller.js";
import { multerUpload } from "../middlewares/multer.middleware.js";
import {
  addMemberValidator,
  chatIdValidator,
  newGroupValidator,
  removeMemberValidator,
  validateHandler,
  renameGroupValidator,
  sendAttachmentsValidator,
} from "../lib/validators.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/new", newGroupValidator(), validateHandler, newGroupChat);
router.get("/my/chats", getMyChats);
router.get("/my/groups", getMyGroups);
router.put("/addmembers", addMemberValidator(), validateHandler, addMembers);
router.delete(
  "/removemember",
  removeMemberValidator(),
  validateHandler,
  removeMember
);
router.delete("/leave/:Id", chatIdValidator(), validateHandler, leaveGroup);
router.post(
  "/message",
  multerUpload.array("attachments", 5),
  sendAttachmentsValidator(),
  validateHandler,
  sendAttachments
);
router.get("/messages/:Id", chatIdValidator(), validateHandler, getMessages);
router
  .route("/:Id")
  .get(chatIdValidator(), validateHandler, getChatDetails)
  .put(renameGroupValidator(), validateHandler, renameGroup)
  .delete(chatIdValidator(), validateHandler, deleteChat);

export default router;
