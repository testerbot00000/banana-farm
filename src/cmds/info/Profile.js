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
const {Argument, ArgumentDefault, Command} = require("patron.js");
const db = require("../../services/database.js");
const message = require("../../services/message.js");
const number = require("../../utils/number.js");
const {options, responses} = require("../../services/data.js");
const str = require("../../utils/string.js");
module.exports = new class Profile extends Command {
  constructor() {
    super({
      ...options.command,
      args: [new Argument({
        defaultValue: ArgumentDefault.Member,
        example: "shug#1710",
        key: "user",
        name: "user",
        preconditions: ["in_guild"],
        remainder: true,
        type: "user"
      })],
      description: "Displays your profile or a specified user's profile.",
      groupName: "info",
      names: ["profile", "me"]
    });
  }
  async run(msg, args) {
    const now = Date.now();
    const {reset_every} = await db.getGuild(
      msg.channel.guild.id,
      "reset_every"
    );
    const member = await db.getMember(msg.channel.guild.id, args.user.id);
    await message.create(msg.channel, reset_every === 0 ? str.format(
      responses.profileXp,
      args.user.id === msg.author.id ? "You" : "They",
      number.format(member.xp_total),
      now - member.xp_cd >= 6e5 ? "1.0" : number.format(member.xp_mult, 1),
      ""
    ) : str.format(
      responses.profileXp,
      args.user.id === msg.author.id ? "You" : "They",
      number.format(member.xp_amount),
      now - member.xp_cd >= 6e5 ? "1.0" : number.format(member.xp_mult, 1),
      ` (${number.format(member.xp_total)} all-time XP)`
    ), "neutral");
  }
}();
