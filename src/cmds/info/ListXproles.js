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
const {Command, CommandResult} = require("patron.js");
const db = require("../../services/database.js");
const message = require("../../services/message.js");
const number = require("../../utils/number.js");
const {options} = require("../../services/data.js");
const str = require("../../utils/string.js");
function nameRole(msg, role) {
  return str.escapeMarkdown(msg.channel.guild.roles.get(role.role_id).name);
}
module.exports = new class ListXproles extends Command {
  constructor() {
    super({
      ...options.command,
      description: "Lists the roles unlocked by XP in a server.",
      groupName: "info",
      names: ["listxproles", "lx"]
    });
  }
  async run(msg) {
    const xproles = await db.getXproles(msg.channel.guild.id);
    if(xproles.length === 0) {
      return CommandResult.fromError(
        "this server has no roles unlocked by XP."
      );
    }
    await message.dm(msg.author, {
      description: xproles
        .sort((a, b) => b.unlocked_at - a.unlocked_at)
        .map(x => `• ${nameRole(msg, x)}: ${number.format(x.unlocked_at)} XP`)
        .join("\n"),
      title: `${msg.channel.guild.name}'s XP roles`
    }, "neutral");
  }
}();
