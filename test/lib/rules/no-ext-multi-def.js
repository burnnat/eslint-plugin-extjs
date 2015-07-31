/**
 * @fileoverview Tests for no-ext-multi-def rule.
 * @author Nat Burns
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-ext-multi-def");
var RuleTester = require("eslint").RuleTester;
var tester = new RuleTester();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

tester.run("no-ext-multi-def", rule, {
	valid: [
		"Ext.define('App.Single', {});",
		"Ext.define('App.Single', { constructor: function() { Ext.define('Dynamic' + Ext.id(), {}); } });"
	],
	invalid: [
		{
			code: "Ext.define('App.First', {}); Ext.define('App.Second', {});",
			errors: [
				{
					message: "Only one class definition is allowed per file.",
					type: "CallExpression"
				}
			]
		},
		{
			code: "Ext.define('App.First', {}); Ext.define('App.Second', {}); Ext.define('App.Third', {});",
			errors: [
				{
					message: "Only one class definition is allowed per file.",
					type: "CallExpression"
				},
				{
					message: "Only one class definition is allowed per file.",
					type: "CallExpression"
				}
			]
		}
	]
});