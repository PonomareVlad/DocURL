import {json} from "edge-grammy";

const {
    VERCEL_URL,
    TELEGRAM_BOT_TOKEN,
    API_URL = VERCEL_URL
} = process.env;

export const status = (status = 404) => json({status}, {status});

export const getFileURL = (file_path, api = "api.telegram.org") => {
    return `https://${api}/file/bot${TELEGRAM_BOT_TOKEN}/${file_path}`;
};

export const apiURL = ({file_id, mime_type, file_name} = {}, path = "download") => {
    const url = new URL(`https://${API_URL}/api/${path}`);
    setURLParams(url, {file_id, mime_type, file_name});
    return url.href;
}

export const getHeaders = (name, mime = "application/octet-stream", context = "attachment") => ({
    "Content-Disposition": [context, name ? `filename="${name}"` : undefined].filter(Boolean).join("; "),
    "Content-Type": mime
});

export const setURLParams = (url = new URL(`http://localhost`), params = {}) => {
    Object.entries(params).filter(([_, value]) => value).forEach(param => url.searchParams.set(...param));
    return url;
}

export const getFile = async (bot, url) => {
    const {searchParams} = new URL(url);
    const query = Object.fromEntries(searchParams.entries());
    const {file_id, file_name, mime_type} = query;
    if (!file_id) return {file_id, file_name, mime_type};
    const file = await bot.api.getFile(file_id);
    const {file_path} = file || {};
    if (!file_path) return {file_path, file_id, file_name, mime_type};
    return {
        file_name: file_name || file_path.split("/").pop(),
        file_path,
        mime_type,
        file_id
    }
}

export const parseFile = m => m.photo !== undefined
    ? m.photo[m.photo.length - 1]
    : m.animation ??
    m.audio ??
    m.document ??
    m.video ??
    m.video_note ??
    m.voice ??
    m.sticker;

export default {
    setURLParams,
    getHeaders,
    getFileURL,
    parseFile,
    getFile,
    apiURL,
    status
}
