/**
 * @fileoverview Tests for no-ext-create rule.
 * @author Nat Burns
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-ext-create");
var RuleTester = require("eslint").RuleTester;
var tester = new RuleTester();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

tester.run("no-ext-create", rule, {
	valid: [
		"var panel = new Ext.util.Something({ create: true });",
		"var panel = Ext.create(getDynamicClassName(), { config: true });"
	],
	invalid: [
		{
			code: "var panel = Ext.create('Ext.util.Something', { config: true });",
			errors: [
				{
					message: "Use new Ext.util.Something() rather than Ext.create('Ext.util.Something').",
					type: "CallExpression"
				}
			]
		}
	]
});