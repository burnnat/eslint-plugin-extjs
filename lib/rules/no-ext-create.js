/**
 * @fileoverview Rule to flag use of Ext.create()
 * @author Nat Burns
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
	
	"use strict";
	
	return {
		"CallExpression": function(node) {
			var callee = node.callee;
			var arg = node.arguments[0];
			
			if (
				callee.type === "MemberExpression"
					&& callee.object.name === "Ext"
					&& callee.property.name === "create"
					&& arg
					&& arg.type === "Literal"
					&& typeof arg.value === "string"
			) {
				context.report(
					node,
					"Use new {{name}}() rather than Ext.create('{{name}}').",
					{
						name: arg.value
					}
				)
			}
		}
	};
	
};