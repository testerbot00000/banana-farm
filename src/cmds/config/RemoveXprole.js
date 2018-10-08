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
const {Argument, Command, CommandResult} = require("patron.js");
const db = require("../../services/database.js");
const message = require("../../services/message.js");
const {options} = require("../../services/data.js");
module.exports = new class RemoveXprole extends Command {
  constructor() {
    super({
      ...options.command,
      args: [new Argument({
        example: "Regular",
        key: "role",
        name: "role",
        remainder: true,
        type: "role"
      })],
      description: "Configures a role to not be unlocked by XP.",
      groupName: "config",
      names: ["removexprole", "rx"]
    });
  }
  async run(msg, args) {
    const removed = await db.removeXprole(args.role.id);
    if(removed) {
      return message.create(
        msg.channel,
        `${args.role.mention} is no longer unlocked by XP.`,
        "good"
      );
    }
    return CommandResult.fromError(
      `${args.role.mention} is already not unlocked by XP.`
    );
  }
}();
