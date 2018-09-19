/**
 * Banana Farm - A Discord bot made for SJBC.
 * Copyright (c) 2018 ElJay#7711
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";
const client = require("../services/client.js");
const {CommandError, Context} = require("patron.js");
const db = require("../services/database.js");
const handler = require("../services/handler.js");
const log = require("../utils/log.js");
const message = require("../services/message.js");
const {regexes, responses} = require("../services/data.js");
const str = require("../utils/string.js");
function handleErrorResult(result) {
  let reply = result.error.message;
  if(result.error.constructor.name === "DiscordHTTPError"
      || result.error.constructor.name === "DiscordRESTError") {
    if(result.error.code === 50007)
      reply = "I cannot DM you. Please allow DMs from server members.";
    else if(result.error.code === 403 || result.error.code === 50013)
      reply = "I don't have permission to do that.";
    else if(result.error.code > 499
        && result.error.code < 600)
      reply = "an unexpected error has occurred, please try again later.";
    else if(result.error.message.startsWith("Request timed out"))
      reply = "the request has timed out, please try again later.";
    else
      log.error(result.error);
  }else{
    log.error(result.error);
    reply = result.error.message;
  }
  return reply;
}
async function handleResult(msg, result, prefix) {
  if(result.success === true
      || result.commandError === CommandError.CommandNotFound
      || result.commandError === CommandError.Cooldown)
    return;
  let reply = `Sorry **${message.tag(msg.author)}**, but`;
  if(result.commandError === CommandError.Exception) {
    reply = handleErrorResult(result);
  }else if(result.commandError === CommandError.BotPermission) {
    if(result.errorReason.includes("sendMessages")
        || result.errorReason.includes("embedLinks"))
      return;
    reply = "I don't have permission to do that.";
  }else if(result.commandError === CommandError.MemberPermission) {
    reply = "you don't have permission to do that.";
  }else if(result.commandError === CommandError.InvalidContext) {
    if(result.context === Context.Guild)
      reply = "this command may only be used in DMs.";
    else
      reply = "this command may only be used in a server.";
  }else if(result.commandError === CommandError.InvalidArgCount) {
    reply = str.format(
      responses.incorrectUsage,
      prefix,
      result.command.getUsage(),
      result.command.getExample()
    );
  }else if(result.commandError === CommandError.Command
      || result.commandError === CommandError.Precondition
      || result.commandError === CommandError.TypeReader) {
    reply = result.errorReason;
  }else if(result.error == null) {
    log.error(result);
    reply = "an unknown error has occured.";
  }else{
    log.error(result.error);
    reply = result.error.message;
  }
  await message.create(msg, reply, "bad");
}
client.on("messageCreate", async msg => {
  if(msg.type !== 0 || msg.author.bot || msg.author.discriminator === "0000"
      || msg.embeds.length !== 0)
    return;
  let prefix = "";
  msg.content = msg.content.replace(regexes.mention, "<@");
  if(msg.channel.type === 0) {
    ({prefix} = await db.getGuild(msg.channel.guild.id, "prefix"));
    if(!msg.content.startsWith(prefix)) {
      if(!msg.content.startsWith(client.user.mention))
        return;
      prefix = client.user.mention;
    }
  }
  const result = await handler.run(msg, prefix.length);
  await handleResult(msg, result, prefix);
});
