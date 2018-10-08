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
module.exports = {
  floor(n) {
    const floored = Math.floor(n);
    if(Math.abs(n - floored) >= 0.999999991)
      return n >= 0 ? Math.ceil(n) : floored;
    return n >= 0 ? floored : Math.ceil(n);
  },
  format(num, points = 0) {
    if(num < 1e3 && num > -1e3)
      return points === 0 ? this.floor(num) : num.toFixed(points);
    return num.toLocaleString("en-US", {maximumFractionDigits: 0});
  }
};
