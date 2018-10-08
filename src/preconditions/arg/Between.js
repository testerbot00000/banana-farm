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
const {ArgumentPrecondition, PreconditionResult} = require("patron.js");
const number = require("../../utils/number.js");
module.exports = new class Between extends ArgumentPrecondition {
  constructor() {
    super({name: "between"});
  }
  async run(cmd, msg, arg, args, val, opt) {
    let {max, min} = opt;
    if(opt.format == null)
      opt.format = n => number.format(n);
    if(typeof max === "function")
      max = await max(args);
    if(typeof min === "function")
      min = await min(args);
    if(val == null || ((min == null || val >= min) && (max == null
        || val <= max))) {
      return PreconditionResult.fromSuccess();
    }else if(typeof opt.format === "function") {
      if(max != null)
        max = opt.format(max);
      if(min != null)
        min = opt.format(min);
    }
    if(min == null) {
      return PreconditionResult.fromError(
        cmd,
        `the ${arg.name} must be less than or equal to ${max}.`
      );
    }else if(max == null) {
      return PreconditionResult.fromError(
        cmd,
        `the ${arg.name} must be greater than or equal to ${min}.`
      );
    }
    return PreconditionResult.fromError(
      cmd,
      `the ${arg.name} must be between ${min} and ${max}.`
    );
  }
}();
