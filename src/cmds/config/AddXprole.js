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
const number = require("../../utils/number.js");
const {options} = require("../../services/data.js");
module.exports = new class AddXprole extends Command {
  constructor() {
    super({
      ...options.command,
      args: [new Argument({
        example: "500",
        key: "xp",
        name: "XP",
        preconditionOptions: [{
          max: 1e9,
          min: 1
        }],
        preconditions: ["between"],
        type: "integer"
      }),
      new Argument({
        example: "Regular",
        key: "role",
        name: "role",
        remainder: true,
        type: "role"
      })],
      description: "Configures a role to be unlocked by XP.",
      groupName: "config",
      names: ["addxprole", "ax"]
    });
  }
  async run(msg, args) {
    if(message.canUseRole(msg.channel.guild, args.role) === false)
      return CommandResult.fromError("I can't use that role.");
    await db.updateXprole(msg.channel.guild.id, args.role.id, args.xp);
    await message.create(
      msg.channel,
      `${args.role.mention} is now unlocked at ${number.format(args.xp)} XP.`,
      "good"
    );
  }
}();
