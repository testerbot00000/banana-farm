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
const number = require("./number.js");
const str = require("./string.js");
const {times} = require("../services/data.js");
module.exports = {
  format(ms, detail = 2) {
    const units = ["under a millisecond"];
    for(let i = 0; i < times.length; i++) {
      const num = number.floor(ms / times[i].ms % times[i].next);
      if(num !== 0)
        units.splice(0, 1, `${num} ${times[i].name}${num === 1 ? "" : "s"}`);
    }
    return detail === 1 ? units[0] : str.list(units.slice(0, detail));
  },
  formatNow() {
    return new Date().toLocaleDateString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }
};
