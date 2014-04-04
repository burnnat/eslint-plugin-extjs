eslint-extjs
============

ESLint rules for projects using the ExtJS framework.

## Rule Details

### ext-array-foreach

The two main array iterator functions provided by ExtJS, [`Ext.Array.forEach`][ext-array-foreach]
and [`Ext.Array.each`][ext-array-each], differ in that `each` provides extra
functionality for early termination and reverse iteration. The `forEach` method,
however, will delegate to the browser's native [`Array.forEach`][array-foreach]
implementation where available, for performance. So, in situations where the
extra features of `each` are not needed, `forEach` should be preferred. As the
`forEach` documentation says:

> [Ext.Array.forEach] will simply delegate to the native Array.prototype.forEach
> method if supported. It doesn't support stopping the iteration by returning
> false in the callback function like each. However, performance could be much
> better in modern browsers comparing with each.

The following patterns are considered warnings:

    Ext.Array.each(
        ['a', 'b'],
        function() {
            // do something
        }
    );
    
    Ext.Array.each(
        ['a', 'b'],
        function() {
            // do something
        },
        this,
        false
    );

The following patterns are not considered warnings:

    Ext.Array.forEach(
        ['a', 'b'],
        function() {
            // do something
        }
    );
    
    Ext.Array.each(
        ['a', 'b'],
        function(item) {
            if (item === 'a') {
                return false;
            }
        }
    );
    
    Ext.Array.each(
        ['a', 'b'],
        function() {
            // do something
        },
        this,
        true
    );

### ext-deps

One problem with larger ExtJS projects is keeping the [`uses`][ext-uses] and
[`requires`][ext-requires] configs for a class synchronized as its body changes
over time and dependencies are added and removed. This rule checks that all
external references within a particular class have a corresponding entry in the
`uses` or `requires` config, and that there are no extraneous dependencies
listed in the class configuration that are not referenced in the class body.

The following patterns are considered warnings:

    Ext.define('App', {
        requires: ['Ext.panel.Panel']
    });
    
    Ext.define('App', {
        constructor: function() {
            this.panel = new Ext.panel.Panel();
        }
    });

The following patterns are not considered warnings:

    Ext.define('App', {
        requires: ['Ext.panel.Panel'],
        
        constructor: function() {
            this.panel = new Ext.panel.Panel();
        }
    });
    
    Ext.define('App', {
        extend: 'Ext.panel.Panel'
    });

### no-ext-create

While using [`Ext.create`][ext-create] for instantiation has some benefits
during development, mainly synchronous loading of missing classes, it remains
slower than the `new` operator due to its extra overhead. For projects with
properly configured [`uses`][ext-uses] and [`requires`][ext-requires] blocks,
the extra features of `Ext.create` are not needed, so the `new` keyword should
be preferred in cases where the class name is static. This is confirmed by
Sencha employees, one of whom has [said][ext-create-forum]:

> 'Ext.create' is slower than 'new'. Its chief benefit is for situations where
> the class name is a dynamic value and 'new' is not an option. As long as the
> 'requires' declarations are correct, the overhead of 'Ext.create' is simply
> not needed.

The following patterns are considered warnings:

    var panel = Ext.create('Ext.util.Something', {
        someConfig: true
    });

The following patterns are not considered warnings:

    var panel = new Ext.util.Something({
        someConfig: true
    });
    
    var panel = Ext.create(getDynamicClassName(), {
        config: true
    });

### no-ext-multi-def

Best practices for ExtJS 4 [dictate][ext-class-system] that each class
definition be placed in its own file, and that the filename should correspond to
the class being defined therein. This rule checks that there is no more than one
top-level class definition included per file.

The following patterns are considered warnings:

    // all in one file
    Ext.define('App.First', {
        // ...
    });
    Ext.define('App.Second', {
        // ...
    });

The following patterns are not considered warnings:

    // file a
    Ext.define('App', {
        // class definition
    });
    
    // file b
    Ext.define('App', {
        dynamicDefine: function() {
            Ext.define('Dynamic' + Ext.id(), {
                // class definition
            });
        }
    });

[array-foreach]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
[ext-array-foreach]: http://docs.sencha.com/extjs/4.2.1/#!/api/Ext.Array-method-forEach
[ext-array-each]: http://docs.sencha.com/extjs/4.2.1/#!/api/Ext.Array-method-each
[ext-class-system]: http://docs.sencha.com/extjs/4.2.1/#!/guide/class_system-section-2%29-source-files
[ext-create]: http://docs.sencha.com/extjs/4.2.1/#!/api/Ext-method-create
[ext-create-forum]: http://www.sencha.com/forum/showthread.php?166536-Ext.draw-Ext.create-usage-dropped-why&p=700522&viewfull=1#post700522
[ext-requires]: http://docs.sencha.com/extjs/4.2.1/#!/api/Ext.Class-cfg-requires
[ext-uses]: http://docs.sencha.com/extjs/4.2.1/#!/api/Ext.Class-cfg-uses