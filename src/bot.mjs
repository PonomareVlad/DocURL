import Utils from "./utils.mjs";
import {Bot, InlineKeyboard} from "grammy/web";
import {fmt, hydrateReply, link} from "@grammyjs/parse-mode";

const {TELEGRAM_BOT_TOKEN} = process.env;

export const bot = new Bot(TELEGRAM_BOT_TOKEN);

bot.use(hydrateReply);

bot.on(":photo", async ctx => {
    const mime_type = "image/jpeg";
    const file = Utils.parseFile(ctx.msg);
    const {message_id: reply_to_message_id} = ctx.msg;
    const {text, reply_markup} = getReply({mime_type, ...file});
    return ctx.replyFmt(text, {reply_to_message_id, reply_markup});
});

bot.on(":file", async ctx => {
    const file = Utils.parseFile(ctx.msg);
    const {text, reply_markup} = getReply(file);
    const {message_id: reply_to_message_id} = ctx.msg;
    return ctx.replyFmt(text, {reply_to_message_id, reply_markup});
});

bot.on("msg", async ctx => ctx.reply(`Send me any file`));

const getReply = file => {
    const viewURL = Utils.apiURL(file, "view");
    const downloadURL = Utils.apiURL(file, "download");
    const reply_markup = new InlineKeyboard().url("View", viewURL).url("Download", downloadURL);
    const text = fmt`${link("View", viewURL)} and ${link("Download", downloadURL)} links for this file`;
    return {text, reply_markup};
}

export default bot;
