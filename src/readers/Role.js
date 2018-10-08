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
const {regexes} = require("../services/data.js");
const str = require("../utils/string.js");
function handleMatches(cmd, matches) {
  let roles = matches;
  if(roles.length === 0) {
    return;
  }else if(roles.length === 1) {
    return TypeReaderResult.fromSuccess(roles[0]);
  }else if(roles.length > 3) {
    const more = `${roles.length - 3} more`;
    roles = roles.slice(0, 3).map(r => r.mention);
    roles.push(more);
  }else{
    roles = roles.map(r => r.mention);
  }
  return TypeReaderResult.fromError(
    cmd,
    `I found multiple roles: ${str.list(roles)}.`
  );
}
module.exports = new class Role extends TypeReader {
  constructor() {
    super({type: "role"});
  }
  async read(cmd, msg, arg, args, val) {
    const lowerVal = val.toLowerCase();
    const id = val.match(regexes.role);
    if(id != null) {
      const role = msg.channel.guild.roles.get(id);
      if(role == null) {
        return TypeReaderResult.fromError(
          cmd,
          "I was unable to find that role."
        );
      }
      return TypeReaderResult.fromSuccess(role);
    }
    const roles = Array.from(msg.channel.guild.roles.values());
    let result = handleMatches(cmd, roles.filter(r => r.name === val));
    if(result != null)
      return result;
    result = handleMatches(
      cmd,
      roles.filter(r => r.name.toLowerCase() === lowerVal)
    );
    if(result != null)
      return result;
    result = handleMatches(
      cmd,
      roles.filter(r => r.name.toLowerCase().startsWith(lowerVal))
    );
    if(result != null)
      return result;
    return TypeReaderResult.fromError(
      cmd,
      "I was unable to find that role."
    );
  }
}();
