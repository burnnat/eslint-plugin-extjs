var assert = require("assert");
var path = require("path");
var classdata = require("../../lib/classdata");

describe("classdata", function() {
	it("should load bootstrap files", function() {
		var classes = classdata.loadBootstrap(
			path.join(__dirname, "../conf/bootstrap.js")
		);
		
		assert.equal(classes.alternates["App.Orig"], "App.Original");
		assert.equal(classes.alternates["App.DoodadMgr"], "App.doodad.Manager");
		assert.equal(classes.alternates["App.DoodadManager"], "App.doodad.Manager");
		
		assert.equal(classes.aliases.widget.appwidget, "App.Widget");
		assert.equal(classes.aliases.proxy.appproxy, "App.Proxy");
		assert.equal(classes.aliases.proxy.app, "App.Proxy");
	});
});