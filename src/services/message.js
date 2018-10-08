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
const client = require("./client.js");
const {options: {colors}} = require("./data.js");
const random = require("../utils/random.js");
const str = require("../utils/string.js");
module.exports = {
  canUseRole(guild, role) {
    const member = guild.members.get(client.user.id);
    if(member.permission.has("manageRoles") === false)
      return false;
    let highest = 0;
    for(let i = 0; i < member.roles.length; i++) {
      const pos = guild.roles.get(member.roles[i]).position;
      if(pos > highest)
        highest = pos;
    }
    return highest > role.position;
  },
  create(channel, content, color, file) {
    const canSend = this.verifyChannelPerms(channel);
    if(!canSend)
      return;
    let result;
    if(typeof content === "string") {
      result = this.embed({
        color,
        description: content
      });
    }else{
      result = this.embed({
        color,
        ...content
      });
    }
    return channel.createMessage(result, file);
  },
  async dm(user, content, color, file) {
    const channel = await user.getDMChannel();
    return this.create(channel, content, color, file);
  },
  edit(msg, content) {
    const [{color}] = msg.embeds;
    let result;
    if(typeof content === "string") {
      result = this.embed({
        color,
        description: content
      });
    }else{
      result = this.embed({
        color,
        ...content
      });
    }
    return msg.edit(result);
  },
  embed(base) {
    let embed;
    if(typeof base === "string")
      embed.description = base;
    else
      embed = base;
    if(typeof embed.color === "string")
      embed.color = random.element(colors[embed.color]);
    return {
      content: "",
      embed
    };
  },
  getUser(id) {
    const user = client.users.get(id);
    if(user != null)
      return user;
    try {
      return client.getRESTUser(id);
    }catch(e) {
      console.log(e);
      if(e.code !== 10013)
        throw e;
    }
  },
  tag(user, pure = false) {
    if(pure)
      return `${user.username}#${user.discriminator}`;
    return `${str.escapeMarkdown(user.username)}#${user.discriminator}`;
  },
  verifyChannelPerms(channel) {
    if(channel.guild == null)
      return true;
    const perms = channel.permissionsOf(channel.guild.shard.client.user.id);
    return perms.has("sendMessages") && perms.has("embedLinks");
  }
};
