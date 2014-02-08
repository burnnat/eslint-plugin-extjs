/**
 * @fileoverview Rule to flag use of Ext.Array.each() when Ext.Array.forEach()
 *   would be better.
 * 
 * @author Nat Burns
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
	
	"use strict";
	
	var findFunctionAncestor = function(ancestors) {
		var ancestor;
		
		while (ancestors.length > 0) {
			ancestor = ancestors.pop();
			
			if (ancestor.type === "FunctionExpression") {
				return ancestor;
			}
		}
		
		return null;
	};
	
	var calls = [];
	
	return {
		"ReturnStatement": function(node) {
			if (calls.length === 0 || !node.argument) {
				return;
			}
			
			var parent = calls[calls.length - 1];
			
			if (!parent.isExtArray) {
				return;
			}
			
			var fn = findFunctionAncestor(context.getAncestors());
			
			if (parent.fn === fn) {
				parent.hasEarlyTermination = true;
			}
		},
		
		"CallExpression": function(node) {
			var info = {
				node: node
			};
			
			var callee = node.callee;
			var arg = node.arguments[0];
			
			if (callee.type === "MemberExpression") {
				var obj = callee.object;
				var name = callee.property.name;
				
				if (
					(name === "each" || name === "forEach")
						&& obj.type === "MemberExpression"
						&& obj.object.name === "Ext"
						&& obj.property.name === "Array"
				) {
					var fn = node.arguments[1];
					
					if (fn) {
						info.isExtArray = true;
						info.fn = fn;
						info.name = name;
						info.hasEarlyTermination = false;
					}
				}
			}
			
			calls.push(info);
		},
		
		"CallExpression:after": function() {
			var call = calls.pop();
			
			if (
				call.isExtArray
					&& call.name === "each"
					&& !call.hasEarlyTermination
			) {
				context.report(
					call.node,
					"Use Ext.Array.forEach() rather than Ext.Array.each()."
				);
			}
		}
	};
	
};