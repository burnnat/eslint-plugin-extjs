/**
 * @fileoverview Rule to flag multiple Ext.define() calls in a single file
 * @author Nat Burns
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
	
	"use strict";
	
	var count = 0;
	
	return {
		"CallExpression": function(node) {
			var callee = node.callee;
			var arg = node.arguments[0];
			
			if (
				callee.type === "MemberExpression"
					&& callee.object.name === "Ext"
					&& callee.property.name === "define"
					&& arg
					&& arg.type === "Literal"
					&& typeof arg.value === "string"
			) {
				count++;
				
				if (count > 1) {
					context.report(
						node,
						"Only one class definition is allowed per file."
					);
				}
			}
		}
	};
	
};