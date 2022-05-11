const ChatDoc = require("../models/chatDocs");

const addChatDoc = async (req, res) => {
  try {
    const { chatId, docData } = req.body;

    if (!chatId) {
      throw { message: "Chat id required" };
    }

    let data = await ChatDoc.findOne({ chatId });
    if (!data) {
      data = new ChatDoc({
        chatId,
      });
    }
    data.chatDoc.push(docData);
    data.save();
    return res.send(data);
  } catch (e) {
    return res.status(500).send(e);
  }
};

const getChatDoc = async (req, res) => {
  try {
    const { chatId } = req.body;
    if (!chatId) {
      throw { message: "Chat id required" };
    }
    const data = await ChatDoc.findOne({ chatId });
    if (data) {
      return res.send({ data: data.chatDoc });
    } else {
      return res.send({ data: [] });
    }
  } catch (e) {
    return res.status(500).send(e);
  }
};

module.exports = {
  addChatDoc,
  getChatDoc,
};
