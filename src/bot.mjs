import {Bot} from "grammy/web";

const {
    VERCEL_URL,
    TELEGRAM_BOT_TOKEN,
    API_URL = VERCEL_URL
} = process.env;

export const bot = new Bot(TELEGRAM_BOT_TOKEN);

const parseFile = m => m.photo !== undefined
    ? m.photo[m.photo.length - 1]
    : m.animation ??
    m.audio ??
    m.document ??
    m.video ??
    m.video_note ??
    m.voice ??
    m.sticker;

const setURLParams = (url = new URL(`http://localhost`), params = {}) => {
    Object.entries(params).filter(([_, value]) => value).forEach(param => url.searchParams.set(...param));
    return url;
}

bot.on(":file", async ctx => {
    const {file_id, mime_type, file_name} = parseFile(ctx.msg);
    const url = new URL(`https://${API_URL}/api/download`);
    setURLParams(url, {file_id, mime_type, file_name});
    return ctx.reply(url);
});

bot.on("msg", async ctx => ctx.reply(`Send me any file`));

export default bot;
