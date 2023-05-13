import bot from "../src/bot.mjs";
import Utils from "../src/utils.mjs";

export const config = {runtime: "edge"};

export default async ({url}) => {
    try {
        const {file_path, file_name, mime_type} = await Utils.getFile(bot, url);
        if (!file_path) return Utils.status();
        const headers = Utils.getHeaders(file_name, mime_type, "inline");
        const {body, status, statusText} = await fetch(Utils.getFileURL(file_path));
        return new Response(body, {headers, status, statusText});
    } catch (e) {
        console.error(e);
        return Utils.status(500);
    }
}
