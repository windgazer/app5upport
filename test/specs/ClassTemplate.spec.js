
describe("ClassTemplate", function() {
	
	var t = "<div id=\"${id}\" class=\"ClassTemplate.spec\"><h3>${title}</h3><p>${value}</p></div>",
		t1 = "<div id=\"id\" class=\"ClassTemplate.spec\"><h3>myTitle</h3><p>value</p></div>",
		t2 = "<div id=\"myId\" class=\"ClassTemplate.spec\"><h3>myTitle</h3><p>myValue</p></div>",
		t3 = "<div id=\"id\" class=\"ClassTemplate.spec\"><h3>myTitle</h3><p>And this is a somewhat longer value type with some <code>&lt;html></code> in the mix :)</p></div>",
		tt = "ClassTemplate.spec",
		oldTemplates = {};

	beforeEach(function() {
	    ClassTemplate.reset();
	});

	afterEach(function() {
		ClassTemplate.templates = oldTemplates;
	});
	
	it("loads a template for ClassTemplate.spec type", function() {

		runs(function() {
			ClassTemplate.loadTemplate(tt);
		});
		
		waitsFor(function() {
			return ClassTemplate.getTemplate(tt) !== null;
		}, "The template should be available", 500);
		
		runs(function() {
			var tmplt = ClassTemplate.getTemplate(tt);
			console.debug( tmplt );
			expect( tmplt ).toBe( t );
		});
		
	});

	it("parses and renders templates with provided value", function() {
	
		var tmplt = ClassTemplate.fillTemplate( t, {
			title: "myTitle"
		} );
		expect( tmplt ).toBe( t1 );

	});

	it("parses and renders templates with provided values", function() {
	
		var tmplt = ClassTemplate.fillTemplate( t, {
			title: "myTitle",
			id : "myId",
			value : "myValue"
		} );
		expect( tmplt ).toBe( t2 );

	});

	it("parses and renders templates with complex values", function() {
	
		var tmplt = ClassTemplate.fillTemplate( t, {
			title: "myTitle",
			value : "And this is a somewhat longer value type with some <code>&lt;html></code> in the mix :)"
		} );
		expect( tmplt ).toBe( t3 );

	});

});
