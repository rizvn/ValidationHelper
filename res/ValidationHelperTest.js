function runValidationHelperTests(){
  module("Validation Helper Tests");

  test("Test empty validation", function() {
    var obj = new ValidationHelper($("#dummy"), "");
    obj.isRequired();
    equal(false, obj.isValid(), "Should not be valid");

    var obj = new ValidationHelper($("#dummy"), "ee");
    obj.isRequired();
    equal(true, obj.isValid(), "Should be valid");
  });

  test("Test digit validation", function() {
    var obj = new ValidationHelper($("#dummy"), "5");
    obj.isDigit();
    equal(true, obj.isValid(), "Should be valid");

    var obj = new ValidationHelper($("#dummy"), "e");
    obj.isDigit();
    equal(false, obj.isValid(), "Should be invalid");

    var obj = new ValidationHelper($("#dummy"), "e");
    obj.isDigit();
    equal(false, obj.isValid(), "Should be invalid");
  });

  test("Test in range validation", function() {
    var obj = new ValidationHelper($("#dummy"), "5");
    obj.inRange(5, 10);
    equal(true, obj.isValid(), "Should be valid");

    var obj = new ValidationHelper($("#dummy"), "10");
    obj.inRange(5, 10);
    equal(true, obj.isValid(), "Should be valid");

    var obj = new ValidationHelper($("#dummy"), "11");
    obj.inRange(5, 10);
    equal(false, obj.isValid(), "Should be invalid");

    var obj = new ValidationHelper($("#dummy"), "4");
    obj.inRange(5, 10);
    equal(false, obj.isValid(), "Should be invalid");

    var obj = new ValidationHelper($("#dummy"), "5.7");
    obj.inRange(5, 10);
    equal(true, obj.isValid(), "Should be invalid");

  });

  test("Test combination of validation", function(){
    var obj = new ValidationHelper($("#dummy"), '5');
    obj.isRequired().isDigit();
    equal(true, obj.isValid(), "Should be valid");
  });


  test("Validation test greater than", function(){
    var obj = new ValidationHelper($("#dummy"), '5');
    obj.isGreaterThan(4);
    equal(true, obj.isValid(), "Should be valid");

    obj.isGreaterThan(6);
    equal(false, obj.isValid(), "Should be valid");
  });

  test("Validation test less than", function(){
    var obj = new ValidationHelper($("#dummy"), '5');
    obj.isLessThan(6);
    equal(true, obj.isValid(), "Should be valid");

    obj.isLessThan(4);
    equal(false, obj.isValid(), "Should be valid");
  });

  test("Validation test decimal", function(){
    var obj = new ValidationHelper($("#dummy"), '5.6');
    obj.isDecimal();
    equal(true, obj.isValid(), "Should be valid");

    var obj = new ValidationHelper($("#dummy"), '56');
    obj.isDecimal();
    equal(true, obj.isValid(), "Should be valid");

  });

  test("Validation test date", function(){
    var obj = new ValidationHelper($("#dummy"), '01/01/2001');
    obj.isDate();
    equal(true, obj.isValid(), "Should be valid");
    var obj = new ValidationHelper($("#dummy"), '01/01/01');
    obj.isDate();
    equal(false, obj.isValid(), "Should be valid");
  });

  test("Test conf values set", function(){
    var obj = new ValidationHelper("","", {continueOnInvalid: false});
    equal(obj.mConf.continueOnInvalid, false, "should be set to false");

    var obj = new ValidationHelper("","", {validateEmpty: true});
    equal(obj.mConf.validateEmpty, true, "should be set to true");
  })

  test("Precheck continue on invalid check", function(){
    var obj = new ValidationHelper("", "ff");
    obj.mIsValid = false;
    equal(obj.preCheck(), true, "Should return true");

    var obj = new ValidationHelper("","ff", {continueOnInvalid: false});
    obj.mIsValid = false;
    equal(obj.preCheck(), false, "Should return false");
  });

  test("Precheck continue on empty value", function(){
    var obj = new ValidationHelper("", "");
    equal(obj.preCheck(), false, "Should return false");

    var obj = new ValidationHelper("","", {validateEmpty: true});
    equal(obj.preCheck(), true, "Should return true");
  });

  test("Should call precheck method", function(){
    var obj = new ValidationHelper("","", {validateEmpty: true});
    this.spy(obj, "preCheck");
    obj.isRequired();
    ok(obj.preCheck.calledOnce);
  });

  test("test isValidRemote method precheck method", function(){
    var obj = new ValidationHelper($("dummy"),"123");
    obj.isValidRemote("testData/validResponse.html", {some: "data"}).end();
    equal(obj.isValid(), true, "Should is valid");

    var obj = new ValidationHelper($("dummy"),"123");
    obj.isValidRemote("testData/inValidResponse.html", {some: "data"}).end();
    equal(obj.isValid(), false, "Should be invalid");
  });

  test("test error label placed in specified container", function(){
    //setup
    $("body").append("<div id='errContainer'><div>");

    var obj = new ValidationHelper($("#dummy"), "", {target: $("#errContainer")});
    obj.isRequired();
    if($("#errContainer .error").length >0){
      ok(true, "Error label placed in target element");
    }
    else{
      ok(false, "element does not contain error label")
    }

    //teardown
    $("#errContainer").remove();
  })

}