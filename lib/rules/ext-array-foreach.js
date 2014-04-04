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
				parent.usesExtraFeature = true;
			}
		},
		
		"CallExpression": function(node) {
			var info = {
				node: node
			};
			
			var callee = node.callee;
			var args = node.arguments;
			
			if (callee.type === "MemberExpression") {
				var obj = callee.object;
				var name = callee.property.name;
				
				if (
					(name === "each" || name === "forEach")
						&& obj.type === "MemberExpression"
						&& obj.object.name === "Ext"
						&& obj.property.name === "Array"
				) {
					var fn = args[1];
					
					if (fn) {
						info.isExtArray = true;
						info.fn = fn;
						info.name = name;
						info.usesExtraFeature = false;
						
						if (name === "each") {
							var reverse = args[3];
							
							if (
								reverse &&
									(
										reverse.type !== "Literal" ||
										reverse.value !== false
									)
							) {
								info.usesExtraFeature = true;
							}
						}
					}
				}
			}
			
			calls.push(info);
		},
		
		"CallExpression:exit": function() {
			var call = calls.pop();
			
			if (
				call.isExtArray
					&& call.name === "each"
					&& !call.usesExtraFeature
			) {
				context.report(
					call.node,
					"Use Ext.Array.forEach() rather than Ext.Array.each()."
				);
			}
		}
	};
	
};