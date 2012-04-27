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
    ignoreEmpty: false
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
  $(this.mEl).after("<label class='error'>" + aMessage + "</label>");
};

/*----------- Start of validation methods ----------------------*/
ValidationHelper.prototype.isRequired = function() {
  _before_pointcut;
  if (this.mValue == "") {
    this.mIsValid = false;
    this.onFail("Required");
  }
  return this;
};

ValidationHelper.prototype.isDigit = function() {
  _before_pointcut;
  var re = /^\d*$/;
  if (!re.test(this.mValue)) {
    this.mIsValid = false;
    this.onFail("Must be an integer.");
  }
  return this;
};

ValidationHelper.prototype.isDate = function() {
  _before_pointcut;
  var re = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!re.test(this.mValue)) {
    this.mIsValid = false;
    this.onFail("Invalid date.");
  }
  return this;
};

ValidationHelper.prototype.isDecimal = function() {
  _before_pointcut;
  var re = /^\d*.\d*$/;
  if (!re.test(this.mValue)) {
    this.mIsValid = false;
    this.onFail("Must be an integer.");
  }
  return this;
};


ValidationHelper.prototype.inRange = function(aMin, aMax) {
  _before_pointcut;
  var value = parseFloat(this.mValue);
  var min = parseFloat(aMin);
  var max = parseFloat(aMax);
  if ((value < min) || (value > max)) {
    this.mIsValid = false;
    this.onFail("Value is not between " + min + " and " + max);
  }
  return this;
};


ValidationHelper.prototype.isGreaterThan = function(aVal) {
  _before_pointcut;
  var value = parseFloat(this.mValue);
  var aVal = parseFloat(aVal);
  if ( value < aVal) {
    this.mIsValid = false;
    this.onFail("Value is less than " + aVal);
  }
  return this;
};

ValidationHelper.prototype.isLessThan = function(aVal) {
  _before_pointcut;
  if(!this.mIsValid && !this.mConf.continueOnInvalid) return this;
  var value = parseFloat(this.mValue);
  var aVal = parseFloat(aVal);
  if ( value > aVal) {
    this.mIsValid = false;
    this.onFail("Value is greater than " + aVal);
  }
  return this;
};

//weave aspects
(function(){
  //advice to weave in
  var _beforeAdvice = "\
      if(!this.mIsValid && !this.mConf.continueOnInvalid){\
        return this;\
      }\
      if((this.mValue == '' || typeof(this.mValue) =='undefined') \
          && this.mConf.ignoreEmpty){\
        return this;\
      };"

  //iterate over functions
  for(key in ValidationHelper.prototype){
    var func = ValidationHelper.prototype[key].toString();

    //if function has pointcut label then weave in advice at pointcut
    if(func.indexOf("_before_pointcut;") >-1){
      func = func.replace("_before_pointcut;", _beforeAdvice);
      eval("ValidationHelper.prototype."+key+"="+func);
    }
  }
})();




//todo: Methods to implement
// isEqual
// isLongerThan
// isShorterThan
// isLength
// isDate
// isRemote






