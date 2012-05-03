/**
 * Validation Helper
 * Version 0.1
 *
 * author Riz
 */

/*Constructor
 * @param aEl Element after which error will be placed
 * @param aValue Value to validate
 */
function ValidationHelper(aEl, aValue, aConf) {
  this.mValue = aValue;
  this.mIsValid = true;
  this.mEl = aEl;
  this.mConf = {
    continueOnInvalid : true,
    validateEmpty: false,
    target: null,
  };

  if(typeof(aConf) == "object"){
    $.extend(this.mConf, aConf);
  }
};

/**
 * Get Values set via constructor
 */
ValidationHelper.prototype.getValue = function() {
  return this.mValue;
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
  $('.error').remove();
  $(".invalidInput").removeClass("invalidInput")
  return this;
};


ValidationHelper.prototype.onFail = function(aMessage) {
  $(this.mEl).addClass("invalidInput");

  if(this.mConf.target == null){
    $(this.mEl).after("<label class='error'>" + aMessage + "</label>");
  }else{
    $(this.mConf.target).append("<label class='error'>" + aMessage + "</label>");
  }

};

/*----------- Start of validation methods ----------------------*/
ValidationHelper.prototype.isRequired = function() {
  var old = this.mConf.validateEmpty;
  this.mConf.validateEmpty = true;
  if(this.preCheck()){
    if (this.mValue == "") {
      this.mIsValid = false;
      this.onFail("Required");
    }
  }
  this.mConf.validateEmpty = old;
  return this;
};

ValidationHelper.prototype.isDigit = function() {
  if(this.preCheck()){
    var re = /^\d*$/;
    if (!re.test(this.mValue)) {
      this.mIsValid = false;
      this.onFail("Must be an integer.");
    }
  }
  return this;
};

ValidationHelper.prototype.isDate = function() {
  if(this.preCheck()){
    var re = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!re.test(this.mValue)) {
      this.mIsValid = false;
      this.onFail("Invalid date.");
    }
  }
  return this;
};

ValidationHelper.prototype.isDecimal = function() {
  if(this.preCheck()){
    var re = /^\d*.\d*$/;
    if (!re.test(this.mValue)) {
      this.mIsValid = false;
      this.onFail("Must be an integer.");
    }
  }
  return this;
};


ValidationHelper.prototype.inRange = function(aMin, aMax) {
  if(this.preCheck()){
    var value = parseFloat(this.mValue);
    var min = parseFloat(aMin);
    var max = parseFloat(aMax);
    if ((value < min) || (value > max)) {
      this.mIsValid = false;
      this.onFail("Value is not between " + min + " and " + max);
    }
  }
  return this;
};


ValidationHelper.prototype.isGreaterThan = function(aVal) {
  if(this.preCheck()){
    var value = parseFloat(this.mValue);
    var aVal = parseFloat(aVal);
    if ( value < aVal) {
      this.mIsValid = false;
      this.onFail("Value is less than " + aVal);
    }
  }
  return this;
};

ValidationHelper.prototype.isLessThan = function(aVal) {
  if(this.preCheck()){
    var value = parseFloat(this.mValue);
    var aVal = parseFloat(aVal);
    if ( value > aVal) {
      this.mIsValid = false;
      this.onFail("Value is greater than " + aVal);
    }
  }
  return this;
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
}


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
    })
    .done(function(aResponse) {
      //when request is complete
      result = aResponse;
    })
    .fail(function(aError){
      //if request fails
      console.log(aError)
    });

    if(result == null){
      //if request failed
      this.mIsValid = false;
      this.onFail("Remote validation failed");
    }
    else if(result.isValid=="false"){
      //if server responded rejected field
      this.mIsValid = false;
      this.onFail((typeof(aMsg)=="undefined")? "Invalid input" : aMsg);
    }

  }

  return this;
}



//todo: Methods to implement
// isEqual
// isLongerThan
// isShorterThan
// isLength

