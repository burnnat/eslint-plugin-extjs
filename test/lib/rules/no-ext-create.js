/**
 * @fileoverview Tests for no-ext-create rule.
 * @author Nat Burns
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var linter = require("eslint").linter;
var ESLintTester = require("eslint-tester");
var eslintTester = new ESLintTester(linter);

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/no-ext-create", {
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