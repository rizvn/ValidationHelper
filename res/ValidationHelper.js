/**
 * Validation Helper
 * Version 0.4
 *
 * author Riz
 */

/*Constructor
 * @param aEl element to validate
 */
function ValidationHelper(aEl) {
  return this.init(aEl);
};

/* constructor delegate to allow reinitialise of the same object with a new
 *  element
 *  @param aEl element to validate
 */
ValidationHelper.prototype.init = function(aEl) {
  this.mValue = aEl.val();
  this.mIsValid = true;
  this.mEl = aEl;
  this.mConf = {
    continueOnInvalid : true,
    validateEmpty: false,
    target: null,
    errorCls : "error",
    invalidInputCls: "invalidInput",
  };

  return this;
};

/**
 * Get Values set via constructor
 */
ValidationHelper.prototype.getValue = function() {
  return this.mValue;
};

ValidationHelper.prototype.setValue = function(aVal) {
  this.mValue = aVal;
  return this;
};

ValidationHelper.prototype.setTarget = function(aTarget) {
  this.mConf.target = aTarget;
  return this;
};

ValidationHelper.prototype.setContinueOnInvalid = function(aContinue) {
  this.mConf.continueOnInvalid = aContinue;
  return this;
};

ValidationHelper.prototype.setValidateEmpty = function(aValidatEmpty) {
  this.mConf.validateEmpty = aValidatEmpty;
  return this;
};

ValidationHelper.prototype.isValid = function() {
  return this.mIsValid;
};

ValidationHelper.prototype.end = function() {
  return this.mIsValid;
};

ValidationHelper.prototype.getEl = function() {
  return this.mEl;
};

ValidationHelper.prototype.resetAll = function() {
  $("."+ this.mConf.errorCls).remove();
  $("."+ this.mConf.invalidInputCls).removeClass("invalidInput")
  return this;
};

ValidationHelper.prototype.setErrorClass = function(aClassName) {
  this.mConf.errorCls = aClassName;
  return this;
};

ValidationHelper.prototype.setInvalidInputClass = function(aClassName) {
  this.mConf.invalidInputCls = aClassName;
  return this;
};


ValidationHelper.prototype.onFail = function(aMessage) {
  this.mEl.addClass(this.mConf.invalidInputCls);

  if(this.mConf.target == null){
    this.mEl.after("<label class='"+ this.mConf.errorCls +"'>" + aMessage + "</label>");
  }else{
    $(this.mConf.target).append("<label class='"+ this.mConf.errorCls +"'>" + aMessage + "</label>");
  }
};

//Logically And result with another boolean to track validation
ValidationHelper.prototype.and = function(aBoolean){
  return aBoolean && this.mIsValid;
};


ValidationHelper.prototype.preCheck = function(){
  var _continue = true;
  // test whether to continue if state is invalid
  if(!this.mIsValid){
    _continue = this.mConf.continueOnInvalid;
  }

  // test whether to in value is empty
  if((this.mValue == '' || typeof(this.mValue) =='undefined')){
    _continue = this.mConf.validateEmpty;
  };

  return _continue;
};

/*----------- Start of validation methods ----------------------*/
ValidationHelper.prototype.isRequired = function(aMsg) {
  var old = this.mConf.validateEmpty;
  this.mConf.validateEmpty = true;
  if(this.preCheck()){
    if (this.mValue == "") {
      this.mIsValid = false;
      this.onFail(aMsg || "Required");
    }
  }
  this.mConf.validateEmpty = old;
  return this;
};

ValidationHelper.prototype.isDigit = function(aMsg) {
  if(this.preCheck()){
    var re = /^\d*$/;
    if (!re.test(this.mValue)) {
      this.mIsValid = false;
      this.onFail(aMsg || "Must be an integer.");
    }
  }
  return this;
};

ValidationHelper.prototype.isDate = function(aMsg) {
  if(this.preCheck()){
    var re = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!re.test(this.mValue)) {
      this.mIsValid = false;
      this.onFail(aMsg || "Invalid date.");
    }
  }
  return this;
};

