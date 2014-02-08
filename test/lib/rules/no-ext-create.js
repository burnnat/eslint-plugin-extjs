/**
 * @fileoverview Tests for no-ext-create rule.
 * @author Nat Burns
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/no-ext-create", {
	valid: [
		"var panel = new Ext.util.Something({ create: true });"
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