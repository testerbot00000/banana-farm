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
const {regexes} = require("../services/data.js");
module.exports = {
  format(str, ...args) {
    return str.replace(regexes.format, (m, i) => args[i]);
  },
  list(arr, and = "and") {
    if(arr.length < 3)
      return arr.join(and);
    return `${arr.slice(0, -1).join(", ")}, ${and} ${arr[arr.length - 1]}`;
  }
};