ValidationHelper.prototype.isDecimal = function(aMsg) {
  if(this.preCheck()){
    var re = /^\d*.\d*$/;
    if (!re.test(this.mValue)) {
      this.mIsValid = false;
      this.onFail(aMsg || "Must be an integer.");
    }
  }
  return this;
};


ValidationHelper.prototype.inRange = function(aMin, aMax, aMsg) {
  if(this.preCheck()){
    var value = parseFloat(this.mValue);
    var min = parseFloat(aMin);
    var max = parseFloat(aMax);
    if ((value < min) || (value > max)) {
      this.mIsValid = false;
      this.onFail(aMsg || "Value is not between " + min + " and " + max);
    }
  }
  return this;
};


ValidationHelper.prototype.isGreaterThan = function(aVal, aMsg) {
  if(this.preCheck()){
    var value = parseFloat(this.mValue);
    var aVal = parseFloat(aVal);
    if ( value < aVal) {
      this.mIsValid = false;
      this.onFail(aMsg || "Value is less than " + aVal);
    }
  }
  return this;
};

ValidationHelper.prototype.isLessThan = function(aVal, aMsg) {
  if(this.preCheck()){
    var value = parseFloat(this.mValue);
    var aVal = parseFloat(aVal);
    if ( value > aVal) {
      this.mIsValid = false;
      this.onFail(aMsg || "Value is greater than " + aVal);
    }
  }
  return this;
};

ValidationHelper.prototype.isNot = function(aVal, aMsg) {
  if(this.preCheck()){
    if ( this.mValue === aVal) {
      this.mIsValid = false;
      this.onFail(aMsg || "Value is the same " + aVal);
    }
  }
  return this;
};





ValidationHelper.prototype.isValidRemote = function(aUrl, aData, aMsg){
  if(this.preCheck()){
    //add value to data object
    aData.value =  this.mValue;
    var thisClass = this;
    var result = null;

    $.ajax({
      "type" : "GET",
      "cache": false ,
      "url"  : aUrl,
       async: false,
      "data" : aData,
      "dataType": "json",
      "timeout" : "10",
      "success": function(aResponse){
        result = aResponse;
      },
      "error": function(aError){
        console.log(aError);
      }
    });

    if(result == null){
      //if request failed
      this.mIsValid = false;
      this.onFail("Remote validation failed");
    }
    else if(result.isValid==false){ //is server responds with false
      this.mIsValid = false;

      if((typeof(aMsg)=="undefined")){//if no msg arg specified

        if(result.hasOwnProperty('error')){ //if server responds with error
          this.onFail(result.error);
        }
        else{
          this.onFail("Invalid input");
        }
      }
      else{
        this.onFail(aMsg);
      }

    }

  }

  return this;
}

ValidationHelper.prototype.isLongerThan = function(aVal, aMsg) {
  if(this.preCheck()){
    if ( this.mValue.length < aVal) {
      this.mIsValid = false;
      this.onFail(aMsg || "Must be  " + aVal + " characters");
    }
  }
  return this;
};

ValidationHelper.prototype.isShorterThan = function(aVal, aMsg) {
  if(this.preCheck()){
    if ( this.mValue.length > aVal) {
      this.mIsValid = false;
      this.onFail(aMsg || "Must be  less than " + aVal + " characters");
    }
  }
  return this;
};


ValidationHelper.prototype.isLength = function(aVal, aMsg) {
  if(this.preCheck()){
    if ( this.mValue.length != aVal) {
      this.mIsValid = false;
      this.onFail(aMsg || "Length is not" + aVal );
    }
  }
  return this;
};

ValidationHelper.prototype.isEqual = function(aVal, aMsg) {
  if(this.preCheck()){
    if ( this.mValue != aVal) {
      this.mIsValid = false;
      this.onFail(aMsg || "Does not match");
    }
  }
  return this;
};

ValidationHelper.prototype.isRegExpMatch = function(aRegExp, aMsg){
  if(this.preCheck()){
    if (!this.mValue.match(aRegExp)>0) {
      this.mIsValid = false;
      this.onFail(aMsg || "Does not match");
    }
  }
  return this;
};