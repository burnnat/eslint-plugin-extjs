/**
 * @fileoverview Tests for ext-array-foreach rule.
 * @author Nat Burns
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/ext-array-foreach", {
	valid: [
		"Ext.Array.forEach(['a'], function() {});",
		"Ext.Array.each(['a'], function(item) { if (item === 'a') { return false; } });",
		"Ext.Array.each(['a'], function() {}, this, true);"
	],
	invalid: [
		{
			code: "Ext.Array.each(['a'], function() {});",
			errors: [
				{
					message: "Use Ext.Array.forEach() rather than Ext.Array.each().",
					type: "CallExpression"
				}
			]
		},
		{
			code: "Ext.Array.each(['a'], function() {}, this, false);",
			errors: [
				{
					message: "Use Ext.Array.forEach() rather than Ext.Array.each().",
					type: "CallExpression"
				}
			]
		}
	]
});