/**
 * @fileoverview Tests for ext-deps rule.
 * @author Nat Burns
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/ext-deps", {
	valid: [
		{
			code: "Ext.define('App.Class', { requires: ['Ext.panel.Panel'], constructor: function() { this.panel = new Ext.panel.Panel(); } });",
			global: {
				Ext: true,
				App: true
			}
		},
		{
			code: "Ext.define('App.Class', { requires: ['Ext.Ajax'], constructor: function() { this.timeout = Ext.Ajax.defaultTimeout; } });",
			global: {
				Ext: true,
				App: true
			}
		},
		{
			code: "Ext.define('App.Class', { requires: ['Ext.container.Viewport'], constructor: function() { this.viewport = new Ext.Viewport(); } });",
			global: {
				Ext: true,
				App: true
			}
		},
		{
			code: "Ext.define('App.Class', { requires: ['Ext.Viewport'], constructor: function() { this.viewport = new Ext.container.Viewport(); } });",
			global: {
				Ext: true,
				App: true
			}
		},
		{
			code: "Ext.define('App.Class', { uses: ['App.Panel'], constructor: function() { this.panel = Ext.create('App.Panel'); } });",
			global: {
				Ext: true,
				App: true
			}
		},
		{
			code: "Ext.define('App.Class', { uses: ['Ext.state.Manager', 'Ext.state.CookieProvider'], init: function() { Ext.state.Manager.setProvider(new Ext.state.CookieProvider()); } });",
			global: {
				Ext: true,
				App: true
			}
		},
		{
			code: "Ext.define('App.Class', { extend: 'App.Parent' });",
			global: {
				Ext: true,
				App: true
			}
		},
		{
			code: "Ext.define('App.Class', { extend: 'App.Parent', constructor: function() { App.Parent.register(this); } });",
			global: {
				Ext: true,
				App: true
			}
		},
		{
			code: "Ext.define('App.Class', { constructor: function() { this.names = Ext.Array.from(Ext.ClassManager.getName(this.self)); } });",
			global: {
				Ext: true,
				App: true
			}
		}
	],
	invalid: [
		{
			code: "Ext.define('App.Class', { requires: ['Ext.panel.Panel'] });",
			global: {
				Ext: true,
				App: true
			},
			errors: [
				{
					message: "The dependency Ext.panel.Panel is never used by the parent class App.Class.",
					type: "CallExpression"
				}
			]
		},
		{
			code: "Ext.define('App.Class', { uses: ['Ext.panel.Panel'] });",
			global: {
				Ext: true,
				App: true
			},
			errors: [
				{
					message: "The dependency Ext.panel.Panel is never used by the parent class App.Class.",
					type: "CallExpression"
				}
			]
		},
		{
			code: "Ext.define('App.Class', { constructor: function() { this.panel = new Ext.panel.Panel(); } });",
			global: {
				Ext: true,
				App: true
			},
			errors: [
				{
					message: "Class Ext.panel.Panel is referenced by App.Class but not listed as a dependency.",
					type: "CallExpression"
				}
			]
		},
		{
			code: "Ext.define('App.Class', { constructor: function() { this.panel = Ext.create('Ext.panel.Panel'); } });",
			global: {
				Ext: true,
				App: true
			},
			errors: [
				{
					message: "Class Ext.panel.Panel is referenced by App.Class but not listed as a dependency.",
					type: "CallExpression"
				}
			]
		},
		{
			code: "Ext.define('App.Class', { constructor: function() { Ext.tip.QuickTipManager.init(); } });",
			global: {
				Ext: true,
				App: true
			},
			errors: [
				{
					message: "Class Ext.tip.QuickTipManager is referenced by App.Class but not listed as a dependency.",
					type: "CallExpression"
				}
			]
		}
	]
});