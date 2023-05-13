import bot from "../src/bot.mjs";
import {json} from "edge-grammy";

export const config = {runtime: "edge"};

const {TELEGRAM_BOT_TOKEN} = process.env;

const getFileURL = file_path => `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${file_path}`;

export default async ({url}) => {
    try {
        const {searchParams} = new URL(url);
        const query = Object.fromEntries(searchParams.entries());
        const {
            file_id,
            file_name,
            mime_type = "application/octet-stream"
        } = query || {};
        console.debug(query);
        if (!file_id) return json({status: false}, {status: 404});
        const file = await bot.api.getFile(file_id);
        console.debug(file);
        const {file_path} = file || {};
        if (!file_path) return json({status: false}, {status: 404});
        const filename = file_name || file_path.split("/").pop();
        const headers = {
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Type": mime_type
        };
        const {body, status, statusText} = await fetch(getFileURL(file_path));
        return new Response(body, {headers, status, statusText});
    } catch (e) {
        console.error(e);
        return json({status: false}, {status: 500});
    }
}
