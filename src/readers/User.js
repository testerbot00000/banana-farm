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
const {TypeReader, TypeReaderResult} = require("patron.js");
const client = require("../services/client.js");
const message = require("../services/message.js");
const {regexes} = require("../services/data.js");
const str = require("../utils/string.js");
function handleMatches(cmd, matches) {
  let users = matches;
  if(users.length === 0) {
    return;
  }else if(users.length === 1) {
    return TypeReaderResult.fromSuccess(users[0]);
  }else if(users.length > 3) {
    const more = `${users.length - 3} more`;
    users = users.slice(0, 3).map(u => message.tag(u));
    users.push(more);
  }else{
    users = users.map(u => message.tag(u));
  }
  return TypeReaderResult.fromError(
    cmd,
    `I found multiple users: ${str.list(users)}.`
  );
}
module.exports = new class User extends TypeReader {
  constructor() {
    super({type: "user"});
  }
  async read(cmd, msg, arg, args, val) {
    const lowerVal = val.toLowerCase();
    const id = val.match(regexes.user);
    if(id != null) {
      const user = await message.getUser(id[id.length - 2]);
      if(user == null) {
        return TypeReaderResult.fromError(
          cmd,
          "I was unable to find that user."
        );
      }
      return TypeReaderResult.fromSuccess(user);
    }
    let result = client.users.find(
      u => `${u.username}#${u.discriminator}` === val
    );
    if(result != null)
      return result;
    result = handleMatches(cmd, client.users.filter(
      u => `${u.username.toLowerCase()}#${u.discriminator}` === lowerVal
    ));
    if(result != null)
      return result;
    result = handleMatches(
      cmd,
      client.users.filter(u => u.username.toLowerCase().startsWith(lowerVal))
    );
    if(result != null) {
      return result;
    }else if(msg.channel.guild == null) {
      return TypeReaderResult.fromError(
        cmd,
        "I was unable to find that user."
      );
    }
    result = handleMatches(cmd, msg.channel.guild.members.filter(
      m => m.nick != null && m.nick.toLowerCase() === lowerVal
    ).map(m => m.user));
    if(result != null)
      return result;
    result = handleMatches(cmd, msg.channel.guild.members.filter(
      m => m.nick != null && m.nick.toLowerCase().startsWith(lowerVal)
    ).map(m => m.user));
    if(result != null)
      return result;
    return TypeReaderResult.fromError(cmd, "I was unable to find that user.");
  }
}();
