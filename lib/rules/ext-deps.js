/**
 * @fileoverview Rule to flag missing and unused dependencies in ExtJS classes.
 * @author Nat Burns
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
	
	"use strict";
	
	var namespaces = {};
	var calls = [];
	
	var getPropertyKey = function(property) {
		var key = property.key;
		
		if (key.type === "Identifier") {
			return key.name;
		}
		else if (key.type === "Literal") {
			return "" + key.value;
		}
		
		return null;
	};
	
	var addDependency = function(typeName) {
		calls[calls.length - 1].dependencies[typeName] = true;
	};
	
	var addReference = function(typeName) {
		calls[calls.length - 1].references[typeName] = true;
	};
	
	var handleTypes = function(node, key, callback, types) {
		if (types.string && node.type === "Literal" && typeof node.value === "string") {
			callback(node.value);
		}
		else if (types.array && node.type === "ArrayExpression") {
			node.elements.forEach(function(element) {
				handleTypes(element, key, callback, types);
			});
		}
		else {
			context.report(
				node,
				"Unexpected {{node}} encountered in {{key}} config.",
				{
					node: node.type,
					key: key
				}
			);
		}
	};
	
	var parseReference = function(node) {
		if (node.type === "Identifier") {
			return node.name;
		}
		else if (node.type === "MemberExpression") {
			var obj = parseReference(node.object);
			var prop = parseReference(node.property);
			
			if (obj && prop) {
				return obj + "." + prop;
			}
		}
		
		return null;
	};
	
	var camel = "(?:[A-Z]+[a-z0-9]*)+";
	var lower = "[a-z]+[a-z0-9]*";
	
	var namespaceRe = new RegExp("^" + camel + "$");
	var classRe = new RegExp("^" + camel + "(?:\\." + lower + ")*\\." + camel);
	
	return {
		
		"Program": function() {
			var globalScope = context.getScope();
			
			globalScope.variables.forEach(function(variable) {
				var name = variable.name;
				
				if (namespaceRe.test(name)) {
					namespaces[name] = true;
				}
			});
		},
		
		"MemberExpression": function(node) {
			var ancestors = context.getAncestors();
			var parent = ancestors[ancestors.length - 1];
			
			if (parent.type !== "MemberExpression") {
				var name = parseReference(node);
				
				if (name) {
					var cls = classRe.exec(name);
					
					if (cls) {
						var namespace = cls[0].split(".")[0];
						
						if (namespaces[namespace]) {
							addReference(cls);
						}
					}
				}
			}
		},
		
		"CallExpression": function(node) {
			var info = {
				node: node,
				references: {}
			};
			
			calls.push(info);
			
			var callee = node.callee;
			var method = callee.property
				? callee.property.name
				: null;
			
			var args = node.arguments;
			var arg;
			
			if (callee.type === "MemberExpression" && callee.object.name === "Ext") {
				if (method === "create" && args.length > 0) {
					arg = node.arguments[0];
					
					if (arg.type === "Literal" && typeof arg.value === "string") {
						addReference(arg.value);
					}
				}
				else if (method === "define" && args.length > 1) {
					arg = node.arguments[0];
					
					if (arg.type === "Literal" && typeof arg.value === "string") {
						info.name = arg.value;
					}
					
					arg = node.arguments[1];
					
					if (arg.type === "ObjectExpression") {
						info.dependencies = {};
						
						arg.properties.forEach(function(prop) {
							var key = getPropertyKey(prop);
							
							var handler;
							var types;
							
							if (key === "requires" || key === "uses") {
								handler = addDependency;
								
								types = {
									string: true,
									array: true
								};
							}
							else if (key === "extend") {
								handler = function(type) {
									addDependency(type);
									addReference(type);
								};
								
								types = { string: true };
							}
							
							if (handler) {
								handleTypes(prop.value, key, handler, types);
							}
						});
					}
				}
			}
		},
		
		"CallExpression:exit": function() {
			var call = calls.pop();
			
			var deps = call.dependencies;
			var refs = call.references;
			
			if (deps) {
				Object.keys(refs).forEach(function(name) {
					if (refs[name] && !deps[name]) {
						context.report(
							call.node,
							"Class {{name}} is referenced by {{parent}} but not listed as a dependency.",
							{
								name: name,
								parent: call.name
							}
						);
					}
				});
				
				Object.keys(deps).forEach(function(name) {
					if (deps[name] && !refs[name]) {
						context.report(
							call.node,
							"The dependency {{name}} is never used by the parent class {{parent}}.",
							{
								name: name,
								parent: call.name
							}
						);
					}
				});
			}
			else if (calls.length > 0) {
				var parent = calls[calls.length - 1].references;
				
				Object.keys(refs).forEach(function(name) {
					parent[name] = parent[name] || refs[name];
				});
			}
		}
	};
	
};