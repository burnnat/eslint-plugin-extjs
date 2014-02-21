var foundation = require("./conf/foundation.json");
var alternates = require("./conf/alternates.json");
var aliases = require("./conf/aliases.json");

var camel = "(?:[A-Z]+[a-z0-9]*)+";
var lower = "[a-z]+[a-z0-9]*";

var aliasRe = /^(.*?)\.(.*)$/;
var namespaceRe = new RegExp("^" + camel + "$");
var classRe = new RegExp("^" + camel + "(?:\\." + lower + ")*\\." + camel);

var ClassList = function() {
	this.foundation = {};
	this.namespaces = {};
	this.alternates = {};
	this.aliases = {
		layout: {},
		proxy: {},
		widget: {}
	};
};

ClassList.prototype.loadFoundation = function(map) {
	var me = this;
	
	Object.keys(map)
		.forEach(function(key) {
			me.foundation[key] = map[key];
		});
};

ClassList.prototype.loadAlternates = function(map) {
	var me = this;
	
	Object.keys(map)
		.forEach(function(key) {
			var values = map[key];
			
			if (values.length > 0) {
				values.forEach(function(alternate) {
					me.alternates[alternate] = key;
				});
			}
		});
};

ClassList.prototype.loadAliases = function(map) {
	var me = this;
	
	Object.keys(map)
		.forEach(function(key) {
			var values = map[key];
			
			if (values.length > 0) {
				values.forEach(function(alias) {
					var parts = alias.match(aliasRe);
					
					var aliases = me.aliases[parts[1]];
					
					if (aliases) {
						aliases[parts[2]] = key;
					}
				});
			}
		});
};

ClassList.prototype.loadScope = function(scope) {
	var me = this;
	
	scope.variables.forEach(function(variable) {
		var name = variable.name;
		
		if (namespaceRe.test(name)) {
			me.namespaces[name] = true;
		}
	});
};

ClassList.prototype.getClassName = function(member) {
	var cls = classRe.exec(member);
	
	if (cls) {
		var name = cls[0];
		var namespace = name.split(".")[0];
		
		if (this.namespaces[namespace]) {
			return name;
		}
	}
	
	return null;
};

module.exports = {
	loadDefaults: function() {
		var classes = new ClassList();
		
		classes.loadFoundation(foundation);
		classes.loadAlternates(alternates);
		classes.loadAliases(aliases);
		
		return classes;
	}
};